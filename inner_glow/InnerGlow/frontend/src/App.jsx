import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../Layout.jsx';
import Dashboard from '../Pages/Dashboard.jsx';
import AIChat from '../Pages/AIChat.jsx';
import Meditations from '../Pages/Meditations.jsx';
import Community from '../Pages/Community.jsx';
import Login from '../Pages/Login.jsx';
import SignUp from '../Pages/SignUp.jsx';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-chat" element={<AIChat />} />
        <Route path="/meditations" element={<Meditations />} />
        <Route path="/community" element={<Community />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Layout>
  );
}

export default App; 