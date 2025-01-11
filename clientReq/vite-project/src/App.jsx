import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import './App.css'
import LandingPage from './components/pages/LandingPage';
import Service from './components/pages/Service';
import DeploymentProgress from './components/pages/DeploymentProgress';
import DeployForm from './components/pages/DeployForm';
import LoginPage from './components/LoginPage';
import ProjectLister from './components/pages/ProjectLister';

function App() {


  return (
    <Router>
      <Routes>
        {/* Define Route for LandingPage */}
        <Route path="/" element={<LandingPage />} />

        {/* Define Route for Service */}
        <Route path="/new" element={<Service />} />

        {/* Define Route for progress page */}
        <Route path="/progress/:id" element={<DeploymentProgress />} />

        {/* Define Route for actual hosting form */}
        <Route path="/service/:id" element={<DeployForm />} />

        {/* Define Route for Login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Define Route for users pages */}
        <Route path="/projects" element={<ProjectLister />} />
      </Routes>
    </Router>
  )
}

export default App
