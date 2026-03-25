# 🚀 PRODUCTION DEPLOYMENT GUIDE

## Deploy in 10 Minutes to Cloudflare Pages + D1

### Step 1: Setup Cloudflare (5 minutes)

```bash
# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create noor-cosmetics

# Copy the database_id from output
# Update it in wrangler.toml: database_id = "YOUR_ID_HERE"

# Initialize database with schema
wrangler d1 execute noor-cosmetics --file schema.sql
```

### Step 2: Prepare Repository (2 minutes)

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit: Production-ready Noor Cosmetics"

# Create GitHub repository
# 1. Go to https://github.com/new
# 2. Create repo: noor-cosmetics
# 3. Copy push commands

git remote add origin https://github.com/YOUR_USERNAME/noor-cosmetics.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Cloudflare Pages (3 minutes)

1. Go to: https://dash.cloudflare.com/
2. Select "Pages"
3. Click "Create a project" → "Connect to Git"
4. Authorize GitHub and select `noor-cosmetics`
5. Build settings:
   - Framework: Next.js
   - Build command: `npm run build`
   - Build output directory: `.next`
6. Environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://yourdomain.com
   ```
7. Click "Save and Deploy"

**Done!** Your website is now LIVE! 🎉

### Step 4: Connect Custom Domain (Optional)

1. In Cloudflare Pages → Your Project
2. Settings → Custom domain
3. Enter your domain (e.g., noor-cosmetics.com)
4. Update nameservers at your registrar to Cloudflare
5. Wait 24-48 hours for DNS propagation

---

## Production Checklist

- [ ] Database created and initialized
- [ ] Schema uploaded to D1
- [ ] Repository pushed to GitHub
- [ ] Deployed to Cloudflare Pages
- [ ] Website accessible at cloudflare.page URL
- [ ] Custom domain connected (optional)
- [ ] SSL certificate active (automatic)
- [ ] Admin dashboard working

---

## Local Development

```bash
# Install dependencies
npm install

# Create .env.local (copy from .env.example)
cp .env.example .env.local

# Update .env.local with your values:
# - CF_ACCOUNT_ID
# - CF_API_TOKEN
# - CF_DATABASE_ID

# Run locally
npm run dev

# Visit http://localhost:3000
```

---

## Updating After Deploy

```bash
# Make changes locally
# Test with: npm run dev

# Commit and push
git add .
git commit -m "Update: Description of changes"
git push

# Cloudflare Pages auto-deploys!
# Check deployment status: https://dash.cloudflare.com/
```

---

## Troubleshooting

**Database not found:**
- Check wrangler.toml has correct database_id
- Run: `wrangler d1 list`

**Build fails:**
- Run locally: `npm run build`
- Check error message
- Fix issues

**Deploy stuck:**
- Check GitHub Actions in repository
- Check Cloudflare Pages deployment logs
- Redeploy from Cloudflare dashboard

---

## What's Included

✅ Production-ready Next.js app
✅ Cloudflare D1 database schema
✅ Sample products and categories
✅ Admin dashboard
✅ Product catalog with search
✅ API endpoints
✅ Responsive design
✅ Tailwind CSS styling

---

## Next Steps After Deploy

1. **Add your products** via database or API
2. **Customize styling** for your brand
3. **Set up admin authentication** (NextAuth ready)
4. **Enable image uploads** (R2 bucket)
5. **Monitor analytics** (Cloudflare)
6. **Optimize performance** (built-in)

---

**Your website is LIVE!** 🚀

Questions? Check README.md or CLOUDFLARE.md
