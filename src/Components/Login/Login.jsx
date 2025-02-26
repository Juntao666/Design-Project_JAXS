import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const response = axios.post(`${BACKEND_URL}/login`, { username, password });
        if (response.status === 200) {
            setSuccess(true);
            setLoading(false);
            // might need to have a token or something in the future to track log in
        }
    } catch (error) { // if wrong credential is entered, there's a runtime error 401...
      setError( 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

    return (
    <div className="login-container">
      {success ? (
        // This is not showing up...
        <h1>Login Successful</h1>
      ) : (
        !loading && (
          <>
            <h1>Login</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
              <button type="submit">Login</button>
            </form>
          </>
        )
      )}
    </div>
  );
}

export default Login;
