import React, { useEffect, useState } from 'react'
import Product from './Product';

const pageStyle = {
  minHeight: '100vh',
  background: '#f0f4ff',
  padding: '1.5rem',
};

const searchBarStyle = {
  background: '#fff',
  borderRadius: '20px',
  padding: '1.2rem 1.5rem',
  boxShadow: '0 4px 24px rgba(15,52,96,0.1)',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.8rem',
  alignItems: 'center',
  marginBottom: '2rem',
  border: '1px solid rgba(15,52,96,0.08)',
};

const selectStyle = {
  background: '#f7f9ff',
  border: '2px solid #e0e8ff',
  borderRadius: '12px',
  padding: '0.6rem 1rem',
  color: '#1a1a2e',
  fontSize: '0.92rem',
  outline: 'none',
  cursor: 'pointer',
  fontWeight: '500',
  minWidth: '130px',
  transition: 'border-color 0.2s',
};

const inputStyle = {
  background: '#f7f9ff',
  border: '2px solid #e0e8ff',
  borderRadius: '12px',
  padding: '0.6rem 1rem',
  color: '#1a1a2e',
  fontSize: '0.92rem',
  outline: 'none',
  minWidth: '180px',
  transition: 'border-color 0.2s',
};

const sortBtnStyle = {
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  border: 'none',
  borderRadius: '12px',
  padding: '0.6rem 1.2rem',
  color: '#fff',
  fontWeight: '600',
  fontSize: '0.88rem',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
};

const searchBtnStyle = {
  background: 'linear-gradient(135deg, #f7971e, #ffd200)',
  border: 'none',
  borderRadius: '12px',
  padding: '0.6rem 1.4rem',
  color: '#1a1a2e',
  fontWeight: '700',
  fontSize: '0.92rem',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
};

const heroStyle = {
  background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
  borderRadius: '20px',
  padding: '2rem 2.5rem',
  marginBottom: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '1rem',
};

export default function Home() {
  const [allProducts, setAllProducts] = useState(null);
  const [allCategories, setAllCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [name, setName] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [direction, setDirection] = useState("asc");

  useEffect(()=>{
    fetch(`${process.env.REACT_APP_API_URL}/api/categories`)
    .then(resp => resp.json())
    .then(data=> setAllCategories(data));
  },[]);

  useEffect(()=>{
    searchProducts();
  },[direction]);

  function searchProducts(){
    const params = new URLSearchParams();
    if(selectedCategory) params.append("category",selectedCategory);
    if(name) params.append("name",name);
    if(maxPrice) params.append("maxPrice",maxPrice);
    if(direction) params.append("direction",direction);
   
    fetch(`${process.env.REACT_APP_API_URL}/api/search-products?${params.toString()}`)
    .then(resp => resp.json())
    .then(data => setAllProducts(data))
  }
  
  return (
    <div style={pageStyle}>
      {/* Hero */}
      <div style={heroStyle}>
        <div>
          <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>
            🛍️ Discover Products
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.3rem 0 0', fontSize: '0.95rem' }}>
            Find the best deals tailored for you
          </p>
        </div>
        {allProducts && (
          <div style={{ background: 'rgba(255,210,0,0.15)', border: '1px solid rgba(255,210,0,0.3)', borderRadius: '12px', padding: '0.6rem 1.2rem', color: '#ffd200', fontWeight: '700', fontSize: '0.95rem' }}>
            {allProducts.length} products found
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div style={searchBarStyle}>
        {allCategories && (
          <select style={selectStyle}
            onFocus={e => e.target.style.borderColor = '#667eea'}
            onBlur={e => e.target.style.borderColor = '#e0e8ff'}
            onChange={(event)=>setSelectedCategory(event.target.value)}>
            <option value="">📦 All Categories</option>
            {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        )}
        <input type="text" placeholder="🔍 Search by name..." style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#667eea'}
          onBlur={e => e.target.style.borderColor = '#e0e8ff'}
          onChange={(event)=>setName(event.target.value)} />
        <input type="text" placeholder="💰 Max price..." style={{ ...inputStyle, minWidth: '140px' }}
          onFocus={e => e.target.style.borderColor = '#667eea'}
          onBlur={e => e.target.style.borderColor = '#e0e8ff'}
          onChange={(event)=>setMaxPrice(event.target.value)} />
        <button style={sortBtnStyle}
          onMouseOver={e => e.target.style.opacity = '0.85'}
          onMouseOut={e => e.target.style.opacity = '1'}
          onClick={()=>setDirection(direction=="asc"?"desc":"asc")}>
          {direction=="asc" ? "↓ High to Low" : "↑ Low to High"}
        </button>
        <button style={searchBtnStyle}
          onMouseOver={e => e.target.style.opacity = '0.85'}
          onMouseOut={e => e.target.style.opacity = '1'}
          onClick={searchProducts}>
          Search
        </button>
      </div>

      {/* Products Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
        {allProducts && allProducts.map(prod => <Product key={prod.id} prod={prod}/>)}
      </div>

      {allProducts && allProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ color: '#555' }}>No products found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      )}
    </div>
  )
}
