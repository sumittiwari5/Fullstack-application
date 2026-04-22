import React from 'react';
import {NavLink} from 'react-router-dom'; 

export default function Product(props) {
  const product = props.prod;

  const cardStyle = {
    background: '#fff',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(15,52,96,0.1)',
    border: '1px solid rgba(15,52,96,0.06)',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    width: '260px',
    flex: '0 0 auto',
    cursor: 'default',
  };

  const imgStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    display: 'block',
  };

  const badgeStyle = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #667eea22, #764ba222)',
    color: '#5a4fcf',
    border: '1px solid #c4b8ff',
    borderRadius: '20px',
    padding: '0.2rem 0.7rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const priceStyle = {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#0f3460',
    margin: '0.4rem 0 0.8rem',
  };

  const detailBtnStyle = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #f7971e, #ffd200)',
    color: '#1a1a2e',
    fontWeight: '700',
    fontSize: '0.88rem',
    padding: '0.55rem 1.2rem',
    borderRadius: '10px',
    textDecoration: 'none',
    transition: 'opacity 0.2s',
    letterSpacing: '0.3px',
  };

  return (
    <div style={cardStyle}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(15,52,96,0.18)'; }}
      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,52,96,0.1)'; }}>
      
      <div style={{ position: 'relative' }}>
        <img src={product.imageUrl} style={imgStyle} alt={product.name} />
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', borderRadius: '8px', padding: '0.2rem 0.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#0f3460' }}>
          🏷️ New
        </div>
      </div>

      <div style={{ padding: '1rem 1.2rem 1.2rem' }}>
        <div style={badgeStyle}>{product.category}</div>
        <h5 style={{ fontSize: '1rem', fontWeight: '700', color: '#1a1a2e', margin: '0 0 0.3rem', lineHeight: '1.3' }}>
          {product.name}
        </h5>
        <p style={{ color: '#888', fontSize: '0.82rem', margin: '0', lineHeight: '1.5' }}>
          {product.description.substring(0, 60)}...
        </p>
        <div style={priceStyle}>₹{product.price.toLocaleString()}</div>
        <NavLink to={`/details/${product.id}`} style={detailBtnStyle}
          onMouseOver={e => e.target.style.opacity = '0.85'}
          onMouseOut={e => e.target.style.opacity = '1'}>
          View Details →
        </NavLink>
      </div>
    </div>
  );
}
