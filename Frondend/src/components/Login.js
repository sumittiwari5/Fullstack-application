import React, { useState } from 'react'
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const pageStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
};

const cardStyle = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '24px',
  padding: '2.5rem',
  width: '100%',
  maxWidth: '420px',
  boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
};

const titleStyle = {
  fontSize: '2rem',
  fontWeight: '800',
  background: 'linear-gradient(90deg, #f7971e, #ffd200)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '0.3rem',
};

const subtitleStyle = {
  color: 'rgba(255,255,255,0.5)',
  fontSize: '0.9rem',
  marginBottom: '2rem',
};

const labelStyle = {
  color: 'rgba(255,255,255,0.75)',
  fontSize: '0.85rem',
  fontWeight: '600',
  marginBottom: '0.4rem',
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '12px',
  padding: '0.75rem 1rem',
  color: '#fff',
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const btnStyle = {
  width: '100%',
  background: 'linear-gradient(135deg, #f7971e, #ffd200)',
  border: 'none',
  borderRadius: '12px',
  padding: '0.85rem',
  color: '#1a1a2e',
  fontWeight: '800',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '0.5rem',
  letterSpacing: '0.5px',
  transition: 'opacity 0.2s',
};

const errorStyle = {
  background: 'rgba(239,68,68,0.15)',
  border: '1px solid rgba(239,68,68,0.4)',
  borderRadius: '10px',
  padding: '0.75rem 1rem',
  color: '#fca5a5',
  fontSize: '0.88rem',
  marginBottom: '1.2rem',
};

export default function Login() {
  const {register, handleSubmit} = useForm();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);

  function doLogin(formData){
    console.log(formData);
    fetch(`${process.env.REACT_APP_API_URL}/api/login`,{
      headers:{"Content-Type":"application/json"},
      method:"POST",
      body:JSON.stringify(formData)
    })
    .then(resp => {
      console.log("SERVER RESPONSE:",resp);
      if(resp.status==401){
        setLoginError("please provide correct details to login");        
      }
      return resp.json();      
    })
    .then(data => {
      console.log("server data:",data); 
      if(data.jwtToken){
        const token = data.jwtToken;
        localStorage.setItem("jwtToken",token);
        const decodedToken = jwtDecode(token);
        const tokenSubject  = decodedToken.sub;
        const userId = tokenSubject.split(",")[0];
        const username = tokenSubject.split(",")[2];
        const roles = tokenSubject.split("[")[1];
        localStorage.setItem("userId",userId);
        localStorage.setItem("username",username);
        localStorage.setItem("roles",roles);
        window.location.href="/";
      }     
    })
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Welcome back</h2>
        <p style={subtitleStyle}>Sign in to your ClickNCart account</p>

        {loginError && <div style={errorStyle}>⚠️ {loginError}</div>}

        <form onSubmit={handleSubmit(doLogin)}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={labelStyle}>Email Address</label>
            <input type="email" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#ffd200'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              {...register('email')} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Password</label>
            <input type="password" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#ffd200'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              {...register('password')} />
          </div>
          <button type="submit" style={btnStyle}
            onMouseOver={e => e.target.style.opacity = '0.88'}
            onMouseOut={e => e.target.style.opacity = '1'}>
            Sign In →
          </button>
        </form>

        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', textAlign: 'center', marginTop: '1.5rem' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: '#ffd200', textDecoration: 'none', fontWeight: '600' }}>Register</a>
        </p>
      </div>
    </div>
  )
}
