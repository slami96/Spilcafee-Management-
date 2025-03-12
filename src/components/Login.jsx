import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css'; // Make sure to create this file

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Get auth context
  const auth = useAuth();
  
  // Enhanced debugging
  useEffect(() => {
    console.log("Auth context full object:", auth);
    console.log("Login function exists:", !!auth?.login);
    console.log("Current user:", auth?.currentUser);
  }, [auth]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      if (!auth) {
        console.error("Auth context is undefined");
        setError('Authentication service is not available. Please try again later.');
        return;
      }
      
      if (!auth.login) {
        console.error("Auth login function is undefined");
        setError('Authentication service is not available. Please try again later.');
        return;
      }
      
      console.log("Attempting login with:", email);
      await auth.login(email, password);
      console.log("Login successful");
      navigate('/');
    } catch (err) {
      console.error('Login error details:', err);
      setError('Failed to log in: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        {error && <div className="alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button disabled={loading} type="submit" className="login-button">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div className="signup-link">
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
