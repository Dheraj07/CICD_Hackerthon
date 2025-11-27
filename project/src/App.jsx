import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import FeedbackForm from './pages/FeedbackForm.jsx';
import Analytics from './pages/Analytics.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { FeedbackProvider } from './contexts/FeedbackContext.jsx';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route 
          path="/dashboard" 
          element={
            user ? (
              user.role === 'admin' ? <AdminDashboard /> : <CustomerDashboard />
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/submit-feedback" 
          element={user ? <FeedbackForm /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/analytics" 
          element={
            user && user.role === 'admin' ? <Analytics /> : <Navigate to="/dashboard" />
          } 
        />
        <Route 
          path="/profile" 
          element={user ? <Profile /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/settings" 
          element={user ? <Settings /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <FeedbackProvider>
        <Router>
          <AppContent />
        </Router>
      </FeedbackProvider>
    </AuthProvider>
  );
}

export default App;
