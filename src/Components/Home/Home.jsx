import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import { BACKEND_URL } from '../../constants';
import './Home.css';

const TITLE_READ_ENDPOINT = `${BACKEND_URL}/project_name`;

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
      <h1> {title || "Journal"} </h1>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

export default Home;
