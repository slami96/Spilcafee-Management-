import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext'; // Update path if needed

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!currentUser) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default PrivateRoute;
