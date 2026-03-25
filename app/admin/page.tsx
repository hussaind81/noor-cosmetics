'use client';
import { useState, useEffect, useRef } from 'react';

const ADMIN_PASSWORD = 'noor2025admin';

type Product = {
  id: number; name: string; price: number; original_price?: number; category: string;
  description: string; image_url: string; stock: number; badge?: string;
  images?: { id?: number, url: string, is_primary: number }[];
  shades_list?: { id?: number, name: string, color_code: string }[];
};

const EMPTY = { 
  name:'', price:'', original_price:'', category:'Lipsticks', description:'', 
  stock:'', image_url:'', badge:'', 
  images: [] as { url: string, is_primary: number }[],
  shades_list: [] as { name: string, color_code: string }[]
};
const CATS = ['Lipsticks','Foundation','Eyes','Face','Skincare','Nails','Perfume','General'];
const BADGES = ['', 'Bestseller', 'New', 'Sale', 'Featured'];
const COMMON_SHADES = ['Red','Nude','Pink','Berry','Coral','Plum','Mauve','Rose','Burgundy','Brown','Gold','Silver','Rose Gold','Champagne','Bronze','Natural','Dark','Light','Medium'];
const SHADE_COLORS: Record<string, string> = {
  'Red': '#dc2626', 'Nude': '#d4a574', 'Pink': '#f472b6', 'Berry': '#7c3aed',
  'Coral': '#f97316', 'Plum': '#6b21a8', 'Mauve': '#c084fc', 'Rose': '#fb7185',
  'Burgundy': '#9f1239', 'Brown': '#92400e', 'Gold': '#d4af37', 'Silver': '#9ca3af',
  'Rose Gold': '#e8a598', 'Champagne': '#f5e6c8', 'Bronze': '#b87333',
  'Natural': '#e8d5b7', 'Dark': '#1f2937', 'Light': '#fef9f0', 'Medium': '#c4975a',
};

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<number|null>(null);
  const [toast, setToast] = useState({ text:'', type:'' });
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const session = localStorage.getItem('noor_admin');
    if (session) {
      try {
        const decoded = atob(session);
        if (decoded.startsWith(ADMIN_PASSWORD)) setAuth(true);
        else window.location.href = '/admin/login';
      } catch { window.location.href = '/admin/login'; }
    } else { window.location.href = '/admin/login'; }
  }, []);

  useEffect(() => { if (auth) loadProducts(); }, [auth]);

  const loadProducts = () => {
    setLoading(true);
    fetch('/api/products').then(r => r.json())
      .then(d => { if (d?.products) setProducts(d.products); })
      .catch(() => notify('Failed to load', 'error'))
      .finally(() => setLoading(false));
  };

  const notify = (text: string, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast({ text:'', type:'' }), 3500);
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setPreview(url);
      setForm(f => ({ ...f, image_url: url }));
      notify('Image loaded!', 'info');
    };
    reader.readAsDataURL(file);
  };

  const addImage = () => {
    setForm(f => ({ ...f, images: [...(f.images || []), { url: '', is_primary: 0 }] }));
  };

  const removeImage = (index: number) => {
    setForm(f => ({ ...f, images: (f.images || []).filter((_, i) => i !== index) }));
  };

  const updateImage = (index: number, url: string) => {
    const updated = [...(form.images || [])];
    updated[index].url = url;
    setForm(f => ({ ...f, images: updated }));
  };

  const addShade = () => {
    setForm(f => ({ ...f, shades_list: [...(f.shades_list || []), { name: '', color_code: '#e11d48' }] }));
  };

  const removeShade = (index: number) => {
    setForm(f => ({ ...f, shades_list: (f.shades_list || []).filter((_, i) => i !== index) }));
  };

  const updateShade = (index: number, key: 'name' | 'color_code', value: string) => {
    const updated = [...(form.shades_list || [])];
    updated[index] = { ...updated[index], [key]: value };
    setForm(f => ({ ...f, shades_list: updated }));
  };

  const toggleShade = (shade: string) => {
    const current = form.shades_list || [];
    const exists = current.find(s => s.name === shade);
    if (exists) {
      setForm(f => ({ ...f, shades_list: current.filter(s => s.name !== shade) }));
    } else {
      setForm(f => ({ ...f, shades_list: [...current, { name: shade, color_code: SHADE_COLORS[shade] || '#e11d48' }] }));
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price) return notify('Name and price required!', 'error');
    try {
      const method = editing !== null ? 'PUT' : 'POST';
      const body = editing !== null ? { id: editing, ...form, price: +form.price, original_price: form.original_price ? +form.original_price : null, stock: +form.stock } : { ...form, price: +form.price, original_price: form.original_price ? +form.original_price : null, stock: +form.stock };
      const res = await fetch('/api/products', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) { notify(editing !== null ? '✅ Updated!' : '✅ Added!'); loadProducts(); setEditing(null); setForm(EMPTY); setPreview(''); }
      else notify(data.error || 'Failed', 'error');
    } catch { notify('Network error', 'error'); }
  };

  const handleEdit = (p: Product) => {
    setForm({ 
      name:p.name, price:String(p.price), 
      original_price:p.original_price?String(p.original_price):'', 
      category:p.category, description:p.description, stock:String(p.stock), 
      image_url:p.image_url||'', badge:p.badge||'',
      images: p.images || [],
      shades_list: p.shades_list || []
    });
    setPreview(p.image_url||'');
    setEditing(p.id);
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) { notify('🗑️ Deleted'); loadProducts(); }
    else notify('Delete failed', 'error');
  };

  const displayProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (!auth) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>Checking...</div>;

  return (
    <div className="admin-wrap">
      {toast.text && <div className={`toast toast-${toast.type||'success'}`}>{toast.text}</div>}

      <div className="admin-header">
        <div>
          <h1 style={{fontSize:'1.5rem',fontWeight:700}}>🌸 Noor Admin</h1>
          <p style={{fontSize:'0.85rem',opacity:0.7}}>Product catalog management</p>
        </div>
        <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
          <a href="/products" className="btn btn-sm" style={{background:'rgba(255,255,255,0.15)',color:'white',border:'1px solid rgba(255,255,255,0.3)'}}>View Store →</a>
          <button className="btn btn-sm btn-danger" onClick={() => { localStorage.removeItem('noor_admin'); window.location.href='/admin/login'; }}>Logout</button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value">{products.length}</div><div className="stat-label">Total Products</div></div>
        <div className="stat-card"><div className="stat-value">{products.reduce((a,p)=>a+p.stock,0)}</div><div className="stat-label">Total Stock</div></div>
        <div className="stat-card"><div className="stat-value">AED {products.length ? Math.round(products.reduce((a,p)=>a+p.price,0)/products.length) : 0}</div><div className="stat-label">Avg Price</div></div>
        <div className="stat-card"><div className="stat-value">{new Set(products.map(p=>p.category)).size}</div><div className="stat-label">Categories</div></div>
      </div>

      {/* FORM */}
      <div className="form-card">
        <h2>{editing !== null ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Product Name *</label>
            <input placeholder="e.g. Rose Petal Lipstick" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
          </div>
          <div className="form-group">
            <label>Price (AED) *</label>
            <input type="number" placeholder="0.00" value={form.price} onChange={e => setForm({...form,price:e.target.value})} />
          </div>
          <div className="form-group">
            <label>Original Price (AED) — for sale</label>
            <input type="number" placeholder="Leave empty if no sale" value={form.original_price} onChange={e => setForm({...form,original_price:e.target.value})} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => setForm({...form,category:e.target.value})}>
              {CATS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" placeholder="0" value={form.stock} onChange={e => setForm({...form,stock:e.target.value})} />
          </div>
          <div className="form-group">
            <label>Badge</label>
            <select value={form.badge} onChange={e => setForm({...form,badge:e.target.value})}>
              {BADGES.map(b=><option key={b} value={b}>{b || '— None —'}</option>)}
            </select>
          </div>

          {/* MULTIPLE IMAGES */}
          <div className="form-group form-full">
            <label style={{display:'flex',justifyContent:'space-between'}}>
              Product Images <span>Add high-quality photos</span>
            </label>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))',gap:'1rem',marginBottom:'1rem'}}>
              {/* Primary Image */}
              <div className="img-manage-card primary">
                <div className="img-preview-sm">
                  {form.image_url ? <img src={form.image_url} alt="primary" /> : <span>Main Image</span>}
                </div>
                <input placeholder="Primary URL" value={form.image_url} onChange={e => {setForm({...form, image_url:e.target.value}); setPreview(e.target.value);}} />
                <div className="img-badge">Primary</div>
              </div>
              
              {/* Additional Images */}
              {form.images?.map((img, i) => (
                <div key={i} className="img-manage-card">
                  <div className="img-preview-sm">
                    {img.url ? <img src={img.url} alt={`extra-${i}`} /> : <span>Extra Image</span>}
                  </div>
                  <input placeholder="Image URL" value={img.url} onChange={e => updateImage(i, e.target.value)} />
                  <button type="button" className="btn-remove-img" onClick={() => removeImage(i)}>×</button>
                </div>
              ))}
              
              <button type="button" className="btn-add-img" onClick={addImage}>
                <span>+</span>
                Add More
              </button>
            </div>
          </div>

          {/* CUSTOM SHADES */}
          <div className="form-group form-full">
            <label>Product Shades & Colors</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',marginBottom:'1rem'}}>
              {COMMON_SHADES.map(s => {
                const selected = form.shades_list?.find(sl => sl.name === s);
                return (
                  <button key={s} type="button" onClick={() => toggleShade(s)}
                    style={{display:'flex',alignItems:'center',gap:'0.3rem',padding:'0.3rem 0.7rem',borderRadius:'50px',border:`2px solid ${selected?'var(--rose)':'#e5e7eb'}`,background:selected?'var(--rose-light)':'white',cursor:'pointer',fontSize:'0.78rem',fontWeight:selected?700:400,color:selected?'var(--rose)':'var(--dark)'}}>
                    <span style={{width:12,height:12,borderRadius:'50%',background:SHADE_COLORS[s]||'#e11d48',display:'inline-block',border:'1px solid rgba(0,0,0,0.1)'}}></span>
                    {s}
                  </button>
                );
              })}
            </div>
            
            <div className="shades-manage-list">
              {form.shades_list?.map((shade, i) => (
                <div key={i} className="shade-row">
                  <input placeholder="Shade Name (e.g. Ruby Red)" value={shade.name} onChange={e => updateShade(i, 'name', e.target.value)} />
                  <div className="color-picker-wrap">
                    <input type="color" value={shade.color_code} onChange={e => updateShade(i, 'color_code', e.target.value)} />
                    <span className="color-code">{shade.color_code}</span>
                  </div>
                  <button type="button" className="btn-remove-shade" onClick={() => removeShade(i)}>×</button>
                </div>
              ))}
              <button type="button" className="btn btn-outline btn-sm" onClick={addShade} style={{marginTop:'0.5rem'}}>
                + Add Custom Shade
              </button>
            </div>
          </div>

          <div className="form-group form-full">
            <label>Description</label>
            <textarea placeholder="Product description..." value={form.description} onChange={e => setForm({...form,description:e.target.value})} />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {editing !== null ? '💾 Save Changes' : '➕ Add Product'}
          </button>
          {editing !== null && (
            <button className="btn btn-outline" onClick={()=>{setForm(EMPTY);setPreview('');setEditing(null);}}>Cancel</button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <div className="table-header">
          <h2 style={{fontSize:'1.1rem'}}>Products ({products.length})</h2>
          <div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
            <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{padding:'0.4rem 0.9rem',border:'2px solid #e5e7eb',borderRadius:'50px',fontSize:'0.82rem',outline:'none',fontFamily:'inherit'}} />
            <button className="btn btn-sm btn-outline" onClick={loadProducts}>🔄 Refresh</button>
          </div>
        </div>
        <div style={{overflowX:'auto'}}>
          {loading ? <p style={{padding:'1rem'}}>Loading...</p> : (
          <table>
            <thead>
              <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Shades</th><th>Badge</th><th>Stock</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {displayProducts.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{width:50,height:50,borderRadius:8,overflow:'hidden',background:'#fff1f2',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
                      {p.image_url ? <img src={p.image_url} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{(e.target as HTMLImageElement).style.display='none'}} /> : <span>💄</span>}
                    </div>
                  </td>
                  <td>
                    <div style={{fontWeight:600}}>{p.name}</div>
                    <div style={{fontSize:'0.75rem',color:'#9ca3af'}}>{(p.description||'').slice(0,35)}...</div>
                  </td>
                  <td><span className="badge badge-rose">{p.category}</span></td>
                  <td>
                    <div style={{fontWeight:700,color:'#e11d48'}}>AED {Number(p.price).toFixed(0)}</div>
                    {p.original_price && <div style={{fontSize:'0.75rem',color:'#9ca3af',textDecoration:'line-through'}}>AED {Number(p.original_price).toFixed(0)}</div>}
                  </td>
                  <td>
                    {p.shades_list && p.shades_list.length > 0 ? (
                      <div style={{display:'flex',gap:3,flexWrap:'wrap',maxWidth:80}}>
                        {p.shades_list.slice(0,4).map(s=>(
                          <div key={s.id || s.name} title={s.name} style={{width:14,height:14,borderRadius:'50%',background:s.color_code||'#e11d48',border:'1px solid rgba(0,0,0,0.1)'}}></div>
                        ))}
                        {p.shades_list.length > 4 && <span style={{fontSize:'0.7rem',color:'#9ca3af'}}>+{p.shades_list.length-4}</span>}
                      </div>
                    ) : <span style={{color:'#d1d5db',fontSize:'0.8rem'}}>—</span>}
                  </td>
                  <td>
                    {p.badge ? <span className="badge" style={{background:'#fef3c7',color:'#92400e'}}>{p.badge}</span> : <span style={{color:'#d1d5db',fontSize:'0.8rem'}}>—</span>}
                  </td>
                  <td style={{color:p.stock>0?'#16a34a':'#dc2626',fontWeight:600}}>{p.stock}</td>
                  <td>
                    <button className="btn btn-sm btn-edit" onClick={()=>handleEdit(p)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
}
