import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';
import './Dashboard.css';

const MANUSCRIPTS_ENDPOINT = `${BACKEND_URL}/manus`;

function ErrorMessage({ message }) {
  return <div className="error-message">{message}</div>;
}
ErrorMessage.propTypes = {
  message: propTypes.string.isRequired,
};

function Manuscript({ manuscript }) {

  return (
    <div>
      <div className="manuscript-container">
        <h2>{manuscript.title}</h2>
        <p>Author: {manuscript.author}</p>
        <p>State: {manuscript.state}</p>
      </div>
    </div>
  );
}
Manuscript.propTypes = {
  manuscript: propTypes.shape({
    title: propTypes.string.isRequired,
    author: propTypes.string.isRequired,
    state: propTypes.string.isRequired,
  }).isRequired
};

function manuscriptObjectToArray(data) {
  return Object.values(data);
}

function Manuscripts() {
  const [error, setError] = useState('');
  const [manuscripts, setManuscripts] = useState([]);

  const fetchManuscripts = () => {
    axios.get(MANUSCRIPTS_ENDPOINT)
      .then(({ data }) => setManuscripts(manuscriptObjectToArray(data)))
      .catch((error) => setError(`There was a problem retrieving manuscripts. ${error}`));
  };

  useEffect(fetchManuscripts, []);

  return (
    <div className="dashboard-wrapper">
      <header>
        <h1>View All Manuscripts</h1>
      </header>

      {error && <ErrorMessage message={error} />}
      {manuscripts.map((manuscript) => (
        <Manuscript
          key={manuscript.title}
          manuscript={manuscript}
        />
      ))}
    </div>
  );
}

export default Manuscripts;

