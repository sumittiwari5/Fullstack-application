import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

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
  maxWidth: '460px',
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

const labelStyle = {
  color: 'rgba(255,255,255,0.75)',
  fontSize: '0.82rem',
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
  padding: '0.7rem 1rem',
  color: '#fff',
  fontSize: '0.93rem',
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

const checkboxRowStyle = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '1.2rem',
};

const checkLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: 'rgba(255,255,255,0.75)',
  fontSize: '0.9rem',
  cursor: 'pointer',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px',
  padding: '0.5rem 1rem',
};

export default function Register() {
  const {register, handleSubmit, formState:{errors}} = useForm({
    defaultValues: {
      username:'', email:'', password:'', confirmPassword:'', mobile:'', roles:[]
    }
  });
  const [ formError, setFormError] = useState(null);
  const navigate = useNavigate();

  function registeruser(formData){
    console.log(formData); 
    if(formData.password !== formData.confirmPassword){
      setFormError("Password and Confirm Password must be same!!");
    }   
    else {
      setFormError(null);
      fetch(`${process.env.REACT_APP_API_URL}/api/register`,{
        headers:{"Content-Type":"application/json"},
        method:"POST",
        body: JSON.stringify(formData)
      })
      .then(resp => resp.json())
      .then(data=>{
        if(data.status==400) {
          setFormError(data.message);
        }  
        else{
          alert("Registered successfully!! Plz login");
          navigate("/login");
        }   
      })
    }  
  }

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );

  const focusIn = e => e.target.style.borderColor = '#ffd200';
  const focusOut = e => e.target.style.borderColor = 'rgba(255,255,255,0.15)';

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Create Account</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Join ClickNCart and start shopping
        </p>

        {formError && <div style={errorStyle}>⚠️ {formError}</div>}

        <form onSubmit={handleSubmit(registeruser)}>
          <Field label="Username">
            <input type="text" style={inputStyle} onFocus={focusIn} onBlur={focusOut}
              {...register('username', {required:{message:"Username is compulsory"}})} />
          </Field>
          <Field label="Email Address">
            <input type="email" style={inputStyle} onFocus={focusIn} onBlur={focusOut}
              {...register('email', {required:{message:"Email is compulsory"}})} />
          </Field>
          <Field label="Password">
            <input type="password" style={inputStyle} onFocus={focusIn} onBlur={focusOut}
              {...register('password', {required:{message:"Password is compulsory"}})} />
          </Field>
          <Field label="Confirm Password">
            <input type="password" style={inputStyle} onFocus={focusIn} onBlur={focusOut}
              {...register('confirmPassword', {required:{message:"Confirm Password is compulsory"}})} />
          </Field>
          <Field label="Mobile">
            <input type="text" style={inputStyle} onFocus={focusIn} onBlur={focusOut}
              {...register('mobile', {required:{message:"Mobile is compulsory"}})} />
          </Field>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={labelStyle}>Account Type</label>
            <div style={checkboxRowStyle}>
              <label style={checkLabelStyle}>
                <input type="checkbox" value="ROLE_ADMIN" {...register('roles')}
                  style={{ accentColor: '#ffd200' }} />
                👑 Admin
              </label>
              <label style={checkLabelStyle}>
                <input type="checkbox" value="ROLE_USER" {...register('roles')}
                  style={{ accentColor: '#ffd200' }} />
                🛍️ User
              </label>
            </div>
          </div>

          <button type="submit" style={btnStyle}
            onMouseOver={e => e.target.style.opacity = '0.88'}
            onMouseOut={e => e.target.style.opacity = '1'}>
            Create Account →
          </button>
        </form>

        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', textAlign: 'center', marginTop: '1.5rem' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#ffd200', textDecoration: 'none', fontWeight: '600' }}>Sign In</a>
        </p>
      </div>
    </div>
  )
}
