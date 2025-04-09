import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import propTypes from 'prop-types';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import './Login.css';

function Login({ onLogin, onLogout }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // new email state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/login`, { username, password });
      if (response.status === 200) {
        localStorage.setItem('username', username);
        setLoading(false);
        onLogin();
        navigate('/dashboard');
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

    if (!email) {
      setError("Email is required for registration.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/login/create`, { username, email, password });
      if (response.status === 201) {
        localStorage.setItem('username', username);
        setIsRegistering(false);
        setLoading(false);
        onLogin();
        navigate('/dashboard');
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

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    onLogout();
    navigate('/');
  };

  return (
    <>
      <div className="login-container">
        {localStorage.getItem('username') ? (
          <>
            <h1>Welcome, {localStorage.getItem('username')}!</h1>
            <button onClick={handleLogout}>Logout</button>
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
                    placeholder="studentID"
                    required
                  />
                </div>
                {isRegistering && (
                  <div className="input-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@nyu.edu"
                      required
                    />
                  </div>
                )}
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

Login.propTypes = {
  onLogin: propTypes.func.isRequired,
  onLogout: propTypes.func.isRequired,
};

export default Login;
