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
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [showForm, setShowForm] = useState(false);

  // get roles from localStorage
  const rolesStr = localStorage.getItem('userRoles');
  const userRoles = rolesStr ? JSON.parse(rolesStr) : [];
  const hasEditorRole = userRoles.includes('ED');

  const fetchSubGuideText = () => {
    axios.get(TEXT_READ_ENDPOINT)
      .then(({ data }) => {
        setSubGuideText(data.submission_guidelines.text);
      })
      .catch((err) => setError(`There was a problem retrieving the submission guide text. ${err}`));
  };

  useEffect(fetchSubGuideText, []);

  const handleEdit = () => {
    setEditText(subGuideText);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditText(subGuideText);
    setIsEditing(false);
  };

  const handleSave = () => {
    axios.put(
      `${TEXT_READ_ENDPOINT}/submission_guidelines`,
      { title: 'Submission Guide', text: editText }
    )
    .then(() => {
      setSubGuideText(editText);
      setIsEditing(false);
    })
    .catch(() => setError('Failed to save changes. Please try again.'));
  };

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  return (
    <div className="submission-guide-container">
      <h1>Submission Guide</h1>
      {error && <ErrorMessage message={error} />}

      {isEditing ? (
        <div className="edit-section">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={20}
            cols={100}
            style={{ width: '100%', maxWidth: '800px', minHeight: '400px' }}
          />
          <div className="button-row">
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <p className="formatted-text">{subGuideText || 'Loading...'}</p>
      )}

      {hasEditorRole && !isEditing && (
        <button className="edit-button" onClick={handleEdit}>
          Edit
        </button>
      )}

      <button type="button" onClick={openForm}>
        Submit Manuscripts
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
