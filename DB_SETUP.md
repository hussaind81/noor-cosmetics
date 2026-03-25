# Connecting D1 Database (Permanent Data Storage)

## Step 1: Push schema to your remote D1 database
```
wrangler d1 execute noor-cosmetics --remote --file schema.sql
```

## Step 2: Update wrangler.toml
Replace REPLACE_WITH_YOUR_DATABASE_ID with your actual ID:
database_id = "019575e2-cdaf-4d92-8982-a66962ab07a0"
(You already created this database — use the same ID from before)

## Step 3: Add D1 Binding in Cloudflare Pages
1. Go to dash.cloudflare.com
2. Pages → noor-cosmetics → Settings → Bindings
3. Click "Add binding"
4. Type: D1 Database
5. Variable name: DB
6. D1 database: select "noor-cosmetics"
7. Click Save

## Step 4: Redeploy
git add .
git commit -m "Add D1 database binding"
git push

## After this:
✅ All products saved permanently in database
✅ Add/Edit/Delete from admin panel — changes persist
✅ Products show on shop page from real database

## Image Storage Options:
- OPTION A (Free, easiest): Use image URLs from internet (Unsplash, etc.)
- OPTION B (Your own images): Upload to Cloudflare R2 or ImgBB, copy URL
- OPTION C (Quick test): Upload file in admin panel (only for testing — base64 images are large)

## Best practice for product images:
1. Go to https://www.imgbb.com (free image hosting)
2. Upload your product photo
3. Copy the "Direct link" URL
4. Paste it in the admin panel Image URL field
