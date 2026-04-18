import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Outreach from './pages/Outreach';
import Sender from './pages/Sender';
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
        <Route path="/outreach" element={<ProtectedRoute><Layout><Outreach /></Layout></ProtectedRoute>} />
        <Route path="/sender" element={<ProtectedRoute><Layout><Sender /></Layout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
