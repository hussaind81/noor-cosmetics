-- Run this with: wrangler d1 execute noor-cosmetics --remote --file schema.sql

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS product_shades;

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

-- Additional sample products
INSERT INTO products (name, category, price, original_price, description, image_url, stock, badge) VALUES
-- Lipsticks
('Velvet Matte Lipstick - Ruby Red', 'Lipsticks', 95.00, NULL, 'A classic, bold red with a comfortable matte finish.', 'https://images.unsplash.com/photo-1590155294825-e456f5c29933?w=500&q=80', 60, 'Bestseller'),
('Liquid Lip - Peony Pink', 'Lipsticks', 110.00, 125.00, 'A long-wearing liquid lipstick in a vibrant pink shade.', 'https://images.unsplash.com/photo-1625093742435-6fa192b6fbce?w=500&q=80', 40, 'Sale'),
('Hydrating Lip Balm - Coconut', 'Lipsticks', 45.00, NULL, 'Nourishes and protects lips with a hint of coconut.', 'https://images.unsplash.com/photo-1620916566398-39f19a7e7d0d?w=500&q=80', 100, 'New'),
('High-Shine Lip Gloss - Crystal Clear', 'Lipsticks', 75.00, NULL, 'A non-sticky, crystal clear gloss for a glass-like finish.', 'https://images.unsplash.com/photo-1603983620992-a233b523b869?w=500&q=80', 70, NULL),

