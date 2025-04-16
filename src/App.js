import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  Navigate,
} from 'react-router-dom';

import './App.css';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import People from './Components/People';
import About from './Components/About';
import Home from './Components/Home';
import Masthead from './Components/Masthead';
import SubmissionGuide from './Components/SubmissionGuide';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';

function PersonPage() {
  const { name } = useParams();
  return <h1>{name}</h1>
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('username'));
  const [userRoles, setUserRoles] = useState(JSON.parse(localStorage.getItem('userRoles') || '[]'));

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem('username'));
      setUserRoles(JSON.parse(localStorage.getItem('userRoles')));
    };

  checkLoginStatus();

  window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const hasEditorRole = userRoles.includes('ED');
  console.log('App.js: Has editor role:', userRoles.includes('ED'));

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} hasEditorRole={hasEditorRole} />
      <Routes>
        <Route path="" element={<Home />} />
        <Route
          path="people" element={isLoggedIn && hasEditorRole ? <People /> : <Navigate to="/login" />}
        />
        <Route
          path="people/:name" element={isLoggedIn ? <PersonPage /> : <Navigate to="/login" />}
        />
        <Route path="about" element={<About />} />
        <Route path="masthead" element={<Masthead />} />
        <Route path="submission_guide" element={<SubmissionGuide />} />
        <Route
          path="login"
          element={
            <Login
              onLogin={(roles) => {
                console.log('App.js: User roles:', roles);
                setIsLoggedIn(true);
                setUserRoles(roles);
              }}
              onLogout={() => {
                setIsLoggedIn(false);
                setUserRoles([]);
              }}
            />
          }
        />
        <Route
          path="dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
