import React, { useEffect, useMemo, useState } from 'react'
import {NavLink, useNavigate} from 'react-router-dom';

const pageStyle = {
  minHeight: '100vh',
  background: '#f0f4ff',
  padding: '2rem',
};

const cartCardStyle = {
  background: '#fff',
  borderRadius: '18px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(15,52,96,0.08)',
  border: '1px solid rgba(15,52,96,0.06)',
  marginBottom: '1.2rem',
  display: 'flex',
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

const payBtnStyle = {
  display: 'block',
  width: '100%',
  textAlign: 'center',
  background: 'linear-gradient(135deg, #4ade80, #22c55e)',
  color: '#fff',
  fontWeight: '800',
  fontSize: '1rem',
  padding: '0.9rem',
  borderRadius: '14px',
  border: 'none',
  cursor: 'pointer',
  marginTop: '1rem',
  letterSpacing: '0.3px',
  transition: 'opacity 0.2s',
};

const backBtnStyle = {
  display: 'block',
  width: '100%',
  textAlign: 'center',
  background: 'rgba(255,255,255,0.08)',
  color: 'rgba(255,255,255,0.7)',
  fontWeight: '600',
  fontSize: '0.9rem',
  padding: '0.7rem',
  borderRadius: '12px',
  textDecoration: 'none',
  marginTop: '0.7rem',
  transition: 'background 0.2s',
};

export default function Payment() {
  const [cartList, setCartList] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

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

  const startPayment = async () => {
    const token = localStorage.getItem("jwtToken");
    if(!token){ alert("Please login first."); return; }

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: total }),
    });

    const data = await res.json();
    if(!res.ok){ alert("Order creation failed: " + JSON.stringify(data)); return; }

    const options = {
      key: data.key,
      amount: data.amount,
      currency: "INR",
      name: "My App",
      description: "Payment Test",
      order_id: data.orderId,
      handler: async function (response) {
        fetch(`${process.env.REACT_APP_API_URL}/api/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(response),
        })
        .then((resp) => {
          if(resp.ok){ alert("Order Placed Successfully!"); navigate("/"); }
          else { alert("Payment Verification Failed!"); }
          return resp.json();
        })
        .then((data) => console.log(data));
      },
      prefill: { name: "Test User", email: "test@example.com", contact: "9769094244" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', borderRadius: '20px', padding: '1.5rem 2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2rem' }}>💳</div>
          <div>
            <h2 style={{ color: '#ffd200', fontWeight: '800', margin: 0 }}>Review & Pay</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.2rem 0 0', fontSize: '0.9rem' }}>Confirm your order before making payment</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Cart Items (read-only) */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '1rem' }}>
              🛍️ Order Items
            </div>
            {cartList && cartList.map(cart => (
              <div key={cart.id} style={cartCardStyle}>
                <img src={cart.product.imageUrl} alt={cart.product.name}
                  style={{ width: '130px', height: '130px', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ padding: '1rem 1.3rem', flex: 1 }}>
                  <div style={{ display: 'inline-block', background: '#f0f4ff', color: '#667eea', borderRadius: '20px', padding: '0.15rem 0.6rem', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                    {cart.product.category}
                  </div>
                  <h5 style={{ fontWeight: '700', color: '#1a1a2e', margin: '0 0 0.3rem', fontSize: '0.97rem' }}>
                    {cart.product.name}
                  </h5>
                  <p style={{ color: '#888', fontSize: '0.82rem', margin: '0 0 0.6rem', lineHeight: '1.4' }}>
                    {cart.product.description.substring(0, 70)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '800', color: '#0f3460', fontSize: '1.1rem' }}>
                      ₹{(cart.product.price * cart.quantity).toLocaleString()}
                    </span>
                    <span style={{ background: '#f0f4ff', color: '#667eea', borderRadius: '8px', padding: '0.2rem 0.7rem', fontSize: '0.82rem', fontWeight: '600' }}>
                      Qty: {cart.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Summary */}
          <div style={{ width: '300px', flexShrink: 0 }}>
            <div style={summaryBoxStyle}>
              <h3 style={{ color: '#ffd200', fontWeight: '800', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                💳 Payment Summary
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

              <button style={payBtnStyle} onClick={startPayment}
                onMouseOver={e => e.target.style.opacity = '0.88'}
                onMouseOut={e => e.target.style.opacity = '1'}>
                🔐 Pay ₹{total.toLocaleString()}
              </button>
              <NavLink to={"/mycart"} style={backBtnStyle}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                ← Back to Cart
              </NavLink>

              <div style={{ textAlign: 'center', marginTop: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                🔒 Powered by Razorpay · SSL Secured
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
