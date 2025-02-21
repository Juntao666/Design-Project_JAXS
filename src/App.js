import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
} from 'react-router-dom';

import './App.css';

import Navbar from './Components/Navbar';
import People from './Components/People';
import About from './Components/About';
import Home from './Components/Home';
import Masthead from './Components/Masthead';
import SubmissionGuide from './Components/SubmissionGuide';

function PersonPage() {
  const { name } = useParams();
  return <h1>{name}</h1>
}

//function Home() {
//  const styles = {
//    'text-align': 'center',
//  }
//  return <h1 style={styles} >Journal of React</h1>
//}

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
