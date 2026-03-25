'use client';
import { useState, useEffect } from 'react';

// Simplified Product type for the homepage
type Product = { id: number; name: string; image_url: string; category: string; };

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => { if (d?.products) setProducts(d.products.slice(0, 7)); })
      .catch(() => {});
  }, []);

  return (
    <>
      <nav className="nav-lookbook">
        <a href="/" className="nav-brand-lookbook">NOOR</a>
        <div className="nav-lookbook-links">
          <a href="/products">View Catalogue</a>
          <a href="https://www.instagram.com/noor_cosmetics53" target="_blank">Instagram</a>
          <a href="https://wa.me/971547491672" target="_blank" className="btn btn-outline-lookbook">Order on WhatsApp</a>
        </div>
      </nav>

      <main className="lookbook-main">
        <section className="lookbook-hero">
          <div className="lookbook-hero-text">
            <h1 className="lookbook-title">The Noor Cosmetics <br />Collection.</h1>
            <p className="lookbook-subtitle">Your catalogue for beauty essentials. Browse our collection and find what you love.</p>
            <a href="/products" className="btn btn-primary-lookbook">Explore All Products</a>
          </div>
          <div className="lookbook-hero-image">
            {products.length > 0 && <img src={products[0].image_url} alt={products[0].name} />}
          </div>
        </section>

        <section className="lookbook-grid">
          {products.slice(1).map((p, i) => (
            <a key={p.id} href="/products" className={`lookbook-card card-lookbook-${i + 1}`}>
              <img src={p.image_url} alt={p.name} className="lookbook-card-img" />
              <div className="lookbook-card-info">
                <h3>{p.name}</h3>
                <span>{p.category}</span>
              </div>
            </a>
          ))}
        </section>
      </main>

      <footer className="lookbook-footer">
        <div className="footer-inner" style={{ textAlign: 'left' }}>
          <div>
            <div className="footer-brand">NOOR COSMETICS</div>
            <p style={{ color: '#666', fontSize: '1rem', marginBottom: '2rem', maxWidth: '400px' }}>
              Discover our curated collection of beauty essentials. From everyday favorites to special occasion glam, we've got you covered.
            </p>
            <div className="footer-socials">
              <a href="https://wa.me/971547491672" target="_blank">WhatsApp</a>
              <a href="https://www.instagram.com/noor_cosmetics53" target="_blank">Instagram</a>
            </div>
          </div>
          <div className="footer-links-col">
            <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Navigation</h4>
            <a href="/">Home</a>
            <a href="/products">Catalogue</a>
          </div>
          <div className="footer-contact-col">
            <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Get in Touch</h4>
            <a href="https://wa.me/971547491672" target="_blank">+971 54 749 1672</a>
            <a href="https://www.instagram.com/noor_cosmetics53" target="_blank">@noor_cosmetics53</a>
          </div>
        </div>
        <div className="footer-bottom">© 2026 NOOR COSMETICS. All rights reserved.</div>
      </footer>
    </>
  );
}
