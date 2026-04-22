import React, { useEffect, useState } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

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
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  padding: '1.5rem 2rem',
  color: '#fff',
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
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  border: 'none',
  borderRadius: '14px',
  padding: '0.9rem',
  color: '#fff',
  fontWeight: '800',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '0.5rem',
  letterSpacing: '0.3px',
  transition: 'opacity 0.2s',
};

export default function UpdateProduct() {
  const {register, handleSubmit, reset} = useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/products/${params.id}`)
      .then(resp => resp.json())
      .then(data => setProductDetails(data))
  }, []);

  useEffect(()=>{
    if(productDetails) reset(productDetails)
  },[productDetails, reset]);

  function updateProductInDb(formData){
    fetch(`${process.env.REACT_APP_API_URL}/api/products/${params.id}`,{
      headers: {
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
      },
      method:"PUT",
      body:JSON.stringify(formData)
    })
    .then(resp => {
      if(resp.ok){
        alert("Product updated !!");
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
    productDetails &&
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          ✏️ Update Product
        </div>
        <div style={{ padding: '2rem' }}>
          {/* Preview badge */}
          <div style={{ background: '#f7f9ff', borderRadius: '14px', padding: '0.8rem 1rem', marginBottom: '1.5rem', border: '1px solid #e0e8ff', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <img src={productDetails.imageUrl} alt=""
              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '10px' }} 
              onError={e => e.target.style.display = 'none'} />
            <div>
              <div style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '0.93rem' }}>{productDetails.name}</div>
              <div style={{ color: '#888', fontSize: '0.8rem' }}>Editing product #{params.id}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit(updateProductInDb)}>
            <Field label="Product Name">
              <input type="text" style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                {...register('name')} />
            </Field>
            <Field label="Category">
              <input type="text" style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                {...register('category')} />
            </Field>
            <Field label="Description">
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }}
                onFocus={focusIn} onBlur={focusOut}
                {...register('description')} />
            </Field>
            <Field label="Image URL">
              <input type="text" style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                {...register('imageUrl')} />
            </Field>
            <Field label="Price (₹)">
              <input type="text" style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                {...register('price')} />
            </Field>
            <button type="submit" style={submitBtnStyle}
              onMouseOver={e => e.target.style.opacity = '0.88'}
              onMouseOut={e => e.target.style.opacity = '1'}>
              ✅ Update Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
