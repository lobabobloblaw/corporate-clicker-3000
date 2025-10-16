# Deploy Corporate Clicker to DigitalOcean

This guide walks through deploying the Corporate Clicker 3000 Discord Activity to your existing DigitalOcean droplet at `143.110.202.161`.

## Overview

We'll:
1. Build the activity as static files
2. Deploy to your droplet using rsync
3. Serve with nginx alongside your Discord bot
4. Set up HTTPS (required for Discord Activities)
5. Configure Discord Developer Portal

---

## Prerequisites

- Your droplet is already running at `143.110.202.161`
- You have root SSH access
- Domain name (recommended) or you can use the IP temporarily

---

## Step 1: Build the Activity Locally

From your local `discord_webapi` directory:

```bash
# Install dependencies (if not already done)
npm install

# Build for production
npm run build
```

This creates a `dist/` folder with all your static files.

**What gets built:**
- Optimized JavaScript bundles
- HTML entry point
- CSS files
- No server-side code needed (Discord SDK handles auth)

---

## Step 2: Set Up nginx on Droplet

SSH into your droplet:

```bash
ssh root@143.110.202.161
```

### Install nginx (if not already installed):

```bash
apt update
apt install -y nginx
```

### Create directory for the activity:

```bash
mkdir -p /var/www/clicker
chown -R www-data:www-data /var/www/clicker
```

### Create nginx config:

```bash
cat > /etc/nginx/sites-available/clicker <<'EOF'
server {
    listen 80;
    server_name 143.110.202.161;  # Change to your domain if you have one

    root /var/www/clicker;
    index index.html;

    # Corporate Clicker Activity
    location / {
        try_files $uri $uri/ /index.html;

        # CORS headers for Discord
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
```

### Enable the site:

```bash
ln -sf /etc/nginx/sites-available/clicker /etc/nginx/sites-enabled/
nginx -t  # Test config
systemctl reload nginx
```

---

## Step 3: Deploy from Local Machine

Create a Makefile in your local `discord_webapi` directory for easy deployment:

```bash
cat > Makefile <<'EOF'
REMOTE = root@143.110.202.161
REMOTE_DIR = /var/www/clicker

.PHONY: build deploy deploy-remote

build:
	npm run build

deploy-remote: build
	@echo "Deploying to $(REMOTE)..."
	rsync -avz --delete \
		--exclude='node_modules' \
		--exclude='.git' \
		--exclude='.env*' \
		dist/ $(REMOTE):$(REMOTE_DIR)/
	@echo "✅ Deployed successfully!"
	@echo "🌐 Activity available at: http://143.110.202.161"

deploy: deploy-remote
EOF
```

### Deploy:

```bash
make deploy
```

This will:
1. Build your app (`npm run build`)
2. Rsync the `dist/` folder to `/var/www/clicker/`
3. Your activity is now live!

---

## Step 4: Set Up HTTPS (Required for Discord)

Discord Activities **require HTTPS**. You have two options:

### Option A: Use Certbot (Free SSL - Recommended if you have a domain)

If you have a domain pointed at your droplet:

```bash
# On the droplet
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

Update your nginx config to use your domain instead of the IP.

### Option B: Use Cloudflare Tunnel (No domain needed)

```bash
# On your LOCAL machine
npx cloudflared tunnel --url http://143.110.202.161
```

This gives you an HTTPS URL like `https://random-name.trycloudflare.com` that tunnels to your droplet.

**Note:** Cloudflare Tunnel URLs change each time you restart the tunnel. For production, use Option A with a real domain.

---

## Step 5: Update Discord Developer Portal

Now configure Discord to use your deployed activity:

### 5.1: Update OAuth2 Redirects

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your "Corporate Clicker 3000" application
3. Go to **OAuth2** page
4. Under **Redirects**, click **Add Redirect**
5. Add your production URL:
   - If using domain with SSL: `https://your-domain.com`
   - If using Cloudflare tunnel: `https://your-tunnel.trycloudflare.com`
   - **Remove or keep** `http://localhost:5173` for local testing
6. Click **Save Changes**

### 5.2: Configure Activity URL Mapping

1. Still in Discord Developer Portal, click **Activities** in left sidebar
2. Under **URL Mappings**:
   - Click **Add URL Mapping** (or edit existing)
   - **Target**: `/`
   - **Source**: Your production URL (e.g., `https://your-domain.com`)
3. Click **Save**

