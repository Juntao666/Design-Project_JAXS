import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';
import './SubmissionGuide.css';

const TEXT_READ_ENDPOINT = `${BACKEND_URL}/texts`;
const ADD_MANUSCRIPT_ENDPOINT = `${BACKEND_URL}/manus`;

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
  const [state, setState] = useState('');
  const [text, setText] = useState('');
  const [abstract, setAbstract] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const manuscript = {
      title,
      author,
      author_email: authorEmail,
      state,
      text,
      abstract,
    };

    axios.post(ADD_MANUSCRIPT_ENDPOINT, manuscript)
      .then(() => {
        setSuccess(true);
        setTitle('');
        setAuthor('');
        setAuthorEmail('');
        setState('');
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
      <label htmlFor="title">Title</label>
      <input required type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />

      <label htmlFor="author">Author</label>
      <input required type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />

      <label htmlFor="authorEmail">Author Email</label>
      <input required type="email" id="authorEmail" value={authorEmail} onChange={(e) => setAuthorEmail(e.target.value)} />

      <label htmlFor="state">State</label>
      <input required type="text" id="state" value={state} onChange={(e) => setState(e.target.value)} />

      <label htmlFor="abstract">Abstract</label>
      <textarea required id="abstract" value={abstract} onChange={(e) => setAbstract(e.target.value)} />

      <label htmlFor="text">Full Text</label>
      <textarea required id="text" value={text} onChange={(e) => setText(e.target.value)} />

      <div>
        <button type="submit" onClick={handleSubmit}>Submit</button>
        <button type="button" onClick={cancel}>Cancel</button>
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

  return (
    <div className="submission-guide-container">
      <h1>Submission Guide</h1>
      {error && <ErrorMessage message={error} />}
      <p className="formatted-text">
        {subGuideText || "Loading..."}
      </p>
      <button type="button" onClick={openForm}>
          Submit Manuscript
      </button>

      <SubmitManuscriptForm
        visible={showForm}
        cancel={closeForm}
        setError={setError}
      />

    </div>
  );
}

export default SubmissionGuide;
