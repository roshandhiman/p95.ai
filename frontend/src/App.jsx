import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ScoringEngine from './pages/ScoringEngine';
import Outreach from './pages/Outreach';
import ABTesting from './pages/ABTesting';
import ICPFramework from './pages/ICPFramework';
import Sender from './pages/Sender';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import { useState, useEffect } from 'react';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setSession(token);
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!session && !localStorage.getItem('token')) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setSession={setSession} />} />
        <Route path="/app" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/scoring" element={<ProtectedRoute><Layout><ScoringEngine /></Layout></ProtectedRoute>} />
        <Route path="/outreach" element={<ProtectedRoute><Layout><Outreach /></Layout></ProtectedRoute>} />
        <Route path="/ab-testing" element={<ProtectedRoute><Layout><ABTesting /></Layout></ProtectedRoute>} />
        <Route path="/icp" element={<ProtectedRoute><Layout><ICPFramework /></Layout></ProtectedRoute>} />
        <Route path="/sender" element={<ProtectedRoute><Layout><Sender /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
