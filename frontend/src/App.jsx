import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import SpaceBackground from './components/SpaceBackground';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RiskAnalysis from './pages/RiskAnalysis';
import Chat from './pages/Chat'; // Ensure filename matches (Chat.jsx)

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* 1. SpaceBackground sits here. It is 'fixed' position, 
             so it stays in place while you scroll.
        */}
        <SpaceBackground />
        
        {/* 2. Main Content Wrapper
             - Removed 'bg-space-900' so it is transparent.
             - Added 'relative z-10' to ensure clicks hit buttons, not stars.
        */}
        <div className="min-h-screen text-white selection:bg-blue-500 selection:text-white relative z-10">
          <Navbar />
          <hr />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Make sure RiskAnalysis.jsx exists in pages folder */}
            <Route path="/risk-analysis" element={<RiskAnalysis />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;