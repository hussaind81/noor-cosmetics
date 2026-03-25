# EXACT STEPS TO FIX YOUR WEBSITE

## Step 1: Replace these files in your project

Copy each file to the correct location:

| File in this ZIP | Goes to (in your project) |
|---|---|
| globals.css | app/globals.css |
| layout.tsx | app/layout.tsx |
| page.tsx | app/page.tsx |
| products-page.tsx | app/products/page.tsx |
| admin-page.tsx | app/admin/page.tsx |
| next.config.js | next.config.js (root) |
| package.json | package.json (root) |
| tailwind.config.js | tailwind.config.js (root) |
| postcss.config.js | postcss.config.js (root) |

**DELETE** tailwind.config.ts (the TypeScript version)

## Step 2: Run these commands

```
rmdir /s /q node_modules
del package-lock.json
npm install
npm run build
npm run dev
```

Open http://localhost:3000 — you should see full styling!

## Step 3: Push to GitHub

```
git add .
git commit -m "Fix CSS and UI for Cloudflare Pages"
git push
```

## Step 4: Cloudflare Pages Settings

Go to: dash.cloudflare.com → Pages → noor-cosmetics → Settings

Set:
- Build command: `npm run build`
- Build output: `out`

Save → wait for deployment → your site is live with full UI!

## What's included

- Homepage with hero section
- Products page with search & filter  
- Admin panel: ADD, EDIT, DELETE products
- Full CSS (no Tailwind dependency issues)
- No external dependencies that break builds
