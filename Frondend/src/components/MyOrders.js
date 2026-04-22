import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';

const pageStyle = {
  minHeight: '100vh',
  background: '#f0f4ff',
  padding: '2rem',
};

const tableContainerStyle = {
  background: '#fff',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 8px 40px rgba(15,52,96,0.1)',
  border: '1px solid rgba(15,52,96,0.06)',
  maxWidth: '800px',
  margin: '0 auto',
};

const tableHeaderStyle = {
  background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
  padding: '1.5rem 2rem',
  color: '#ffd200',
  fontWeight: '800',
  fontSize: '1.2rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const thStyle = {
  background: '#f7f9ff',
  color: '#667eea',
  fontWeight: '700',
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  padding: '1rem 1.5rem',
  border: 'none',
  borderBottom: '2px solid #e0e8ff',
};

const tdStyle = {
  padding: '1rem 1.5rem',
  color: '#444',
  fontSize: '0.92rem',
  borderBottom: '1px solid #f0f4ff',
  verticalAlign: 'middle',
};

const orderLinkStyle = {
  background: 'none',
  border: '2px solid #667eea',
  borderRadius: '8px',
  padding: '0.3rem 0.8rem',
  color: '#667eea',
  fontWeight: '700',
  fontSize: '0.85rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

export default function MyOrders() {
  const [myOrders, setMyOrders] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(()=>{
    fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/myorders`)
    .then(resp => resp.json())
    .then(data => {
      console.log(data);
      setMyOrders(data._embedded.orderses);
    })
  },[]);

  return (
    myOrders && 
    <div style={pageStyle}>
      <div style={tableContainerStyle}>
        <div style={tableHeaderStyle}>
          📦 My Orders
          <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: '400' }}>
            {myOrders.length} orders
          </span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Order ID</th>
              <th style={thStyle}>Order Date</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {myOrders.map((ord, idx) => (
              <tr key={ord.orderId}
                style={{ background: idx % 2 === 0 ? '#fff' : '#fafbff' }}
                onMouseOver={e => e.currentTarget.style.background = '#f0f4ff'}
                onMouseOut={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#fafbff'}>
                <td style={tdStyle}>
                  <span style={{ background: '#f0f4ff', color: '#0f3460', borderRadius: '8px', padding: '0.2rem 0.6rem', fontSize: '0.82rem', fontWeight: '600' }}>
                    #{ord.orderId}
                  </span>
                </td>
                <td style={tdStyle}>
                  🗓️ {new Date(ord.orderDate).toLocaleString()}
                </td>
                <td style={{ ...tdStyle, fontWeight: '700', color: '#0f3460', fontSize: '1rem' }}>
                  ₹{ord.totalBill.toLocaleString()}
                </td>
                <td style={tdStyle}>
                  <button style={orderLinkStyle}
                    onMouseOver={e => { e.target.style.background = '#667eea'; e.target.style.color = '#fff'; }}
                    onMouseOut={e => { e.target.style.background = 'none'; e.target.style.color = '#667eea'; }}
                    onClick={()=>navigate("/order-details", {state:ord.orderId})}>
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {myOrders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ color: '#555' }}>No orders yet</h3>
            <a href="/" style={{ color: '#667eea', fontWeight: '600' }}>Start Shopping →</a>
          </div>
        )}
      </div>
    </div>
  );
}
