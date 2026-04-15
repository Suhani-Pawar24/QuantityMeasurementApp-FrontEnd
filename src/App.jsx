import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MeasurementProvider } from './context/MeasurementContext';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import { MeasurementApp } from './pages/MeasurementApp';
import { authAPI } from './services/api';

function ProtectedRoute({ children }) {
  const user = authAPI.getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  useEffect(() => {
    // Check if user is already logged in on app load
    const user = authAPI.getCurrentUser();
    // You can add analytics or other initialization here
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MeasurementProvider>
                <MeasurementApp />
              </MeasurementProvider>
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/app" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
