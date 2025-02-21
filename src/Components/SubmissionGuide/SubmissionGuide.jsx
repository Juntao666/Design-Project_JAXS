import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';
import './SubmissionGuide.css';

const TEXT_READ_ENDPOINT = `${BACKEND_URL}/texts`;

function ErrorMessage({ message }) {
  return <div className="error-message">{message}</div>;
}
ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
};

// If a section contains more than one line,
// we treat the first line as a heading and the rest as bullet items.
function renderFormattedText(text) {
  const sections = text.split('\n\n').filter(section => section.trim() !== '');
  return sections.map((section, idx) => {
    const lines = section.split('\n').filter(line => line.trim() !== '');
    if (lines.length > 1) {
      return (
        <div key={idx}>
          <p>{lines[0]}</p>
          <ul>
            {lines.slice(1).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      );
    }
    return <p key={idx}>{lines[0]}</p>;
  });
}

function SubmissionGuide() {
  const [error, setError] = useState('');
  const [subGuideText, setSubGuideText] = useState('');

  const fetchSubGuideText = () => {
    axios.get(TEXT_READ_ENDPOINT)
      .then(({ data }) => {
        setSubGuideText(data.submission_guidelines.text);
      })
      .catch((error) =>
        setError(`There was a problem retrieving the about text. ${error}`)
      );
  };

  useEffect(fetchSubGuideText, []);

  return (
    <div className="about-container">
      <h1>Submission Guide</h1>
      {error && <ErrorMessage message={error} />}
      {subGuideText ? renderFormattedText(subGuideText) : <p>Loading...</p>}
    </div>
  );
}

export default SubmissionGuide;
