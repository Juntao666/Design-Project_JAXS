import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import './Masthead.css';

const MASTHEAD_ENDPOINT = `${BACKEND_URL}/people/masthead`;

function Masthead() {
  const [masthead, setMasthead] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(MASTHEAD_ENDPOINT)
      .then(({ data }) => setMasthead(data.Masthead || {})) // 
      .catch((error) => setError(`There was a problem retrieving the masthead. ${error}`));
  }, []);

  return (
    <div className="masthead-wrapper">
      <h1>Journal Masthead</h1>
      {error && <p className="error">{error}</p>}
      {!masthead ? (
        <p>Loading...</p>
      ) : (
        <div>  
          <h2>Editors</h2>
          {Array.isArray(masthead.Editor) && masthead.Editor.length > 0 ? (
            <ul>
              {masthead.Editor.map((editor, index) => (
                <li key={index}>
                  <strong>{editor.name}</strong> 
                </li>
              ))}
            </ul>
          ) : (
            <p>No editors available.</p>
          )}
          
          <h2>Managing Editors</h2>
          {Array.isArray(masthead["Managing Editor"]) && masthead["Managing Editor"].length > 0 ? (
            <ul>
              {masthead["Managing Editor"].map((editor, index) => (
                <li key={index}>
                  <strong>{editor.name}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>No managing editors.</p>
          )}
          
          <h2>Consulting Editors</h2>
          {Array.isArray(masthead["Consulting Editor"]) && masthead["Consulting Editor"].length > 0 ? (
            <ul>
              {masthead["Consulting Editor"].map((editor, index) => (
                <li key={index}>
                  <strong>{editor.name}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>No consulting editors.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Masthead;
