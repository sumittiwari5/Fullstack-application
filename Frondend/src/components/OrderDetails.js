import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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
  maxWidth: '720px',
  margin: '0 auto',
  border: '1px solid rgba(15,52,96,0.06)',
};

const cardHeaderStyle = {
  background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
  padding: '1.5rem 2rem',
  color: '#ffd200',
  fontWeight: '800',
  fontSize: '1.2rem',
};

const metaRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.9rem 0',
  borderBottom: '1px solid #f0f4ff',
};

const metaLabelStyle = {
  color: '#888',
  fontSize: '0.85rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const metaValueStyle = {
  color: '#1a1a2e',
  fontSize: '0.95rem',
  fontWeight: '600',
};

const thStyle = {
  background: '#f7f9ff',
  color: '#667eea',
  fontWeight: '700',
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  padding: '0.9rem 1.2rem',
  border: 'none',
  borderBottom: '2px solid #e0e8ff',
  textAlign: 'left',
};

const tdStyle = {
  padding: '0.9rem 1.2rem',
  color: '#444',
  fontSize: '0.92rem',
  borderBottom: '1px solid #f0f4ff',
};

const backBtnStyle = {
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  border: 'none',
  borderRadius: '12px',
  padding: '0.7rem 1.5rem',
  color: '#fff',
  fontWeight: '700',
  fontSize: '0.92rem',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
};

export default function OrderDetails() {
  const location = useLocation();
  const ordId = location.state;
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    fetch(`${process.env.REACT_APP_API_URL}/api/orderDetails/${ordId}`)
    .then(resp => resp.json())
    .then(data => setDetails(data));
  },[])

  return (details &&
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          📋 Order Details
        </div>
        <div style={{ padding: '1.5rem 2rem' }}>
          {/* Order Meta */}
          <div style={{ background: '#f7f9ff', borderRadius: '14px', padding: '1rem 1.5rem', marginBottom: '1.5rem', border: '1px solid #e0e8ff' }}>
            <div style={metaRowStyle}>
              <span style={metaLabelStyle}>📅 Order Date</span>
              <span style={metaValueStyle}>{new Date(details[0].orders.orderDate).toLocaleString()}</span>
            </div>
            <div style={metaRowStyle}>
              <span style={metaLabelStyle}>🔖 Order ID</span>
              <span style={{ ...metaValueStyle, background: '#f0f4ff', color: '#667eea', borderRadius: '8px', padding: '0.2rem 0.6rem', fontSize: '0.85rem' }}>
                #{details[0].orders.orderId}
              </span>
            </div>
            <div style={metaRowStyle}>
              <span style={metaLabelStyle}>💳 Payment ID</span>
              <span style={{ ...metaValueStyle, fontFamily: 'monospace', fontSize: '0.85rem', color: '#555' }}>
                {details[0].orders.paymentId}
              </span>
            </div>
            <div style={{ ...metaRowStyle, borderBottom: 'none' }}>
              <span style={metaLabelStyle}>💰 Total Bill</span>
              <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f3460' }}>
                ₹{details[0].orders.totalBill.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Products Table */}
          <h4 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '0.8rem', fontSize: '1rem' }}>
            🛍️ Product Details
          </h4>
          <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #e0e8ff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Product Name</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>Quantity</th>
                  <th style={thStyle}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {details && details.map((ordrdetail, idx) => (
                  <tr key={ordrdetail.id}
                    style={{ background: idx % 2 === 0 ? '#fff' : '#fafbff' }}>
                    <td style={{ ...tdStyle, fontWeight: '600', color: '#1a1a2e' }}>
                      {ordrdetail.product.name}
                    </td>
                    <td style={tdStyle}>₹{ordrdetail.product.price.toLocaleString()}</td>
                    <td style={tdStyle}>
                      <span style={{ background: '#f0f4ff', color: '#667eea', borderRadius: '8px', padding: '0.15rem 0.6rem', fontWeight: '600', fontSize: '0.85rem' }}>
                        ×{ordrdetail.quantity}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: '700', color: '#0f3460' }}>
                      ₹{(ordrdetail.product.price * ordrdetail.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button style={backBtnStyle} onClick={() => navigate("/myorders")}
              onMouseOver={e => e.target.style.opacity = '0.85'}
              onMouseOut={e => e.target.style.opacity = '1'}>
              ← Back to Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
