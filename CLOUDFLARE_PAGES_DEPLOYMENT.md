# Cloudflare Pages Deployment Guide

**Status**: ✅ Ready to Deploy
**Date**: October 16, 2025

---

## ✅ Completed Setup

- [x] Created .gitignore file
- [x] Created public/_headers for security and CORS
- [x] Created public/_redirects for SPA routing
- [x] Initialized git repository
- [x] Created initial commit

**All files are committed and ready to push!**

---

## Step 1: Create GitHub Repository

### Option A: Via GitHub Website (Recommended)
1. Go to https://github.com/new
2. **Repository name**: `corporate-clicker-3000` (or your preferred name)
3. **Description**: "Corporate Clicker 3000 - A satirical idle clicker game for Discord Activities"
4. **Visibility**: Public or Private (your choice)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

### Option B: Via GitHub CLI (if you have it)
```bash
gh repo create corporate-clicker-3000 --public --source=. --remote=origin --push
```

---

## Step 2: Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/corporate-clicker-3000.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username.

### Verify Push
Go to your repository on GitHub and verify all files are there.

---

## Step 3: Deploy to Cloudflare Pages

### 3.1 Go to Cloudflare Dashboard
1. Log in to https://dash.cloudflare.com
2. In the left sidebar, click **"Workers & Pages"**
3. Click **"Create application"** button
4. Select **"Pages"** tab
5. Click **"Connect to Git"**

### 3.2 Connect GitHub Repository
1. Click **"GitHub"** (or GitLab if you used that)
2. If first time: **"Sign in with GitHub"** and authorize Cloudflare
3. Select **"corporate-clicker-3000"** repository
4. Click **"Begin setup"**

### 3.3 Configure Build Settings

**Project name**: (Choose one)
- `corporate-clicker-3000` (Recommended)
- `corp-clicker`
- `corporate-clicker`

This will be your URL: `https://[project-name].pages.dev`

**Production branch**: `main`

**Build settings**:
- **Framework preset**: None (or Vite if available)
- **Build command**: `npm run build`
- **Build output directory**: `dist`

**Environment variables** (click "Add variable"):
- **Name**: `NODE_VERSION`
- **Value**: `18` (or `20`)

### 3.4 Deploy
1. Click **"Save and Deploy"**
2. Wait for build to complete (usually 1-2 minutes)
3. Watch the build logs - you'll see:
   - Installing dependencies
   - Running `npm run build`
   - Deploying to Cloudflare's edge network

### 3.5 Get Your URL
Once deployment completes, you'll see:
```
✅ Success! Your site is live at:
https://corporate-clicker-3000.pages.dev
```

**Save this URL!** You'll need it for the Discord Developer Portal.

---

## Step 4: Test Your Deployment

### 4.1 Visit Your Site
Open: `https://corporate-clicker-3000.pages.dev` (replace with your actual URL)

**Expected**: You should see the Corporate Clicker 3000 game load

### 4.2 Test Legal Pages
- Privacy Policy: `https://corporate-clicker-3000.pages.dev/privacy-policy`
- Terms of Service: `https://corporate-clicker-3000.pages.dev/terms-of-service`

**Expected**: Both pages should load without authentication

### 4.3 Test in Discord (Optional)
- Go to Discord Developer Portal
- Temporarily update URL Mapping to your new Pages URL
- Launch in a small test server
- Verify game loads and works correctly

---

## Step 5: Update Discord Developer Portal

### 5.1 URL Mappings
1. Go to https://discord.com/developers/applications/1428205319435190293
2. Click **"Activities"** in left sidebar
3. Click **"URL Mappings"**
4. Update the root mapping:
   - **Prefix**: `/`
   - **Target**: `https://corporate-clicker-3000.pages.dev` (your new URL)
5. Click **"Save Changes"**

### 5.2 Custom Links
1. Still in Activities section, click **"Custom Links"**
2. Add/update:
   - **Privacy Policy**: `https://corporate-clicker-3000.pages.dev/privacy-policy`
   - **Terms of Service**: `https://corporate-clicker-3000.pages.dev/terms-of-service`
3. Click **"Save Changes"**

### 5.3 OAuth2 (if configured)
1. Click **"OAuth2"** in left sidebar
2. In **"Redirects"** section:
   - Remove old tunnel URL
   - Add: `https://corporate-clicker-3000.pages.dev`
3. Click **"Save Changes"**

---

## Step 6: Cleanup Old Infrastructure (Optional)

