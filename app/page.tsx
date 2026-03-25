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
        <h2>Let's Connect</h2>
        <p>Ready to order or have a question? Reach out to us directly.</p>
        <div className="lookbook-footer-btns">
          <a href="https://wa.me/971547491672" target="_blank" className="btn btn-whatsapp-lookbook">Chat on WhatsApp</a>
          <a href="https://www.instagram.com/noor_cosmetics53" target="_blank" className="btn btn-instagram-lookbook">Follow on Instagram</a>
        </div>
        <div className="lookbook-footer-bottom">© 2026 NOOR COSMETICS</div>
      </footer>
    </>
  );
}
