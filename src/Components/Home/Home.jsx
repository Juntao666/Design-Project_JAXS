import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';
import './Home.css';

const TITLE_READ_ENDPOINT = `${BACKEND_URL}/project_name`;

const Cube = () => (
  <div className="cube">
    <div className="face front" />
    <div className="face back" />
    <div className="face right" />
    <div className="face left" />
    <div className="face top" />
    <div className="face bottom" />
  </div>
);

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

function Home() {
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');

  const fetchTitle = () => {
    axios.get(TITLE_READ_ENDPOINT)
      .then(({ data }) => {
        setTitle(data["Project Name"]);
      })
      .catch((error) => setError(`There was a problem retrieving the title. ${error}`));
  };

  useEffect(fetchTitle, []);

  return (
    <div className="home-container">
      <div className="corner-cubes top-left">
        {[0, 1, 2].map((i) => (
          <Cube key={`tl-${i}`} />
        ))}
      </div>

      <div className="corner-cubes bottom-right">
        {[0, 1, 2].map((i) => (
          <Cube key={`br-${i}`} />
        ))}
      </div>
      <div className="title-wrapper">
        <h1 className="title sway-text">{title || "JAXS"}</h1>
      </div>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

export default Home;
