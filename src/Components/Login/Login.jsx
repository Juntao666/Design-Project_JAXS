import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import propTypes from 'prop-types';
import axios from 'axios';
import { BACKEND_URL } from '../../constants';
import './Login.css';

const PEOPLE_ENDPOINT = `${BACKEND_URL}/people`;
const CREATE_PEOPLE_ENDPOINT = `${BACKEND_URL}/people/create`;
const LOGIN_ENDPOINT = `${BACKEND_URL}/login`;
const LOGIN_CREATE_ENDPOINT = `${BACKEND_URL}/login/create`;

function Login({ onLogin, onLogout }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // new email state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

const fetchUserRolesByEmail = async (email) => {
  try {
    const encodedEmail = encodeURIComponent(email);
    const response = await axios.get(`${PEOPLE_ENDPOINT}/${encodedEmail}/${username}`);
    const rawRoles = response.data.roles;

    if (Array.isArray(rawRoles)) {
      return rawRoles.map(r => r.trim());
    } else if (typeof rawRoles === 'string') {
      return rawRoles.split(',').map(r => r.trim()).filter(Boolean);
    } else {
      return [];
    }
  } catch (err) {
    console.error('Failed to fetch user roles:', err);
    return [];
  }
};

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(LOGIN_ENDPOINT, { username, password });
      if (response.status === 200) {
        const userEmail = response.data.email;

        localStorage.setItem('username', username);
        localStorage.setItem('email', userEmail);

        const userRoles = await fetchUserRolesByEmail(userEmail);

        localStorage.setItem('userRoles', JSON.stringify(userRoles));
        setLoading(false);
        onLogin(userRoles);
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
      const response = await axios.post(LOGIN_CREATE_ENDPOINT, { username, email, password });
      if (response.status === 201) {
        await axios.put(CREATE_PEOPLE_ENDPOINT, {
          name: username,
          email,
          affiliation: '',
          roles: 'AU',
        });

        const userRoles = await fetchUserRolesByEmail(email);

        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('userRoles', JSON.stringify(userRoles));

        setIsRegistering(false);
        setLoading(false);
        onLogin(userRoles);
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
    localStorage.removeItem('email');
    localStorage.removeItem('userRoles');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    onLogout();
    navigate('/');
  };

  function ProfileSection() {
    const [name, setName] = useState('');
    const [affiliation, setAffiliation] = useState('');
    const [roles, setRoles] = useState([]);
    const [editing, setEditing] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    
    const email = localStorage.getItem('email');
    const username = localStorage.getItem('username');

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const encodedEmail = encodeURIComponent(email);
          const response = await axios.get(`${PEOPLE_ENDPOINT}/${encodedEmail}/${username}`);
          setName(response.data.name);
          setAffiliation(response.data.affiliation || '');
          setRoles(response.data.roles || []);
        } catch (err) {
          console.error('Failed to fetch profile:', err);
          setErrorMsg('Failed to load profile.');
        }
      };
      fetchProfile();
    }, [email, username]);

    const deleteSelf = async () => {
      const userId = localStorage.getItem('username');
      const encodedEmail = encodeURIComponent(email);
      try {
        await axios.delete(`${PEOPLE_ENDPOINT}/${encodedEmail}/${userId}`);
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('userRoles');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        onLogout();
        navigate('/');
      } catch (err) {
        setErrorMsg('删除账户失败：' + err.message);
      }
    };
  
    const handleUpdate = async () => {
      try {
        await axios.post(`${PEOPLE_ENDPOINT}/update`, {
          name,
          email,
          affiliation,
          roles,
        });
        setEditing(false);
        setSuccessMsg('Profile updated successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        console.error('Update failed:', err);
        setErrorMsg('Update failed.');
      }
    };

    return (
    <div className="profile-section">
      <h1>Profile Page</h1>
      {errorMsg && <p className="error">{errorMsg}</p>}
      {successMsg && <p className="success">{successMsg}</p>}

      <div className="input-group">
        <label>Username:</label>
        <input type="text" value={username} readOnly />
      </div>

      <div className="input-group">
        <label>Email:</label>
        <input type="text" value={email} readOnly />
      </div>

      <div className="input-group">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          readOnly={!editing}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Affiliation:</label>
        <input
          type="text"
          value={affiliation}
          readOnly={!editing}
          onChange={(e) => setAffiliation(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Roles:</label>
        <input type="text" value={roles.join(', ')} readOnly />
      </div>

      {editing ? (
        <button onClick={handleUpdate}>Save</button>
      ) : (
        <button onClick={() => setEditing(true)}>Edit Profile</button>
      )}
      <button onClick={handleLogout}>Logout</button>
      <button onClick={deleteSelf}>Delete My Account</button>
    </div>
  );
}

  return (
    <>
      <div className="login-container">
        {localStorage.getItem('username') ? (
         <ProfileSection />
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