### 5.3: Update Environment Variables (Production)

Your droplet doesn't need `.env` file since the activity is entirely client-side, but if you want to document production URLs:

```bash
# On droplet (optional, for documentation)
cat > /var/www/clicker/.env.production <<EOF
# Production Configuration
VITE_DISCORD_CLIENT_ID=1428205319435190293
# Client secret is NOT needed - activity is client-side only
# Production URL: https://your-domain.com
EOF
```

**Important:** The client ID is public and safe to be in the built JavaScript. The client secret is NOT used for this simplified activity.

---

## Step 6: Test Your Deployed Activity

### Test in Discord:

1. Open Discord (desktop or web)
2. Join any voice channel
3. Click the **Activities** button (rocket icon)
4. Your "Corporate Clicker 3000" should appear
5. Click it to launch
6. You should see:
   - The game loads
   - Your real Discord username appears as CEO
   - All game mechanics work

### Verify Deployment:

```bash
# Check nginx is serving files
curl -I http://143.110.202.161

# Check if files deployed correctly
ssh root@143.110.202.161 'ls -lh /var/www/clicker/'
```

---

## Step 7: Make Updates

When you make changes to the game:

```bash
# Local development
npm run dev  # Test locally at http://localhost:5173

# Deploy changes
make deploy  # Builds and deploys to production
```

---

## Deployment Checklist

- [ ] Built production files: `npm run build`
- [ ] nginx installed and configured on droplet
- [ ] Deployed files to `/var/www/clicker/`
- [ ] HTTPS set up (Certbot or Cloudflare Tunnel)
- [ ] Discord OAuth2 redirects updated with production URL
- [ ] Discord Activity URL mapping configured
- [ ] Tested in actual Discord voice channel
- [ ] Game loads and username displays correctly

---

## Troubleshooting

### Activity won't load in Discord:
- Verify URL mapping in Discord Developer Portal
- Check nginx is running: `systemctl status nginx`
- Check nginx logs: `tail -f /var/log/nginx/error.log`
- Ensure HTTPS is working (Discord requires it)

### "Mixed content" errors:
- Discord requires HTTPS
- Make sure your Activity URL starts with `https://`
- If using IP, use Cloudflare Tunnel for HTTPS

### Username not showing:
- This means Discord authentication is working but no user data
- Check browser console for errors
- The activity should work - username displays after sign-in

### nginx 404 errors:
- Check files exist: `ls /var/www/clicker/`
- Verify nginx config: `nginx -t`
- Check file permissions: `ls -la /var/www/clicker/`

---

## Directory Structure on Droplet

```
/var/www/clicker/
├── index.html          # Entry point
├── assets/
│   ├── index-[hash].js # Compiled JavaScript
│   └── index-[hash].css # Compiled CSS
└── .env.production     # Optional documentation
```

---

## Monitoring

Check your activity is running:

```bash
# On droplet
systemctl status nginx
curl -I http://143.110.202.161

# View logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## Advanced: Multiple Activities

You can host multiple Discord Activities on the same droplet:

```nginx
# /etc/nginx/sites-available/activities

# Corporate Clicker
server {
    listen 80;
    server_name clicker.your-domain.com;
    root /var/www/clicker;
    # ... rest of config
}

# Another Activity
server {
    listen 80;
    server_name game2.your-domain.com;
    root /var/www/game2;
    # ... rest of config
}
```

Each activity gets its own:
- Subdomain
- Discord Application
- nginx server block

---

## Cost Considerations

- **Droplet**: Already running for your Discord bot
- **Additional cost**: $0 (using existing infrastructure)
- **SSL Certificate**: Free with Let's Encrypt
- **Domain**: Optional (~$10-15/year if you want a custom domain)

The activity is static files, so it uses minimal resources alongside your bot.

---

## Security Notes

- Client ID is public (safe to expose)
- Client Secret is NOT used in this simplified activity
- All authentication happens via Discord SDK
- Activity runs entirely in the browser (no server-side secrets)
- nginx serves static files only (no server-side code)

---

## Next Steps

After deployment:
1. Share the activity with your Discord server
2. Monitor for any issues
3. Update the game as needed with `make deploy`
4. Consider adding analytics or error tracking
5. Test on mobile Discord clients (iOS & Android)

---

## Related Documentation

- `DISCORD_SETUP.md` - Discord Developer Portal configuration
- `README.md` - Local development guide
- `CLAUDE.md` - Development patterns and architecture
