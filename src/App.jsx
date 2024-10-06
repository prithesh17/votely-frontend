import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminDashboard from './components/AdminDashboard';
import AnnounceResults from './components/AnnounceResults';
import CreateElection from './components/CreateElection';
import AddVoters from './components/AddVoters';
import { Box } from '@mui/material';

function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0', 
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/announceResults/:electionId" element={<AnnounceResults />} />
          <Route path="/addVoters/:electionId" element={<AddVoters />} />
          <Route path="/createElection" element={<CreateElection />} />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
