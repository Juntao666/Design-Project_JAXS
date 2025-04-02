import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
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
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="people" element={<People />} />
        <Route path="people/:name" element={<PersonPage />} />
        <Route path="about" element={<About />} />
        <Route path="masthead" element={<Masthead />} />
        <Route path="submission_guide" element={<SubmissionGuide />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
