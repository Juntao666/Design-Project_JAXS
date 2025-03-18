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

function SubmissionGuide() {
  const [error, setError] = useState('');
  const [subGuideText, setSubGuideText] = useState('');

  useEffect(() => {
    axios.get(TEXT_READ_ENDPOINT)
      .then(({ data }) => {
        setSubGuideText(data.submission_guidelines.text);
      })
      .catch((error) =>
        setError(`There was a problem retrieving the submission guide text. ${error}`)
      );
  }, []);

  return (
    <div className="submission-guide-container">
      <h1>Submission Guide</h1>
      {error && <ErrorMessage message={error} />}
      <p className="formatted-text">
        {subGuideText || "Loading..."}
      </p>
    </div>
  );
}

export default SubmissionGuide;
