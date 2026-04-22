import React from 'react'
import { NavLink } from 'react-router-dom';

const navStyle = {
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  padding: '0 1.5rem',
  minHeight: '65px',
  display: 'flex',
  alignItems: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
};

const brandStyle = {
  fontSize: '1.7rem',
  fontWeight: '800',
  background: 'linear-gradient(90deg, #f7971e, #ffd200)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '1px',
  textDecoration: 'none',
};

const linkStyle = {
  color: 'rgba(255,255,255,0.85)',
  fontWeight: '500',
  fontSize: '0.95rem',
  padding: '0.4rem 0.9rem',
  borderRadius: '8px',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  letterSpacing: '0.3px',
};

const activeLinkStyle = {
  ...linkStyle,
  color: '#ffd200',
  background: 'rgba(255,210,0,0.12)',
};

const logoutBtnStyle = {
  background: 'linear-gradient(135deg, #f7971e, #ffd200)',
  border: 'none',
  color: '#1a1a2e',
  fontWeight: '700',
  fontSize: '0.88rem',
  padding: '0.4rem 1.1rem',
  borderRadius: '20px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  letterSpacing: '0.3px',
};

export default function Navbar() {
  const token = localStorage.getItem("jwtToken");
  const roles = localStorage.getItem("roles");

  function doLogout() {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <div style={navStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.5rem' }}>
        {/* Brand */}
        <a href="/" style={brandStyle}>🛒 ClickNCart</a>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
          <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>Home</NavLink>

          {!token && (
            <>
              <NavLink to="/login" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>Login</NavLink>
              <NavLink to="/register" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>Register</NavLink>
            </>
          )}

          {roles && roles.includes("USER") && (
            <>
              <NavLink to="/mycart" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>🛍️ My Cart</NavLink>
              <NavLink to="/myorders" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>📦 My Orders</NavLink>
            </>
          )}

          {roles && roles.includes("ADMIN") && (
            <NavLink to="/add-product" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>➕ Add Product</NavLink>
          )}

          {token && (
            <button style={logoutBtnStyle} onClick={doLogout}
              onMouseOver={e => e.target.style.opacity = '0.85'}
              onMouseOut={e => e.target.style.opacity = '1'}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
