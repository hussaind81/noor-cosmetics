'use client';
import { useState, useEffect } from 'react';

type Product = {
  id: number; name: string; price: number; original_price?: number;
  image_url: string; category: string; description: string; stock: number;
  badge?: string;
};

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => {
        if (d?.products) {
          setFeatured(d.products.filter((p: Product) => p.badge === 'Featured').slice(0, 5));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-brand">NOOR</a>
        <ul className="nav-links">
          <li><a href="/products">Catalogue</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="https://www.instagram.com/noor_cosmetics53" target="_blank">Instagram</a></li>
          <li>
            <a href="https://wa.me/971547491672" target="_blank" className="nav-whatsapp">
              WhatsApp
            </a>
          </li>
        </ul>
      </nav>

      <section className="hero-new">
        <div className="hero-new-content">
          <h1 className="hero-new-title">Elegance in Every Shade.</h1>
          <p className="hero-new-subtitle">Discover a curated collection of premium cosmetics, designed to unveil your natural radiance. Your journey to beauty starts here.</p>
          <div className="hero-new-btns">
            <a href="/products" className="btn btn-primary">Explore the Catalogue</a>
            <a href="https://wa.me/971547491672" target="_blank" className="btn btn-outline">Order on WhatsApp</a>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section featured-section">
          <div className="section-header">
            <h2 className="section-title">Featured Collection</h2>
            <p className="section-subtitle">Hand-picked essentials for the modern connoisseur.</p>
          </div>
          <div className="featured-grid">
            {featured.map((p, i) => (
              <a key={p.id} href="/products" className={`featured-card card-${i + 1}`}>
                <img src={p.image_url} alt={p.name} className="featured-img" />
                <div className="featured-info">
                  <span className="featured-category">{p.category}</span>
                  <h3 className="featured-name">{p.name}</h3>
                  <span className="featured-price">AED {p.price}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="section cta-section">
        <div className="cta-content">
          <h2>Your Beauty, Our Passion.</h2>
          <p>From skincare essentials to statement-making makeup, we bring you the best in beauty. Have a question or ready to order? We're just a message away.</p>
          <div className="cta-btns">
            <a href="https://wa.me/971547491672" target="_blank" className="btn btn-whatsapp-solid">Chat on WhatsApp</a>
            <a href="https://www.instagram.com/noor_cosmetics53" target="_blank" className="btn btn-instagram-solid">Follow on Instagram</a>
          </div>
        </div>
      </section>

      <footer className="footer-new">
        <div className="footer-new-inner">
          <div className="footer-brand">NOOR COSMETICS</div>
          <div className="footer-links">
            <a href="/products">Catalogue</a>
            <a href="https://www.instagram.com/noor_cosmetics53" target="_blank">Instagram</a>
            <a href="https://wa.me/971547491672" target="_blank">WhatsApp</a>
          </div>
          <div className="footer-bottom">© 2026 Noor Cosmetics. A curated beauty experience.</div>
        </div>
      </footer>
    </>
  );
}
