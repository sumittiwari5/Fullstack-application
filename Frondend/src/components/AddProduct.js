import React from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';

const pageStyle = {
  minHeight: '100vh',
  background: '#f0f4ff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
};

const cardStyle = {
  background: '#fff',
  borderRadius: '24px',
  overflow: 'hidden',
  boxShadow: '0 8px 40px rgba(15,52,96,0.12)',
  width: '100%',
  maxWidth: '500px',
  border: '1px solid rgba(15,52,96,0.06)',
};

const cardHeaderStyle = {
  background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
  padding: '1.5rem 2rem',
  color: '#ffd200',
  fontWeight: '800',
  fontSize: '1.3rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const labelStyle = {
  color: '#667eea',
  fontSize: '0.8rem',
  fontWeight: '700',
  marginBottom: '0.4rem',
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const inputStyle = {
  width: '100%',
  background: '#f7f9ff',
  border: '2px solid #e0e8ff',
  borderRadius: '12px',
  padding: '0.7rem 1rem',
  color: '#1a1a2e',
  fontSize: '0.93rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const submitBtnStyle = {
  width: '100%',
  background: 'linear-gradient(135deg, #f7971e, #ffd200)',
  border: 'none',
  borderRadius: '14px',
  padding: '0.9rem',
  color: '#1a1a2e',
  fontWeight: '800',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '0.5rem',
  letterSpacing: '0.3px',
  transition: 'opacity 0.2s',
};

export default function AddProduct() {
  const {register, handleSubmit} = useForm();
  const navigate = useNavigate();

  function addNewProduct(formData){
    console.log(formData);
    const token = localStorage.getItem("jwtToken");

    fetch(`${process.env.REACT_APP_API_URL}/api/products`,{
      headers: {
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
      },
      method:"POST",
      body:JSON.stringify(formData)
    })
    .then(resp => {
      if(resp.status==201){
        alert("product added successfully !!");
        navigate("/");
      }
    })
  }

  const focusIn = e => e.target.style.borderColor = '#667eea';
  const focusOut = e => e.target.style.borderColor = '#e0e8ff';

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: '1.1rem' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          ➕ Add New Product
        </div>
        <div style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit(addNewProduct)}>
            <Field label="Product Name">
              <input type="text" style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                placeholder="e.g. Nike Air Max 90"
                {...register('name')} />
            </Field>
            <Field label="Category">
              <input type="text" style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                placeholder="e.g. Footwear"
                {...register('category')} />
            </Field>
            <Field label="Description">
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }}
                onFocus={focusIn} onBlur={focusOut}
                placeholder="Describe the product..."
                {...register('description')} />
            </Field>
            <Field label="Image URL">
              <input type="text" style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                placeholder="https://..."
                {...register('imageUrl')} />
            </Field>
            <Field label="Price (₹)">
              <input type="text" style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                placeholder="e.g. 1299"
                {...register('price')} />
            </Field>
            <button type="submit" style={submitBtnStyle}
              onMouseOver={e => e.target.style.opacity = '0.88'}
              onMouseOut={e => e.target.style.opacity = '1'}>
              🚀 Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