### Stop Cloudflare Tunnel
```bash
ssh root@143.110.202.161 'systemctl stop cloudflared-tunnel.service'
ssh root@143.110.202.161 'systemctl disable cloudflared-tunnel.service'
```

### Keep or Remove DigitalOcean Droplet
**Option A: Keep It** (Backup/Alternative)
- Useful as a fallback
- Can switch back if needed
- Costs ~$6/month

**Option B: Remove It** (Save Money)
- No longer needed with Cloudflare Pages
- Destroy droplet in DigitalOcean dashboard
- Saves $6/month

---

## Future Deployments

### Automatic Deployments
Every time you push to the `main` branch, Cloudflare Pages automatically:
1. Detects the push
2. Runs `npm run build`
3. Deploys new version
4. Updates the live site

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main

# Cloudflare Pages automatically deploys!
```

### Preview Deployments
Pull requests get automatic preview URLs:
- Create a branch: `git checkout -b new-feature`
- Push: `git push origin new-feature`
- Create PR on GitHub
- Cloudflare creates: `https://abc123.corporate-clicker-3000.pages.dev`
- Test before merging!

---

## Troubleshooting

### Build Fails
**Check**:
- Node version is set to 18 or higher
- Build command is `npm run build`
- Output directory is `dist`
- Check build logs for specific errors

### Site Shows 404
**Check**:
- `public/_redirects` file exists
- Build output contains `index.html` in `dist/` folder
- Wait 1-2 minutes for DNS propagation

### Discord Can't Load Activity
**Check**:
- URL Mappings are updated in Discord portal
- CORS headers are set (in `public/_headers`)
- Site is accessible publicly
- Try in incognito/private browser

### Legal Pages Not Found
**Check**:
- SPA routing is configured (` _redirects` file)
- Routes are defined in `src/app/App.tsx`
- Clear browser cache

---

## Cloudflare Pages Dashboard

### Access Your Project
1. Go to https://dash.cloudflare.com
2. Click **"Workers & Pages"**
3. Click your project name
4. You'll see:
   - **Latest deployment** status
   - **Deployment history**
   - **Build logs**
   - **Settings**
   - **Custom domains** (if you want to add your own domain later)

### View Build Logs
- Click any deployment
- Click **"View build log"**
- See full npm install and build output

### Analytics (Optional)
- Enable Web Analytics in settings
- See visitors, pageviews, performance metrics
- All privacy-friendly, no cookies needed

---

## Benefits Over Quick Tunnel

| Feature | Quick Tunnel | Cloudflare Pages |
|---------|-------------|------------------|
| **URL Stability** | Changes on restart | Permanent |
| **Professional Look** | Random words | Your choice |
| **Auto-Deploy** | Manual | Git push = deploy |
| **Preview URLs** | No | Yes (PRs) |
| **Analytics** | No | Optional built-in |
| **Custom Domain** | No | Yes (add later) |
| **Cost** | Free | Free |
| **Speed** | Good | Excellent (CDN) |
| **Reliability** | Depends on droplet | 99.99% uptime |

---

## Next Steps After Deployment

1. **Test thoroughly**:
   - Mobile (iOS/Android)
   - Desktop (Chrome/Firefox)
   - Discord app on all platforms

2. **Update legal pages** (before verification):
   - Change email contacts from `.example` to real emails
   - Rebuild and push to GitHub (auto-deploys)

3. **Create app icon**:
   - Design 512x512 PNG icon
   - Upload to Discord Developer Portal

4. **Submit for verification**:
   - Complete identity verification via Stripe
   - Submit in Developer Portal
   - Wait 24-72 hours for approval

5. **Enable Discovery** (after verification):
   - Activity appears in Discord App Directory
   - Users can discover and play without invite

---

## Support & Resources

**Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
**GitHub Docs**: https://docs.github.com/
**Discord Developer Portal**: https://discord.com/developers/applications/1428205319435190293

**Your URLs** (update with actual values):
- **Production**: https://corporate-clicker-3000.pages.dev
- **GitHub Repo**: https://github.com/YOUR_USERNAME/corporate-clicker-3000
- **Cloudflare Dashboard**: https://dash.cloudflare.com

---

## Quick Command Reference

```bash
# View git status
git status

# See commit history
git log --oneline

# Make changes and deploy
git add .
git commit -m "Your change description"
git push origin main

# Check remote
git remote -v

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main
```

---

**Status**: Ready to push to GitHub and deploy! 🚀

Follow steps 1-5 above to complete the deployment.
