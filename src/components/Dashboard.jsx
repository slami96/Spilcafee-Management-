import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  return (
    <div className="dashboard">
      <h2>Game Management System</h2>
      <div className="user-info">
        <p>Email: {currentUser.email}</p>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      <div className="game-management">
        <p>Game management features will be implemented here.</p>
      </div>
    </div>
  );
}
