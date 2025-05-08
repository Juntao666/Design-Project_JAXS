import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';
import './Dashboard.css';
import { actionMapping } from './ActionMapping';

const MANUSCRIPTS_ENDPOINT = `${BACKEND_URL}/manus`;
const VALID_ACTIONS_ENDPOINT = `${BACKEND_URL}/manu/valid_actions`;
const UPDATE_ACTION_ENDPOINT = `${BACKEND_URL}/manu/update_action`;

function ErrorMessage({ message }) {
  return <div className="error-message">{message}</div>;
}
ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
};

function Manuscript({ manuscript, refresh, setError}) {

  const [validActions, setValidActions] = useState([]);
  const [referee, setReferee] = useState('');
  const [localRefs, setLocalRefs] = useState(manuscript.referees || []);
  const [targetState, setTargetState] = useState('');
  const [showAbstract, setShowAbstract] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    setLocalRefs(manuscript.referees || []);
  }, [manuscript.referees]);

  useEffect(() => {
    axios.get(`${VALID_ACTIONS_ENDPOINT}/${manuscript.state}`)
      .then(({ data }) => {
        setValidActions(data.valid_actions);
        setError('');
      })
      .catch((error) => {
        setError(`Failed to fetch valid actions: ${error}`);
      });
  }, [manuscript.state]);

  const performAction = (action) => {
    const userEmail = localStorage.getItem('email');
    const isSRV = action === 'SRV';
    const payload = {
      _id: manuscript.key,
      action,
      referee,
      target_state: targetState,
    };

    axios.put(UPDATE_ACTION_ENDPOINT, payload)
      .then(() => {
        // Code to remove the referee so if the referee submits a review, the
        // manuscript is removed from their dashboard
        if (isSRV) {

          axios.post(`${BACKEND_URL}/manu/remove_referee`, {
            key: manuscript.key,
            referee: userEmail
          })
          .then(() => {
            setError('');
            setLocalRefs(localRefs.filter(r => r !== userEmail));
            refresh();
          })
          .catch((err) => {
            setError(`Review submitted but failed to remove referee: ${err}`);
          });
        } else {
          setError('');
          refresh();
        }
      })
      .catch((error) => {
        setError(`Failed to perform action: ${error}`);
      });
  };

    const assignReferee = () => {
    if (!referee) {
      setError('Please enter a referee email before assigning.');
      return;
    }

    axios.post(`${BACKEND_URL}/manu/assign_referee`, {
      key: manuscript.key,
      referee: referee
    })
    .then(() => {
      setError('');
      setLocalRefs([...localRefs, referee]);
      setReferee('');   // clear input
      refresh();
    })
    .catch(err => {
      if (err.response?.status === 404) {
        setError('Invalid email – please check and try again.');
      } else {
        setError('Could not assign referee right now. Please try again later.');
      }
    });
  };

  const getActionName = (action) => {
    return actionMapping[action] || action;
  }

  const getAllowedActionsForUser = () => {
    const userEmail = localStorage.getItem('email');
    const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    const isEditor = userRoles.includes('ED');
    const isAuthor = manuscript.author_email === userEmail;
    const isReferee = Array.isArray(manuscript.referees) && manuscript.referees.includes(userEmail);

    return validActions.filter(action => {
      if (isEditor) return true;

      if (isAuthor) {
        return ['WIT', 'AUR'].includes(action);
      }

      if (isReferee) {
        return manuscript.state === 'REV' && action === 'SRV';
      }

      return false;
    });
  };

  return (
    <div>
      <div className="manuscript-container">
        <h2>{manuscript.title}</h2>
        <p>Author: {manuscript.author}</p>
        <p>State: {getActionName(manuscript.state)}</p>

        <div className="manuscript-referees">
          <strong>Referees:</strong>{' '}
          {localRefs.length > 0
            ? localRefs.join(', ')
            : 'No referee'}
        </div>

        <div className="manuscript-text">
          <button onClick={() => setShowText(!showText)}>
            {showText ? 'Hide Text' : 'Show Text'}
          </button>
          {showText && 
            <p>{manuscript.text}</p>
          }   
        </div>

        <div className="manuscript-abstract">
          <button onClick={() => setShowAbstract(!showAbstract)}>
            {showAbstract ? 'Hide Abstract' : 'Show Abstract'}
          </button>
          {showAbstract && 
            <p>{manuscript.abstract}</p>
          }   
        </div>

        {JSON.parse(localStorage.getItem('userRoles') || '[]').includes('ED') && (
          <>
            <input
              type="text"
              placeholder="Referee (Email)"
              value={referee}
              onChange={(e) => setReferee(e.target.value)}
            />
            <input
              type="text"
              placeholder="Target State (EDM Only)"
              value={targetState}
              onChange={(e) => setTargetState(e.target.value)}
            />
          </>
        )}

        <div className="actions">
          {getAllowedActionsForUser().map((action) => (
            <button
              key={action}
              onClick={() => {
                if (action === 'ARF') {
                  assignReferee();
                } else {
                  performAction(action);
                }
              }}
            >
              {getActionName(action)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

Manuscript.propTypes = {
  manuscript: propTypes.shape({
    key: propTypes.string.isRequired,
    title: propTypes.string.isRequired,
    author: propTypes.string.isRequired,
    author_email: propTypes.string.isRequired,
    state: propTypes.string.isRequired,
    abstract: propTypes.string.isRequired,
    text: propTypes.string.isRequired,
    referees: propTypes.arrayOf(propTypes.string),
  }).isRequired,
  refresh: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};

function manuscriptObjectToArray(data) {
  return Object.entries(data).map(([key, value]) => ({
    ...value,
    key,
  }));
}
function Manuscripts() {
  const [error, setError] = useState('');
  const [manuscripts, setManuscripts] = useState([]);
  const [sortOrder] = useState('subFirst');
  const [currentState, setCurrentState] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const userEmail = localStorage.getItem('email');
  const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  const isEditor = userRoles.includes('ED');

  const fetchManuscripts = () => {
    axios.get(MANUSCRIPTS_ENDPOINT)
      .then(({ data }) => {
        let arr = manuscriptObjectToArray(data);

        if (!isEditor && userEmail) {
          arr = arr.filter(m =>
            m.author_email === userEmail ||
            (Array.isArray(m.referees) && m.referees.includes(userEmail))
          );
        }

        sortManuscripts(arr, sortOrder);
        setManuscripts(arr);
      })
      .catch((error) => setError(`There was a problem retrieving manuscripts. ${error}`));
  };

  const sortManuscripts = (manuscripts) => {
    const customStateOrder = ['SUB', 'REV', 'ARN', 'ERV', 'CED', 'AUR', 'FOR', 'PUB', 'REJ', 'WIT'];

    manuscripts.sort((a, b) => {
      const indexA = customStateOrder.indexOf(a.state);
      const indexB = customStateOrder.indexOf(b.state);

      const safeIndexA = indexA === -1 ? customStateOrder.length : indexA;
      const safeIndexB = indexB === -1 ? customStateOrder.length : indexB;

      return safeIndexA - safeIndexB;
    });
  };

  const toggleSortDropdown = () => {
    setShowSortDropdown(!showSortDropdown);
  };

  const selectState = (state) => {
    setCurrentState(state);
    setShowSortDropdown(false);
  };

  useEffect(fetchManuscripts, []);

  const stateOptions = [
    { code: '', label: 'All States' },
    { code: 'SUB', label: 'Submitted' },
    { code: 'REJ', label: 'Rejected' },
    { code: 'WIT', label: 'Author has withdrawn' },
    { code: 'AUR', label: 'Awaiting author review' },
    { code: 'ARN', label: 'Author revising' },
    { code: 'CED', label: 'Copy editing' },
    { code: 'ERV', label: 'Awaiting editor review' },
    { code: 'FOR', label: 'Undergoing formatting' },
    { code: 'PUB', label: 'Published' },
    { code: 'REV', label: 'Referee reviewing' }
  ];

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-row">
          <h1>Manuscript Dashboard</h1>
          <div className="dropdown-container">
            <button 
              className="dropdown-button"
              onClick={toggleSortDropdown}
            >
              Sort By: {currentState ? stateOptions.find(option => option.code === currentState)?.label : 'All States'}
            </button>
            
            {showSortDropdown && (
              <div className="dropdown-menu">
                <ul className="filter-list">
                  {stateOptions.map((option) => (
                    <li 
                      key={option.code} 
                      onClick={() => selectState(option.code)}
                      className={currentState === option.code ? 'selected' : ''}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {error && <ErrorMessage message={error} />}
      {manuscripts
        .filter(manuscript => currentState == '' || manuscript.state == currentState)
        .map((manuscript) => (
          <Manuscript
            key={manuscript.key}
            manuscript={manuscript}
            refresh={fetchManuscripts}
            setError={setError}
          />
        ))
      }
    </div>
  );
}

export default Manuscripts;
