import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';
import './About.css';

const TEXT_READ_ENDPOINT = `${BACKEND_URL}/texts`;

function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      {message}
    </div>
  );
}

ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
};

function About() {
  const [error, setError] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');

  const fetchAboutText = () => {
    axios.get(TEXT_READ_ENDPOINT)
      .then(({ data }) => {
        setAboutText(data.about.text);
      })
      .catch(err => setError(`There was a problem retrieving the about text. ${err}`));
  };

  useEffect(fetchAboutText, []);

  const rolesStr = localStorage.getItem('userRoles');
  const userRoles = rolesStr ? JSON.parse(rolesStr) : [];
  const hasEditorRole = userRoles.includes('ED');

  const handleEdit = () => {
    setEditText(aboutText);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditText(aboutText);
    setIsEditing(false);
  };

  const handleSave = () => {
    axios.put(
      `${TEXT_READ_ENDPOINT}/about`,
      { title: 'About Us', text: editText }
    )
    .then(() => {
      setAboutText(editText);
      setIsEditing(false);
    })
    .catch(() => setError('Failed to save changes. Please try again.'));
  };

  return (
    <div className="about-container">
      <h1>About Us</h1>
      {error && <ErrorMessage message={error} />}

      {isEditing ? (
        <div className="edit-section">
          <textarea
            value={editText}
            onChange={e => setEditText(e.target.value)}
            rows={10}
            cols={60}
          />
          <div className="button-row">
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <p>{aboutText || 'Loading...'}</p>
      )}

      {hasEditorRole && !isEditing && (
        <button className="edit-button" onClick={handleEdit}>
          Edit
        </button>
      )}
    </div>
  );
}

export default About;
