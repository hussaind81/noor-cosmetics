'use client';
import { useState, useEffect } from 'react';

type Product = {
  id: number; name: string; price: number; original_price?: number;
  image_url: string; category: string; description: string; stock: number;
  badge?: string;
  images?: { id: number, url: string, is_primary: number }[];
  shades_list?: { id: number, name: string, color_code: string }[];
};

const CATS = ['All','Lipsticks','Foundation','Eyes','Face','Skincare','Nails','Perfume','General'];
const PHONE = '971547491672';
const INSTAGRAM = 'noor_cosmetics53';

function getWhatsAppOrder(product: Product, shade?: { name: string, color_code: string } | null) {
  const lines = [
    `Hi Noor Cosmetics! I'm interested in this product:`,
    ``,
    `*${product.name}*`,
    shade ? `Shade: *${shade.name}*` : '',
    `Price: AED ${product.price}`,
    ``,
    `Please let me know about availability. Thank you!`,
  ];
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export default function ProductsPage() {
  const [all, setAll] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedShade, setSelectedShade] = useState<{ name: string, color_code: string } | null>(null);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    if (catParam) setCat(catParam);
  }, []);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => { if (d?.products?.length) setAll(d.products); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let r = [...all];
    if (search) r = r.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
    if (cat !== 'All') r = r.filter(p => p.category === cat);
    if (sort === 'price-asc') r.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') r.sort((a, b) => b.price - a.price);
    else if (sort === 'name') r.sort((a, b) => a.name.localeCompare(b.name));
    setFiltered(r);
  }, [search, cat, sort, all]);

  const openProduct = (p: Product) => {
    setSelected(p);
    setSelectedShade(p.shades_list?.length ? p.shades_list[0] : null);
    setActiveImage(p.image_url);
    document.body.style.overflow = 'hidden';
  };

  const closeProduct = () => {
    setSelected(null);
    document.body.style.overflow = '';
  };

  const getBadgeStyle = (badge: string) => {
    if (badge === 'Sale') return { background: '#dc2626', color: 'white' };
    if (badge === 'New') return { background: '#16a34a', color: 'white' };
    if (badge === 'Bestseller') return { background: '#d4af37', color: 'white' };
    if (badge === 'Featured') return { background: '#7c3aed', color: 'white' };
    return { background: '#e11d48', color: 'white' };
  };

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-brand">NOOR</a>
        <ul className="nav-links">
          <li><a href="/products">Catalogue</a></li>
          <li><a href="/">Home</a></li>
          <li><a href={`https://wa.me/${PHONE}`} target="_blank" className="nav-whatsapp">Order Now</a></li>
        </ul>
      </nav>



      <div className="delivery-banner">
        🚚 Free delivery AED 150+ &nbsp;|&nbsp; ⚡ 24hr delivery &nbsp;|&nbsp; 🎁 Free gift &nbsp;|&nbsp; 💰 Cash on delivery &nbsp;|&nbsp; 🏦 Bank transfer
      </div>

      <div className="section">
        <h1 className="section-title">Our Collection</h1>
        <p className="section-subtitle">{filtered.length} of {all.length} products</p>

        <div className="cat-pills">
          {CATS.map(c => (
            <button key={c} className={`cat-pill ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>

        <div className="search-sort-bar">
          <input className="search-input" placeholder="🔍  Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {loading ? (
          <div className="empty-state"><p>Loading products...</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><div className="icon">🔍</div><p>No products found.</p></div>
        ) : (
          <div className="products-grid">
            {filtered.map(p => {
              const isWishlisted = wishlist.includes(p.id);
              const discount = p.original_price ? Math.round((1 - p.price / p.original_price) * 100) : 0;
              return (
                <div key={p.id} className="product-card">
                  <div className="product-image" onClick={() => openProduct(p)} style={{ cursor: 'pointer' }}>
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} onError={e => { (e.target as HTMLImageElement).parentElement!.innerHTML = '<span style="font-size:3rem">💄</span>'; }} />
                      : <span>💄</span>
                    }
                    {p.badge && <div className={`badge-ui badge-${p.badge.toLowerCase()}`} style={{position:'absolute',top:'0.75rem',left:'0.75rem'}}>{p.badge}</div>}
                    {discount > 0 && <div className="discount-pill" style={{position:'absolute',top:'0.75rem',right:'0.75rem'}}>-{discount}%</div>}
                    <button className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} onClick={e => { e.stopPropagation(); toggleWishlist(p.id); }}>
                      {isWishlisted ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <div className="product-info">
                    <div className="product-category">{p.category}</div>
                    <div className="product-name" onClick={() => openProduct(p)} style={{ cursor: 'pointer' }}>{p.name}</div>
                    
                    {p.shades_list && p.shades_list.length > 0 && (
                      <div className="shade-swatches">
                        {p.shades_list.slice(0, 5).map(s => (
                          <div key={s.id} className="shade-dot" style={{ background: s.color_code }} title={s.name}></div>
                        ))}
                        {p.shades_list.length > 5 && <span className="shade-more">+{p.shades_list.length - 5}</span>}
                      </div>
                    )}
                    
                    <div className="product-footer">
                      <div className="price-tag">
                        <span className="price-now">AED {Number(p.price).toFixed(0)}</span>
                        {p.original_price && <span className="price-old">AED {Number(p.original_price).toFixed(0)}</span>}
                      </div>
                    </div>
                    
                    <button className="btn btn-primary btn-sm" style={{width:'100%',marginTop:'1rem',borderRadius:'8px'}} onClick={() => openProduct(p)}>
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PRODUCT DETAIL MODAL */}
      {selected && (
        <div className="modal-overlay" onClick={closeProduct}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{maxWidth:'800px',display:'grid',gridTemplateColumns:window.innerWidth > 768 ? '1fr 1fr' : '1fr'}}>
            <button className="modal-close" onClick={closeProduct}>✕</button>

            {/* GALLERY SECTION */}
            <div className="modal-gallery-wrap" style={{padding:'1rem'}}>
              <div className="gallery-main">
                <img src={activeImage || selected.image_url} alt={selected.name} />
              </div>
              {(selected.images && selected.images.length > 0) && (
                <div className="gallery-thumbs" style={{marginTop:'0.75rem'}}>
                  <div className={`thumb ${activeImage === selected.image_url ? 'active' : ''}`} onClick={() => setActiveImage(selected.image_url)}>
                    <img src={selected.image_url} alt="main" />
                  </div>
                  {selected.images.map((img, i) => (
                    <div key={i} className={`thumb ${activeImage === img.url ? 'active' : ''}`} onClick={() => setActiveImage(img.url)}>
                      <img src={img.url} alt={`extra-${i}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* INFO SECTION */}
            <div className="modal-info" style={{padding:'2rem',background:'white',maxHeight:'90vh',overflowY:'auto'}}>
              <div className="product-badges">
                {selected.badge && <span className={`badge-ui badge-${selected.badge.toLowerCase()}`}>{selected.badge}</span>}
                {selected.original_price && <span className="badge-ui badge-sale">Save {Math.round((1 - selected.price / selected.original_price) * 100)}%</span>}
              </div>
              
              <div className="product-category">{selected.category}</div>
              <h2 className="modal-title" style={{fontSize:'1.8rem',marginBottom:'0.5rem'}}>{selected.name}</h2>
              
              <div className="price-tag" style={{marginBottom:'1.5rem'}}>
                <span className="price-now" style={{fontSize:'2rem'}}>AED {Number(selected.price).toFixed(0)}</span>
                {selected.original_price && <span className="price-old" style={{fontSize:'1.2rem'}}>AED {Number(selected.original_price).toFixed(0)}</span>}
              </div>

              <p className="modal-desc" style={{marginBottom:'1.5rem',color:'var(--gray)',lineHeight:'1.8'}}>{selected.description}</p>

              {/* SHADE SELECTOR */}
              {selected.shades_list && selected.shades_list.length > 0 && (
                <div className="shade-picker" style={{marginBottom:'2rem'}}>
                  <p className="shade-label">Select Color/Shade: <strong>{selectedShade?.name}</strong></p>
                  <div className="shade-selector">
                    {selected.shades_list.map(s => (
                      <div key={s.id} className={`shade-option ${selectedShade?.name === s.name ? 'active' : ''}`} onClick={() => setSelectedShade(s)}>
                        <div className="shade-circle" style={{ background: s.color_code }}></div>
                        <span className="shade-name-sm">{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTIONS */}
              <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:'1rem'}}>
                  <button className="btn btn-primary" style={{padding:'1rem',borderRadius:'12px',fontSize:'1.1rem'}} onClick={() => { addToCart(selected, selectedShade); closeProduct(); }}>
                    Add to Bag 🛍️
                  </button>
                  <button className={`wishlist-btn ${wishlist.includes(selected.id) ? 'active' : ''}`} onClick={() => toggleWishlist(selected.id)} style={{position:'static',width:'54px',height:'54px',fontSize:'1.5rem'}}>
                    {wishlist.includes(selected.id) ? '❤️' : '🤍'}
                  </button>
                </div>
                
                <button className="btn btn-outline" style={{padding:'1rem',borderRadius:'12px'}} onClick={() => setShowOrderForm(true)}>
                  Quick Buy via WhatsApp →
                </button>
              </div>

              {/* QUICK ORDER FORM */}
              {showOrderForm && (
                <div className="order-form" style={{marginTop:'1.5rem'}}>
                  <h4>🚀 Quick Checkout</h4>
                  <input placeholder="Your Name" value={orderName} onChange={e => setOrderName(e.target.value)} className="order-input" />
                  <input placeholder="UAE Delivery Address" value={orderAddress} onChange={e => setOrderAddress(e.target.value)} className="order-input" />
                  <a href={getWhatsAppOrder([{product:selected, shade:selectedShade || undefined, quantity:1}], orderName, orderAddress)} target="_blank" className="btn btn-primary" style={{textAlign:'center',borderRadius:'10px'}}>
                    Confirm Order
                  </a>
                </div>
              )}

              <div className="modal-trust" style={{marginTop:'2rem',borderTop:'1px solid #eee',paddingTop:'1.5rem'}}>
                <span>🚚 Free delivery AED 150+</span>
                <span>🎁 Free gift included</span>
                <span>⚡ 24hr delivery UAE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer>
        <div className="footer-inner">
          <div>
            <div className="footer-brand">🌸 NOOR COSMETICS</div>
            <div className="footer-socials" style={{ marginTop: '0.75rem' }}>
              <a href={`https://www.instagram.com/${INSTAGRAM}`} target="_blank">📸 Instagram</a>
              <a href={`https://wa.me/${PHONE}`} target="_blank">💬 WhatsApp</a>
            </div>
          </div>
          <div><a href="/">Home</a><a href="/products">Shop</a></div>
          <div>
            <a href={`https://wa.me/${PHONE}`} target="_blank">+971 54 749 1672</a>
            <a href={`https://www.instagram.com/${INSTAGRAM}`} target="_blank">@noor_cosmetics53</a>
          </div>
        </div>
        <div className="footer-bottom">© 2026 Noor Cosmetics. All rights reserved.</div>
      </footer>
    </>
  );
}
