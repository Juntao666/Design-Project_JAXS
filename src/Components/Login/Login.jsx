import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/login`, { username, password });
      if (response.status === 200) {
        setSuccess(true);
        setLoading(false);
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/login/create`, { username, password });
      if (response.status === 201) {
        setSuccess(true);
        setLoading(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Registration failed: Password does not meet requirements.');
      } else if (error.response && error.response.status === 409) {
        setError('Registration failed: Username already exists.');
      } else {
        setError('Registration failed. Please try again.');
      }
      setLoading(false);
    }
  };

  const switchToLogin = () => {
    setSuccess(false);
    setIsRegistering(false);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <>
      <div className="login-container">
        {success ? (
          <>
            <h1>{isRegistering ? 'Registration Successful' : 'Login Successful'}</h1>
            {isRegistering && (
              <button className="switch-button" onClick={switchToLogin}>
                Go to Login
              </button>
            )}
          </>
        ) : (
          !loading && (
            <>
              <h1>{isRegistering ? 'Register' : 'Login'}</h1>
              {error && <p className="error">{error}</p>}
              {isRegistering && (
                <div className="password-requirements">
                  <h4>Password Requirements:</h4>
                  <ul>
                    <li>At least 8 characters long</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one lowercase letter</li>
                    <li>At least one digit</li>
                    <li>At least one special character (!@#$%^&*(),.?:{}|&lt;&gt;)</li>
                  </ul>
                </div>
              )}
              <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                <div className="input-group">
                  <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="student@nyu.edu"
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                {isRegistering && (
                  <div className="input-group">
                    <label htmlFor="confirm-password">Confirm Password:</label>
                    <input
                      type="password"
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                )}
                <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
              </form>
              <p>
                {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                <span
                  className="toggle-form"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                    setSuccess(false);
                  }}
                >
                  {isRegistering ? 'Login' : 'Register'}
                </span>
              </p>
            </>
          )
        )}
      </div>
      <div className="white-space"></div>
    </>
  );
}

export default Login;