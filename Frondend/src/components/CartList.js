import React, { useEffect, useMemo, useState } from 'react'
import {NavLink} from 'react-router-dom';

const pageStyle = {
  minHeight: '100vh',
  background: '#f0f4ff',
  padding: '2rem',
};

const sectionTitleStyle = {
  fontSize: '1.4rem',
  fontWeight: '800',
  color: '#1a1a2e',
  marginBottom: '1.2rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const cartCardStyle = {
  background: '#fff',
  borderRadius: '18px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(15,52,96,0.08)',
  border: '1px solid rgba(15,52,96,0.06)',
  marginBottom: '1.2rem',
  display: 'flex',
  transition: 'box-shadow 0.2s',
};

const summaryBoxStyle = {
  background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
  borderRadius: '20px',
  padding: '1.8rem',
  color: '#fff',
  position: 'sticky',
  top: '80px',
  boxShadow: '0 8px 32px rgba(15,52,96,0.25)',
};

const deleteBtnStyle = {
  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
  border: 'none',
  borderRadius: '10px',
  padding: '0.5rem 1rem',
  color: '#fff',
  fontWeight: '600',
  fontSize: '0.85rem',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
};

const confirmBtnStyle = {
  display: 'block',
  width: '100%',
  textAlign: 'center',
  background: 'linear-gradient(135deg, #f7971e, #ffd200)',
  color: '#1a1a2e',
  fontWeight: '800',
  fontSize: '1rem',
  padding: '0.9rem',
  borderRadius: '14px',
  textDecoration: 'none',
  marginTop: '1.5rem',
  letterSpacing: '0.3px',
  transition: 'opacity 0.2s',
};

const qtyInputStyle = {
  width: '60px',
  background: '#f7f9ff',
  border: '2px solid #e0e8ff',
  borderRadius: '8px',
  padding: '0.3rem 0.5rem',
  color: '#1a1a2e',
  fontSize: '0.9rem',
  fontWeight: '600',
  textAlign: 'center',
  outline: 'none',
};

export default function CartList() {
  const [cartList, setCartList] = useState(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/cartList`)
      .then(resp => resp.json())
      .then(data => setCartList(data._embedded.carts))
  }, []);

  const {count, total} = useMemo(()=>{
    let count=0, total=0;
    if(cartList){
      count = cartList.length;
      for(let cart of cartList) total += cart.quantity * cart.product.price;
    }
    return {count, total};
  },[cartList])

  function deleteCart(id){
    fetch(`${process.env.REACT_APP_API_URL}/api/carts/${id}`,{
      headers:{"Authorization":`Bearer ${token}`},
      method:"DELETE"
    })
    .then(resp=>{
      if(resp.ok){
        alert("Product deleted from Cart !!")
        const updatedCartList = cartList.filter(cart => cart.id !== id)
        setCartList(updatedCartList)
      }
    })
  }

  function updateQuantity(event, cart){
    const q = parseInt(event.target.value);
    const updatedCart = {
      "user":`${process.env.REACT_APP_API_URL}/api/users/${userId}`,
      "product":`${process.env.REACT_APP_API_URL}/api/products/${cart.product.id}`,
      "quantity":q
    }
    fetch(`${process.env.REACT_APP_API_URL}/api/carts/${cart.id}`,{
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
      },
      method:"PUT",
      body:JSON.stringify(updatedCart)
    })
    .then(resp => {
      if(resp.ok){
        const updatedCartList = cartList.map(cartObj => {
          if(cartObj.id === cart.id) cartObj.quantity = q;
          return cartObj;
        })
        setCartList(updatedCartList);
      }           
    })
  }

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Cart Items */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={sectionTitleStyle}>🛍️ My Cart {cartList && <span style={{ color: '#667eea', fontSize: '1rem' }}>({cartList.length} items)</span>}</div>
          {cartList && cartList.map(cart => (
            <div key={cart.id} style={cartCardStyle}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 30px rgba(15,52,96,0.14)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,52,96,0.08)'}>
              <img src={cart.product.imageUrl} alt={cart.product.name}
                style={{ width: '150px', height: '150px', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ padding: '1.2rem 1.5rem', flex: 1 }}>
                <div style={{ display: 'inline-block', background: '#f0f4ff', color: '#667eea', borderRadius: '20px', padding: '0.15rem 0.7rem', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                  {cart.product.category}
                </div>
                <h5 style={{ fontWeight: '700', color: '#1a1a2e', margin: '0 0 0.3rem', fontSize: '1rem' }}>
                  {cart.product.name}
                </h5>
                <p style={{ color: '#888', fontSize: '0.83rem', margin: '0 0 0.8rem', lineHeight: '1.5' }}>
                  {cart.product.description.substring(0, 80)}...
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f3460' }}>
                    ₹{(cart.product.price * cart.quantity).toLocaleString()}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#888', fontSize: '0.85rem' }}>Qty:</span>
                      <input type="number" style={qtyInputStyle} min="1"
                        value={cart.quantity}
                        onChange={(e)=>updateQuantity(e, cart)} />
                    </div>
                    <button style={deleteBtnStyle} onClick={()=>deleteCart(cart.id)}
                      onMouseOver={e => e.target.style.opacity = '0.8'}
                      onMouseOut={e => e.target.style.opacity = '1'}>
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {cartList && cartList.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#888', background: '#fff', borderRadius: '20px' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
              <h3 style={{ color: '#555' }}>Your cart is empty</h3>
              <a href="/" style={{ color: '#667eea', fontWeight: '600' }}>Continue Shopping →</a>
            </div>
          )}
        </div>

        {/* Summary */}
        {cartList && cartList.length > 0 && (
          <div style={{ width: '300px', flexShrink: 0 }}>
            <div style={summaryBoxStyle}>
              <h3 style={{ color: '#ffd200', fontWeight: '800', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                🧾 Order Summary
              </h3>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.7rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  <span>Items ({count})</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.7rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  <span>Delivery</span>
                  <span style={{ color: '#4ade80' }}>FREE</span>
                </div>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.15)', margin: '1rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: '800', fontSize: '1.1rem' }}>
                  <span>Total</span>
                  <span style={{ color: '#ffd200' }}>₹{total.toLocaleString()}</span>
                </div>
              </div>
              <NavLink style={confirmBtnStyle} to={"/payment"}
                onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                Confirm Order →
              </NavLink>
              <div style={{ textAlign: 'center', marginTop: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                🔒 Secure & encrypted checkout
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
