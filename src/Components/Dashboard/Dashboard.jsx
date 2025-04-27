import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';
import './Dashboard.css';

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
  const [targetState, setTargetState] = useState('');
  const [showAbstract, setShowAbstract] = useState(false);
  const [showText, setShowText] = useState(false);

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
    const payload = {
      _id: manuscript.key,
      action,
      referee,
      target_state: targetState,
    };
    axios.put(UPDATE_ACTION_ENDPOINT, payload)
      .then(() => {
        setError('');
        refresh(); // Refresh manuscripts after action
      })
      .catch((error) => {
        setError(`Failed to perform action: ${error}`);
      });
  };

  return (
    <div>
      <div className="manuscript-container">
        <h2>{manuscript.title}</h2>
        <p>Author: {manuscript.author}</p>
        <p>State: {manuscript.state}</p>

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

        <input
        type="text"
        placeholder="Referee"
        value={referee}
        onChange={(e) => setReferee(e.target.value)}
        />
        <input
          type="text"
          placeholder="Target State (EDM Only)"
          value={targetState}
          onChange={(e) => setTargetState(e.target.value)}
        />

        <div className="actions">
          {validActions.map((action) => (
            <button key={action} onClick={() => performAction(action)}>
              {action}
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
    state: propTypes.string.isRequired,
    abstract: propTypes.string.isRequired,
    text: propTypes.string.isRequired,
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
  const [sortOrder, setSortOrder] = useState('subFirst');

  const fetchManuscripts = () => {
    axios.get(MANUSCRIPTS_ENDPOINT)
      .then(({ data }) => {
        const arr = manuscriptObjectToArray(data);
        //arr.sort((a, b) => a.state.localeCompare(b.state));
        sortManuscripts(arr, sortOrder);
        setManuscripts(arr);
      })
      .catch((error) => setError(`There was a problem retrieving manuscripts. ${error}`));
  };

  const sortManuscripts = (manuscripts, order) => {
    if (order === 'subFirst') {
      // Put SUB states first, then sort alphabetically
      manuscripts.sort((a, b) => {
        if (a.state === 'SUB' && b.state !== 'SUB') return -1;
        if (a.state !== 'SUB' && b.state === 'SUB') return 1;
        return a.state.localeCompare(b.state);
      });
    } else if (order === 'alphabetical') {
      manuscripts.sort((a, b) => a.state.localeCompare(b.state));
    }
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'subFirst' ? 'alphabetical' : 'subFirst';
    setSortOrder(newOrder);
    
    // Re sort the current manuscripts
    const manuscriptsCopy = [...manuscripts];
    sortManuscripts(manuscriptsCopy, newOrder);
    setManuscripts(manuscriptsCopy);
  };

  useEffect(fetchManuscripts, []);

  return (
    <div className="dashboard-wrapper">
      <header>
        <h1>View All Manuscripts</h1>
        <button onClick={toggleSortOrder}>
          {sortOrder === 'subFirst' ? 'Sort Alphabetically' : 'Show Submissions First'}
        </button>
      </header>

      {error && <ErrorMessage message={error} />}
      {manuscripts.map((manuscript) => (
        <Manuscript
          key={manuscript.key}
          manuscript={manuscript}
          refresh={fetchManuscripts}
          setError={setError}
        />
      ))}
    </div>
  );
}

export default Manuscripts;

