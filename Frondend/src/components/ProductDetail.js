import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const pageStyle = {
  minHeight: '100vh',
  background: '#f0f4ff',
  padding: '2rem',
};

const cardStyle = {
  background: '#fff',
  borderRadius: '24px',
  overflow: 'hidden',
  boxShadow: '0 8px 40px rgba(15,52,96,0.12)',
  maxWidth: '900px',
  margin: '0 auto',
  border: '1px solid rgba(15,52,96,0.06)',
};

const headerStyle = {
  background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
  padding: '1.2rem 2rem',
  color: '#fff',
  fontSize: '0.9rem',
};

const imgStyle = {
  width: '100%',
  height: '340px',
  objectFit: 'cover',
  display: 'block',
};

const badgeStyle = {
  display: 'inline-block',
  background: 'linear-gradient(135deg, #667eea22, #764ba222)',
  color: '#5a4fcf',
  border: '1px solid #c4b8ff',
  borderRadius: '20px',
  padding: '0.3rem 0.9rem',
  fontSize: '0.8rem',
  fontWeight: '600',
  marginBottom: '1rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const priceStyle = {
  fontSize: '2.2rem',
  fontWeight: '900',
  color: '#0f3460',
  margin: '0.5rem 0 1.5rem',
};

const actionBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  background: 'linear-gradient(135deg, #f7971e, #ffd200)',
  border: 'none',
  borderRadius: '12px',
  padding: '0.75rem 1.5rem',
  color: '#1a1a2e',
  fontWeight: '700',
  fontSize: '0.95rem',
  cursor: 'pointer',
  textDecoration: 'none',
  margin: '0.3rem',
  transition: 'opacity 0.2s',
};

const editBtnStyle = {
  ...actionBtnStyle,
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  color: '#fff',
};

const deleteBtnStyle = {
  ...actionBtnStyle,
  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
  color: '#fff',
};

export default function ProductDetail() {
  const params = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const roles  = localStorage.getItem("roles");
  const token = localStorage.getItem("jwtToken");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/products/${params.id}`)
      .then(resp => resp.json())
      .then(data => setProductDetails(data))
  }, []);

  function deleteProduct(){
    const c = window.confirm("Do you really want to delete product '"+productDetails.name+"' ?");
    if(c){
      fetch(`${process.env.REACT_APP_API_URL}/api/products/${params.id}`,
        {
          headers: {"Authorization":`Bearer ${token}`},
          method:"DELETE"
        }
      )
      .then(resp => {
        alert("product deleted successfully !!");
        navigate("/");
      })
    }
  }

  function addToCart(){
    if(roles && roles.includes("USER")){
      const requestBody = {
        "user":  `${process.env.REACT_APP_API_URL}/api/users/${userId}`,
        "product": `${process.env.REACT_APP_API_URL}/api/products/${params.id}`
      }
     fetch(`${process.env.REACT_APP_API_URL}/api/carts`,{
        headers:{
              "Content-Type":"application/json",
              "Authorization":`Bearer ${token}`
            },
        method:"POST",
        body: JSON.stringify(requestBody)
      })
      .then(resp => {
        console.log(resp);        
        alert("Product added to Cart");
        navigate("/");
      })
    }
    else {
      alert("Please login first for shopping");
      navigate("/login")
    }
  }

  return (
    productDetails && 
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          🏠 Home / Products / <strong>{productDetails.name}</strong>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* Image */}
          <div style={{ flex: '0 0 380px', maxWidth: '380px' }}>
            <img src={productDetails.imageUrl} style={imgStyle} alt={productDetails.name} />
          </div>
          {/* Details */}
          <div style={{ flex: 1, padding: '2rem 2.5rem', minWidth: '280px' }}>
            <div style={badgeStyle}>{productDetails.category}</div>
            <h2 style={{ fontSize: '1.7rem', fontWeight: '800', color: '#1a1a2e', margin: '0 0 0.5rem', lineHeight: '1.3' }}>
              {productDetails.name}
            </h2>
            <p style={{ color: '#666', lineHeight: '1.7', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              {productDetails.description}
            </p>
            <div style={priceStyle}>₹{productDetails.price.toLocaleString()}</div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#f0f4ff', margin: '0 0 1.5rem' }} />

            {/* Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              <button style={actionBtnStyle} onClick={addToCart}
                onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                🛒 Add to Cart
              </button>
              { roles && roles.includes("ADMIN") && (
                <>
                  <NavLink style={editBtnStyle} to={`/update/${params.id}`}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                    ✏️ Edit
                  </NavLink>
                  <button style={deleteBtnStyle} onClick={deleteProduct}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                    🗑️ Delete
                  </button>
                </>
              )}
            </div>

            <div style={{ marginTop: '1.5rem', background: '#f7f9ff', borderRadius: '12px', padding: '1rem', border: '1px solid #e0e8ff' }}>
              <p style={{ margin: 0, color: '#667eea', fontSize: '0.85rem', fontWeight: '600' }}>
                ✅ Free delivery on orders above ₹499 &nbsp;|&nbsp; 🔄 Easy returns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
