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

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem('username'));
    };

  checkLoginStatus();

  window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} key={isLoggedIn ? 'logged-in' : 'logged-out'}/>
      <Routes>
        <Route path="" element={<Home />} />
        <Route
          path="people" element={isLoggedIn ? <People /> : <Navigate to="/login" />}
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
              onLogin={() => setIsLoggedIn(true)}
              onLogout={() => setIsLoggedIn(false)}
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