-- Foundation & Face
('Pro-Filter Foundation - Shade 240', 'Foundation', 180.00, NULL, 'A medium-to-full coverage foundation with a natural matte finish.', 'https://images.unsplash.com/photo-1621627192293-53d546bd3584?w=500&q=80', 50, 'Bestseller'),
('Radiant Finish Concealer - Light', 'Face', 90.00, NULL, 'Brightens and conceals imperfections with a radiant finish.', 'https://images.unsplash.com/photo-1590159763128-c59a3393a2d7?w=500&q=80', 65, NULL),
('Pressed Powder Blush - Peach', 'Face', 115.00, NULL, 'A soft, buildable blush that gives a healthy, natural-looking flush.', 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=500&q=80', 45, 'New'),
('Matte Bronzer - Sunkissed', 'Face', 130.00, 150.00, 'A finely milled bronzing powder for a natural, sunkissed glow.', 'https://images.unsplash.com/photo-1583243567358-b6c0904f143a?w=500&q=80', 30, 'Sale'),

-- Eyes
('Volumizing Mascara - Black', 'Eyes', 85.00, NULL, 'Lifts, lengthens, and volumizes lashes without clumping.', 'https://images.unsplash.com/photo-1512207128881-39518b5f5418?w=500&q=80', 80, 'Bestseller'),
('Waterproof Liquid Eyeliner', 'Eyes', 95.00, NULL, 'A precision-tip liquid eyeliner that lasts all day.', 'https://images.unsplash.com/photo-1615400242679-14a1c5b8817c?w=500&q=80', 70, NULL),
('The Nudes Eyeshadow Palette', 'Eyes', 220.00, NULL, 'A versatile palette with 12 essential neutral shades.', 'https://images.unsplash.com/photo-1580893213243-642c91a00392?w=500&q=80', 35, 'Featured'),
('Brow Definer Pencil - Medium Brown', 'Eyes', 70.00, NULL, 'A retractable pencil to shape, define, and fill brows.', 'https://images.unsplash.com/photo-1560793532-9c42845b329a?w=500&q=80', 55, NULL),

-- Skincare
('Gentle Foaming Cleanser', 'Skincare', 120.00, NULL, 'A soap-free cleanser that removes impurities without stripping skin.', 'https://images.unsplash.com/photo-1556228852-6d45a7d8b182?w=500&q=80', 60, 'New'),
('Daily Hydrating Moisturizer', 'Skincare', 160.00, NULL, 'A lightweight, fast-absorbing moisturizer for all skin types.', 'https://images.unsplash.com/photo-1600180951388-95a9383fa7a9?w=500&q=80', 45, 'Bestseller'),
('Vitamin C Brightening Serum', 'Skincare', 210.00, 250.00, 'A potent serum that brightens skin and reduces dark spots.', 'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=500&q=80', 30, 'Sale'),
('Hydrating Sheet Mask (5 pack)', 'Skincare', 90.00, NULL, 'Intensely hydrates and revitalizes tired skin in 15 minutes.', 'https://images.unsplash.com/photo-1598662883294-4c40ed523889?w=500&q=80', 50, NULL),
('SPF 50+ Daily Sunscreen', 'Skincare', 135.00, NULL, 'A non-greasy, broad-spectrum sunscreen for daily protection.', 'https://images.unsplash.com/photo-1580016599488-70b2b529d130?w=500&q=80', 70, 'Featured'),

-- Perfume
('Eau de Parfum - Midnight Bloom', 'Perfume', 350.00, NULL, 'A mysterious and alluring scent with notes of jasmine and black cherry.', 'https://images.unsplash.com/photo-1585399001829-d6c3f03a2587?w=500&q=80', 25, 'Featured'),
('Fresh Citrus Eau de Toilette', 'Perfume', 280.00, NULL, 'A light and refreshing fragrance with notes of lemon and bergamot.', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80', 35, NULL),
('Rose & Oud Perfume Oil', 'Perfume', 190.00, NULL, 'A concentrated, long-lasting perfume oil with a classic rose and oud blend.', 'https://images.unsplash.com/photo-1622618979289-befe34a746c3?w=500&q=80', 40, 'New'),

-- Nails
('Long-Lasting Nail Polish - Classic Red', 'Nails', 55.00, NULL, 'A chip-resistant nail polish in a timeless red shade.', 'https://images.unsplash.com/photo-1604331135422-a13235e54c43?w=500&q=80', 90, NULL),
('Gel-Shine Top Coat', 'Nails', 65.00, NULL, 'A quick-drying top coat that provides a high-shine, gel-like finish.', 'https://images.unsplash.com/photo-1519415387722-a1c3bbef7258?w=500&q=80', 75, 'Bestseller'),
('Nourishing Cuticle Oil', 'Nails', 50.00, NULL, 'Hydrates and conditions cuticles for healthier-looking nails.', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80', 60, NULL),

-- More Products
('Illuminating Primer', 'Face', 140.00, NULL, 'Creates a smooth, radiant base for makeup application.', 'https://images.unsplash.com/photo-1599948128015-e9ab40a5c419?w=500&q=80', 40, 'New'),
('Makeup Setting Spray - Matte Finish', 'Face', 110.00, NULL, 'Locks in makeup for a shine-free, matte look that lasts all day.', 'https://images.unsplash.com/photo-1556760544-4421763def42?w=500&q=80', 50, NULL),
('Hyaluronic Acid Serum', 'Skincare', 195.00, NULL, 'Deeply hydrates and plumps skin to reduce the appearance of fine lines.', 'https://images.unsplash.com/photo-1608325584837-83c1b1839c43?w=500&q=80', 35, 'Bestseller'),
('Charcoal Detox Mask', 'Skincare', 130.00, 150.00, 'Draws out impurities and refines pores for a clearer complexion.', 'https://images.unsplash.com/photo-1620916728138-a31464599694?w=500&q=80', 25, 'Sale'),
('Professional Makeup Brush Set (8 pcs)', 'General', 250.00, NULL, 'An essential set of high-quality brushes for face and eyes.', 'https://images.unsplash.com/photo-1526947425562-929b6f68278c?w=500&q=80', 30, 'Featured'),
('Miracle Beauty Sponge', 'General', 40.00, NULL, 'A versatile makeup sponge for a flawless, airbrushed finish.', 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=500&q=80', 150, NULL),
('Micellar Cleansing Water', 'Skincare', 80.00, NULL, 'Gently removes makeup and impurities without rinsing.', 'https://images.unsplash.com/photo-1620916566398-39f19a7e7d0d?w=500&q=80', 80, NULL),
('Cream Eyeshadow Stick - Bronze', 'Eyes', 85.00, NULL, 'A long-wearing, easy-to-use cream eyeshadow stick.', 'https://images.unsplash.com/photo-1583243567358-b6c0904f143a?w=500&q=80', 45, 'New'),
('Lip & Cheek Tint - Rose', 'Face', 95.00, NULL, 'A multi-purpose tint for a natural flush of color on lips and cheeks.', 'https://images.unsplash.com/photo-1586899028174-e7098604235b?w=500&q=80', 55, NULL),
('Overnight Recovery Cream', 'Skincare', 220.00, NULL, 'A rich, nourishing cream that works overnight to repair and hydrate skin.', 'https://images.unsplash.com/photo-1600180951388-95a9383fa7a9?w=500&q=80', 30, 'Featured'),
('Glitter Nail Polish - Gold', 'Nails', 60.00, NULL, 'A dazzling glitter polish for a festive, eye-catching look.', 'https://images.unsplash.com/photo-1604331135422-a13235e54c43?w=500&q=80', 60, NULL),
('Travel Perfume Atomizer', 'Perfume', 50.00, NULL, 'A refillable, travel-sized atomizer for your favorite fragrance.', 'https://images.unsplash.com/photo-1550639113-2c41353f2b52?w=500&q=80', 100, NULL),
('Eyelash Curler', 'General', 60.00, NULL, 'A professional-quality eyelash curler for a dramatic, lasting curl.', 'https://images.unsplash.com/photo-1540555233018-160aa1a34869?w=500&q=80', 80, NULL),
('Exfoliating Face Scrub', 'Skincare', 115.00, NULL, 'Gently buffs away dead skin cells for a smoother, brighter complexion.', 'https://images.unsplash.com/photo-1598662883294-4c40ed523889?w=500&q=80', 40, NULL),
('Waterproof Brow Gel - Clear', 'Eyes', 75.00, NULL, 'A clear, long-lasting gel that sets and tames brows.', 'https://images.unsplash.com/photo-1560793532-9c42845b329a?w=500&q=80', 50, NULL),
('Satin Lipstick - Nude Beige', 'Lipsticks', 90.00, NULL, 'A creamy, satin-finish lipstick in a universally flattering nude shade.', 'https://images.unsplash.com/photo-1625093742435-6fa192b6fbce?w=500&q=80', 60, 'Bestseller'),
('Color Correcting Primer - Green', 'Face', 125.00, NULL, 'A green-toned primer to neutralize redness and even out skin tone.', 'https://images.unsplash.com/photo-1599948128015-e9ab40a5c419?w=500&q=80', 30, NULL),
('Retinol Night Serum', 'Skincare', 240.00, 280.00, 'A powerful anti-aging serum with retinol to reduce wrinkles.', 'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=500&q=80', 20, 'Sale'),
('Matte Nail Polish - Black', 'Nails', 55.00, NULL, 'A chic, matte-finish nail polish in a bold black shade.', 'https://images.unsplash.com/photo-1519415387722-a1c3bbef7258?w=500&q=80', 50, NULL),
('Vanilla Body Mist', 'Perfume', 95.00, NULL, 'A light, sweet body mist with a warm vanilla scent.', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80', 70, NULL);


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
INSERT INTO products (name, category, price, original_price, description, image_url, stock, badge) VALUES
('Red Velvet Lipstick', 'Lipsticks', 89.00, 109.00, 'Luxurious long-lasting matte formula', 'https://images.unsplash.com/photo-1586899028174-e7098604235b?w=500&q=80', 45, 'Bestseller'),
('HD Foundation', 'Foundation', 129.00, NULL, 'Full coverage buildable finish', 'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=500&q=80', 32, 'New'),
('Smoky Eye Palette', 'Eyes', 165.00, 199.00, '12 stunning eyeshadow shades', 'https://images.unsplash.com/photo-1512207728631-58b52b42e6f4?w=500&q=80', 18, 'Sale'),
('Glow Highlighter', 'Face', 110.00, NULL, 'Luminous golden shimmer for a radiant finish', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80', 28, 'Featured');
