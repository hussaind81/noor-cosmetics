-- Run this with: wrangler d1 execute noor-cosmetics --remote --file schema.sql

DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  price REAL NOT NULL DEFAULT 0,
  original_price REAL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  stock INTEGER DEFAULT 0,
  badge TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  url TEXT NOT NULL,
  is_primary INTEGER DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE product_shades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  color_code TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Sample products
INSERT INTO products (name, category, price, description, image_url, stock) VALUES
('Red Velvet Lipstick', 'Lipsticks', 89.00, 'Luxurious long-lasting matte formula with rich pigment', 'https://images.unsplash.com/photo-1586899028174-e7098604235b?w=500&q=80', 45),
('HD Foundation', 'Foundation', 129.00, 'Full coverage buildable finish for all skin tones', 'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=500&q=80', 32),
('Smoky Eye Palette', 'Eyes', 165.00, '12 stunning eyeshadow shades for day to night looks', 'https://images.unsplash.com/photo-1512207728631-58b52b42e6f4?w=500&q=80', 18),
('Glow Highlighter', 'Face', 110.00, 'Luminous golden shimmer for a radiant finish', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80', 28);
