'use client';
import { useState, useEffect } from 'react';

type Product = {
  id: number; name: string; price: number; original_price?: number;
  image_url: string; category: string; description: string; stock: number;
  badge?: string;
};

export default function Home() {
  const [trending, setTrending] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => {
        if (d?.products) {
          setTrending(d.products.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-brand">
          <span className="nav-logo-n">N</span>OOR
        </a>
        <ul className="nav-links">
          <li><a href="/products">Shop</a></li>
          <li><a href="#categories">Categories</a></li>
          <li><a href="#contact">Contact</a></li>
          <li>
            <a href="https://wa.me/971547491672" target="_blank" className="nav-whatsapp">
              💬 WhatsApp
            </a>
          </li>
        </ul>
      </nav>

      {/* HERO BANNER */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">✨ New Collection 2026 </div>
          <h1 style={{fontSize:'clamp(2.5rem, 6vw, 4.5rem)'}}>Elevate Your<br /><span>Beauty Routine</span></h1>
          <p style={{fontSize:'1.1rem', maxWidth:'500px'}}>Premium cosmetics curated for the modern woman. Authentic products delivered to your door across UAE with 24-hour delivery.</p>
          <div className="hero-btns">
            <a href="/products" className="btn btn-primary" style={{padding:'1rem 2.5rem', borderRadius:'50px', fontSize:'1.1rem'}}>Shop the Collection →</a>
            <a href="https://www.instagram.com/noor_cosmetics53" target="_blank" className="btn btn-instagram" style={{padding:'1rem 2rem', borderRadius:'50px'}}>
              📸 Follow Us
            </a>
          </div>
        </div>
        <div className="hero-image-wrap">
          <div className="hero-blob" style={{width:'450px', height:'450px'}}></div>
          <div className="hero-img-placeholder" style={{fontSize:'12rem'}}>💄</div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="trust-bar">
        <div className="trust-inner">
          <div className="trust-item">
            <span className="trust-icon">💰</span>
            <div>
              <strong>Cash on Delivery</strong>
              <p>Across all UAE</p>
            </div>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-item">
            <span className="trust-icon">🚚</span>
            <div>
              <strong>Free Delivery</strong>
              <p>Orders above AED 150</p>
            </div>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-item">
            <span className="trust-icon">⚡</span>
            <div>
              <strong>24hr Delivery</strong>
              <p>Fast & Reliable</p>
            </div>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-item">
            <span className="trust-icon">🎁</span>
            <div>
              <strong>Free Gift</strong>
              <p>With every order</p>
            </div>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-item">
            <span className="trust-icon">✅</span>
            <div>
              <strong>100% Authentic</strong>
              <p>Genuine brands only</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING SECTION */}
      {trending.length > 0 && (
        <section className="section" style={{background:'#fff'}}>
          <div className="section-header">
            <h2 className="section-title">Trending Now</h2>
            <p className="section-subtitle">Our most loved beauty essentials</p>
          </div>
          <div className="products-grid" style={{maxWidth:'1200px', margin:'0 auto'}}>
            {trending.map(p => (
              <a key={p.id} href="/products" className="product-card" style={{textDecoration:'none', color:'inherit'}}>
                <div className="product-image">
                  <img src={p.image_url} alt={p.name} />
                  {p.badge && <div className={`badge-ui badge-${p.badge.toLowerCase()}`} style={{position:'absolute', top:'0.75rem', left:'0.75rem'}}>{p.badge}</div>}
                </div>
                <div className="product-info">
                  <div className="product-category">{p.category}</div>
                  <div className="product-name" style={{fontSize:'1.1rem'}}>{p.name}</div>
                  <div className="price-tag">
                    <span className="price-now">AED {p.price}</span>
                    {p.original_price && <span className="price-old">AED {p.original_price}</span>}
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div style={{textAlign:'center', marginTop:'3rem'}}>
            <a href="/products" className="btn btn-outline" style={{padding:'0.8rem 2.5rem', borderRadius:'50px'}}>View All Products →</a>
          </div>
        </section>
      )}

      {/* CATEGORIES */}
      <section className="section" id="categories" style={{background:'#fafafa'}}>
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Find exactly what you're looking for</p>
        </div>
        <div className="categories-grid" style={{maxWidth:'1100px', margin:'0 auto'}}>
          {[
            { name: 'Lipsticks', icon: '💄', color: '#fff1f2', border: '#fecdd3' },
            { name: 'Foundation', icon: '🧴', color: '#fef3c7', border: '#fde68a' },
            { name: 'Eyes', icon: '👁️', color: '#ede9fe', border: '#ddd6fe' },
            { name: 'Face', icon: '✨', color: '#fce7f3', border: '#fbcfe8' },
            { name: 'Skincare', icon: '🌿', color: '#dcfce7', border: '#bbf7d0' },
            { name: 'Perfume', icon: '🌸', color: '#e0f2fe', border: '#bae6fd' },
            { name: 'Nails', icon: '💅', color: '#fff7ed', border: '#fed7aa' },
            { name: 'General', icon: '🛍️', color: '#f0fdf4', border: '#bbf7d0' },
          ].map(cat => (
            <a key={cat.name} href={`/products?cat=${cat.name}`} className="cat-card" style={{ background: cat.color, borderColor: cat.border }}>
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
              <span className="cat-arrow">→</span>
            </a>
          ))}
        </div>
      </section>

      {/* WHY NOOR */}
      <section className="why-section">
        <div className="why-inner">
          <div className="why-text">
            <div className="why-badge">Why Choose Noor Cosmetics</div>
            <h2 style={{fontSize:'3rem'}}>Beauty You Can <br /><span>Trust 🌸</span></h2>
            <p style={{fontSize:'1.1rem'}}>At Noor Cosmetics, we believe every woman deserves to feel beautiful. We carefully select only the finest beauty products from trusted brands to bring you an unmatched shopping experience in the UAE.</p>
            <ul className="why-list" style={{marginTop:'2rem'}}>
              <li style={{fontSize:'1rem'}}>✨ Hand-picked premium products</li>
              <li style={{fontSize:'1rem'}}>💎 100% authentic & genuine guaranteed</li>
              <li style={{fontSize:'1rem'}}>🎁 Surprise gift with every order</li>
              <li style={{fontSize:'1rem'}}>⚡ Express 24-hour delivery UAE-wide</li>
              <li style={{fontSize:'1rem'}}>💰 Secure Cash on Delivery</li>
              <li style={{fontSize:'1rem'}}>🚚 Free delivery on orders AED 150+</li>
            </ul>
            <a href="/products" className="btn btn-primary" style={{ marginTop: '2.5rem', display: 'inline-block', padding:'1rem 2.5rem', borderRadius:'50px' }}>
              Explore Collection →
            </a>
          </div>
          <div className="why-image" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>
            <div className="why-card why-card-1" style={{padding:'2.5rem'}}>
              <span style={{fontSize:'3.5rem'}}>🎁</span>
              <strong style={{fontSize:'1.2rem'}}>Free Gift</strong>
              <p>With every single order</p>
            </div>
            <div className="why-card why-card-2" style={{padding:'2.5rem'}}>
              <span style={{fontSize:'3.5rem'}}>⚡</span>
              <strong style={{fontSize:'1.2rem'}}>Express</strong>
              <p>24hr delivery across UAE</p>
            </div>
            <div className="why-card why-card-3" style={{padding:'2.5rem', gridColumn:'1 / -1'}}>
              <span style={{fontSize:'3.5rem'}}>✅</span>
              <strong style={{fontSize:'1.2rem'}}>Authentic</strong>
              <p>100% genuine products only</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT / SOCIAL */}
      <section className="section" id="contact" style={{background:'#fff'}}>
        <div className="contact-grid">
          <a href="https://www.instagram.com/noor_cosmetics53" target="_blank" className="contact-card contact-instagram">
            <div className="contact-icon">📸</div>
            <h3>Follow on Instagram</h3>
            <p>@noor_cosmetics53</p>
            <span className="contact-btn">Visit Profile →</span>
          </a>
          <a href="https://wa.me/971547491672" target="_blank" className="contact-card contact-whatsapp">
            <div className="contact-icon">💬</div>
            <h3>Order on WhatsApp</h3>
            <p>+971 54 749 1672</p>
            <span className="contact-btn">Chat Now →</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div>
            <div className="footer-brand">🌸 NOOR COSMETICS</div>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color:'#9ca3af' }}>Premium beauty for every woman. Hand-picked authentic products delivered across UAE.</p>
            <div className="footer-socials" style={{marginTop:'1.5rem'}}>
              <a href="https://www.instagram.com/noor_cosmetics53" target="_blank">📸 Instagram</a>
              <a href="https://wa.me/971547491672" target="_blank">💬 WhatsApp</a>
            </div>
          </div>
          <div>
            <strong style={{ color: 'white', display: 'block', marginBottom: '1.25rem', fontSize:'1rem' }}>Shop Collection</strong>
            <a href="/products">All Products</a>
            <a href="/products?cat=Lipsticks">Lipsticks</a>
            <a href="/products?cat=Foundation">Foundation</a>
            <a href="/products?cat=Skincare">Skincare</a>
            <a href="/products?cat=Perfume">Perfume</a>
          </div>
          <div>
            <strong style={{ color: 'white', display: 'block', marginBottom: '1.25rem', fontSize:'1rem' }}>Our Promise</strong>
            <a href="#">Free Delivery AED 150+</a>
            <a href="#">Cash on Delivery</a>
            <a href="#">24hr Delivery UAE</a>
            <a href="#">Free Gift Every Order</a>
          </div>
          <div>
            <strong style={{ color: 'white', display: 'block', marginBottom: '1.25rem', fontSize:'1rem' }}>Get in Touch</strong>
            <a href="https://wa.me/971547491672" target="_blank">+971 54 749 1672</a>
            <a href="https://www.instagram.com/noor_cosmetics53" target="_blank">@noor_cosmetics53</a>
            <p style={{fontSize:'0.85rem', color:'#6b7280', marginTop:'1rem'}}>Available 24/7 for your beauty needs.</p>
          </div>
        </div>
        <div className="footer-bottom">© 2026 Noor Cosmetics. All rights reserved. | Made with 🌸 in UAE</div>
      </footer>
    </>
  );
}
