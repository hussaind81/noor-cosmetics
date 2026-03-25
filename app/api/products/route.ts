export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';

function getDB(req: NextRequest): any {
  console.log('Attempting to get DB binding...');
  const env = (process.env as any);
  if (env.DB) {
    console.log('Found DB binding in process.env.DB');
    return env.DB;
  }
  console.log('DB not found in process.env. Trying globalThis.');
  if ((globalThis as any).DB) {
    console.log('Found DB binding in globalThis.DB');
    return (globalThis as any).DB;
  }
  console.error('CRITICAL: D1 Database binding not found.');
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const db = getDB(request);
    
    if (!db) {
      console.error('Database connection failed: DB object is null.');
      return NextResponse.json({ success: false, error: 'Database not connected', source: 'error' });
    }

    if (id) {
      const product = await db.prepare('SELECT * FROM products WHERE id=?').bind(id).first();
      if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      
      const images = await db.prepare('SELECT * FROM product_images WHERE product_id=?').bind(id).all();
      const shades = await db.prepare('SELECT * FROM product_shades WHERE product_id=?').bind(id).all();
      
      return NextResponse.json({ 
        success: true, 
        product: { ...product, images: images.results, shades_list: shades.results } 
      });
    }

    const { results: products } = await db.prepare('SELECT * FROM products ORDER BY id DESC').all();
    
    const enrichedProducts = await Promise.all(products.map(async (p: any) => {
      try {
        const images = await db.prepare('SELECT * FROM product_images WHERE product_id=?').bind(p.id).all();
        const shades = await db.prepare('SELECT * FROM product_shades WHERE product_id=?').bind(p.id).all();
        return { ...p, images: images.results || [], shades_list: shades.results || [] };
      } catch (e) {
        return { ...p, images: [], shades_list: [] };
      }
    }));

    return NextResponse.json({ success: true, products: enrichedProducts, source: 'database' });
  } catch (err) {
    console.error('API GET Error:', err);
    return NextResponse.json({ success: false, error: (err as Error).message, source: 'error' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const b = await request.json();
    if (!b.name || !b.price) return NextResponse.json({ success: false, error: 'Name and price required' }, { status: 400 });
    const db = getDB(request);
    if (!db) return NextResponse.json({ success: false, error: 'Database not connected' }, { status: 503 });

    // Insert product
    const { meta } = await db.prepare('INSERT INTO products (name,category,price,original_price,description,image_url,stock,badge) VALUES (?,?,?,?,?,?,?,?)')
      .bind(b.name, b.category||'General', Number(b.price), b.original_price?Number(b.original_price):null, b.description||'', b.image_url||'', Number(b.stock)||0, b.badge||null).run();
    
    const productId = meta.last_row_id;

    // Insert images
    if (b.images && Array.isArray(b.images)) {
      for (const img of b.images) {
        await db.prepare('INSERT INTO product_images (product_id, url, is_primary) VALUES (?, ?, ?)')
          .bind(productId, img.url, img.is_primary ? 1 : 0).run();
      }
    }

    // Insert shades
    if (b.shades_list && Array.isArray(b.shades_list)) {
      for (const shade of b.shades_list) {
        await db.prepare('INSERT INTO product_shades (product_id, name, color_code) VALUES (?, ?, ?)')
          .bind(productId, shade.name, shade.color_code).run();
      }
    }

    return NextResponse.json({ success: true, message: 'Product added!', id: productId });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const b = await request.json();
    const db = getDB(request);
    if (!db) return NextResponse.json({ success: false, error: 'Database not connected' }, { status: 503 });

    // Update product
    await db.prepare('UPDATE products SET name=?,category=?,price=?,original_price=?,description=?,image_url=?,stock=?,badge=? WHERE id=?')
      .bind(b.name, b.category, Number(b.price), b.original_price?Number(b.original_price):null, b.description, b.image_url, Number(b.stock), b.badge||null, b.id).run();

    // Update images (simple approach: delete and re-insert)
    if (b.images && Array.isArray(b.images)) {
      await db.prepare('DELETE FROM product_images WHERE product_id=?').bind(b.id).run();
      for (const img of b.images) {
        await db.prepare('INSERT INTO product_images (product_id, url, is_primary) VALUES (?, ?, ?)')
          .bind(b.id, img.url, img.is_primary ? 1 : 0).run();
      }
    }

    // Update shades
    if (b.shades_list && Array.isArray(b.shades_list)) {
      await db.prepare('DELETE FROM product_shades WHERE product_id=?').bind(b.id).run();
      for (const shade of b.shades_list) {
        await db.prepare('INSERT INTO product_shades (product_id, name, color_code) VALUES (?, ?, ?)')
          .bind(b.id, shade.name, shade.color_code).run();
      }
    }

    return NextResponse.json({ success: true, message: 'Product updated!' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    const db = getDB(request);
    if (!db) return NextResponse.json({ success: false, error: 'Database not connected' }, { status: 503 });
    await db.prepare('DELETE FROM products WHERE id=?').bind(id).run();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

function getMock() {
  return [
    { id:1, name:'Red Velvet Lipstick', category:'Lipsticks', price:89, original_price:null, description:'Luxurious long-lasting matte formula', image_url:'https://images.unsplash.com/photo-1586899028174-e7098604235b?w=500&q=80', stock:45, shades:'Red,Nude,Pink,Berry,Coral', badge:'Bestseller' },
    { id:2, name:'HD Foundation', category:'Foundation', price:129, original_price:null, description:'Full coverage buildable finish', image_url:'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=500&q=80', stock:32, shades:null, badge:'New' },
    { id:3, name:'Smoky Eye Palette', category:'Eyes', price:165, original_price:199, description:'12 stunning eyeshadow shades', image_url:'https://images.unsplash.com/photo-1512207728631-58b52b42e6f4?w=500&q=80', stock:18, shades:null, badge:'Sale' },
    { id:4, name:'Glow Highlighter', category:'Face', price:110, original_price:null, description:'Luminous golden shimmer', image_url:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80', stock:28, shades:'Gold,Rose Gold,Champagne', badge:'Featured' },
  ];
}
