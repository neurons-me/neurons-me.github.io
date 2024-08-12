import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import GitProfile from './components/GitProfile';
import config from '../gitprofile.config.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/git" element={<GitProfile config={config} />} />
      </Routes>
    </Router>
  );
}

export default App;