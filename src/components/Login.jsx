import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Get auth context with a safeguard
  const auth = useAuth();
  
  // Check if auth context is properly loaded
  useEffect(() => {
    console.log("Auth context status:", auth ? "Loaded" : "Not loaded");
  }, [auth]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Check if login function exists before trying to use it
    if (!auth || !auth.login) {
      setError('Authentication service is not available. Please try again later.');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await auth.login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in: ' + (err.message || 'Unknown error'));
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
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
        <button disabled={loading} type="submit">
          Log In
        </button>
      </form>
      <div className="signup-link">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}
