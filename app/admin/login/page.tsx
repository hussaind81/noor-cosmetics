'use client';
import { useState } from 'react';

// ⚠️ CHANGE THIS PASSWORD before deploying!
const ADMIN_PASSWORD = 'noor2025admin';

export default function AdminLogin() {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      // Store session in localStorage
      localStorage.setItem('noor_admin', btoa(pw + Date.now()));
      window.location.href = '/admin';
    } else {
      setError('Incorrect password. Please try again.');
      setPw('');
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">NOOR</div>
        <div className="login-sub">Admin Panel — Staff Only</div>

        {error && <div className="login-error">🔒 {error}</div>}

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter admin password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            autoFocus
          />
        </div>

        <button className="btn btn-primary" style={{width:'100%', marginTop:'0.5rem'}} onClick={handleLogin}>
          Enter Admin Panel
        </button>

        <p style={{marginTop:'1.5rem', fontSize:'0.8rem', color:'#9ca3af'}}>
          This page is for authorized staff only.<br />
          <a href="/" style={{color:'#e11d48'}}>← Back to store</a>
        </p>
      </div>
    </div>
  );
}
