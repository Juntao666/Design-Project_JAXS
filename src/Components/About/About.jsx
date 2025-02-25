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

  const fetchAboutText = () => {
    axios.get(TEXT_READ_ENDPOINT)
      .then(({ data }) => {
        setAboutText(data.about.text);
      })
      .catch((error) => setError(`There was a problem retrieving the about text. ${error}`));
  };

  useEffect(fetchAboutText, []);

  return (
    <div className="about-container">
      <h1>About Us</h1>
      {error && <ErrorMessage message={error} />}
      <p>{aboutText || "Loading..."}</p>
    </div>
  );
}

export default About;
