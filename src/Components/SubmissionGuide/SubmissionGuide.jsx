import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';
import './SubmissionGuide.css';

const TEXT_READ_ENDPOINT = `${BACKEND_URL}/texts`;
const ADD_MANUSCRIPT_ENDPOINT = `${BACKEND_URL}/manus`;
const VALID_ACTIONS_ENDPOINT = `${BACKEND_URL}/manu/valid_actions`;


function ErrorMessage({ message }) {
  return <div className="error-message">{message}</div>;
}
ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
};

function SubmitManuscriptForm({ visible, cancel, setError }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [text, setText] = useState('');
  const [abstract, setAbstract] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    const key = `${author}_${title}_${dateStr}`;

    const manuscript = {
      key,
      title,
      author,
      author_email: authorEmail,
      state: 'SUB',
      text,
      abstract,
      editors: [],
      referees: [],
      history: [],
    };

    axios.post(ADD_MANUSCRIPT_ENDPOINT, manuscript)
      .then(() => {
        setSuccess(true);
        setTitle('');
        setAuthor('');
        setAuthorEmail('');
        setText('');
        setAbstract('');
        setTimeout(() => setSuccess(false), 3000);
        cancel();
      })
      .catch((error) => {
        setError(`There was a problem submitting the manuscript. ${error}`);
      });
  };

  if (!visible) return null;
  return (
    <form className="manuscript-form">
      {success && <div className="success-message">Manuscript submitted successfully!</div>}
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input required type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="form-group">
        <label htmlFor="author">Author</label>
        <input required type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>

      <div className="form-group">
        <label htmlFor="authorEmail">Author Email</label>
        <input required type="email" id="authorEmail" value={authorEmail} onChange={(e) => setAuthorEmail(e.target.value)} />
      </div>

      <div className="form-group">
        <label htmlFor="abstract">Abstract</label>
        <textarea required id="abstract" value={abstract} onChange={(e) => setAbstract(e.target.value)} />
      </div>

      <div className="form-group">
        <label htmlFor="text">Full Text</label>
        <textarea required id="text" value={text} onChange={(e) => setText(e.target.value)} />
      </div>

      <div className="form-buttons">
        <button type="submit" className="form-button" onClick={handleSubmit}>Submit</button>
        <button type="button" className="form-button" onClick={cancel}>Cancel</button>
      </div>
    </form>
  );
}

SubmitManuscriptForm.propTypes = {
  visible: propTypes.bool.isRequired,
  cancel: propTypes.func.isRequired,
  setError: propTypes.func.isRequired,
};

function SubmissionGuide() {
  const [error, setError] = useState('');
  const [subGuideText, setSubGuideText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentState, setCurrentState] = useState('SUB');
  const [validActions, setValidActions] = useState([]);

  useEffect(() => {
    axios.get(TEXT_READ_ENDPOINT)
      .then(({ data }) => {
        setSubGuideText(data.submission_guidelines.text);
      })
      .catch((error) =>
        setError(`There was a problem retrieving the submission guide text. ${error}`)
      );
  }, []);

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  const fetchValidActions = () => {
    axios.get(`${VALID_ACTIONS_ENDPOINT}/${currentState}`)
      .then(({ data }) => {
        setValidActions(data.valid_actions);
        setError('');
      })
      .catch((error) => {
        setError(`Failed to fetch valid actions: ${error}`);
      });
  }; 

  return (
    <div className="submission-guide-container">
      <h1>Submission Guide</h1>
      {error && <ErrorMessage message={error} />}
      <p className="formatted-text">
        {subGuideText || "Loading..."}
      </p>
      <button type="button" onClick={openForm}>
          Submit Manuscripts
      </button>

      <SubmitManuscriptForm
        visible={showForm}
        cancel={closeForm}
        setError={setError}
      />

      <div className="form-group" style={{ marginTop: '20px' }}>
        <label htmlFor="state">Manuscript State</label>
        <input
          type="text"
          id="state"
          value={currentState}
          onChange={(e) => setCurrentState(e.target.value)}
        />
        <button type="button" onClick={fetchValidActions}>
          Show Valid Actions
        </button>
        <pre>{JSON.stringify(validActions, null, 2)}</pre>

      </div>

    </div>
  );
}

export default SubmissionGuide;
