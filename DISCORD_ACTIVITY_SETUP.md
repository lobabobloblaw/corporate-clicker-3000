# Discord Activity Setup Guide

## Current Configuration

**Application ID**: `1428205319435190293`
**HTTPS URL**: `https://conceptual-americans-investigation-mpeg.trycloudflare.com`
**HTTP URL**: `http://143.110.202.161` (fallback, not for Discord)

**Developer Portal**: https://discord.com/developers/applications/1428205319435190293

---

## Step-by-Step Setup in Discord Developer Portal

### Step 1: Enable Activities

1. Go to https://discord.com/developers/applications/1428205319435190293
2. In the left sidebar, click **"Activities"**
3. Click **"Settings"** (under Activities)
4. Look for **"Enable Activities"** toggle
5. **Turn it ON**
6. Click **"Save Changes"**

### Step 2: Configure URL Mappings

1. Still in the Activities section, click **"URL Mappings"**
2. You'll see a form to add a new mapping
3. Fill in the fields:
   - **Prefix**: `/` (just a forward slash - this is the root path)
   - **Target**: `https://conceptual-americans-investigation-mpeg.trycloudflare.com`
4. Click **"Add"** or **"Save"**
5. Make sure to click **"Save Changes"** at the bottom of the page

### Step 3: Optional - Add OAuth2 Redirect

1. Click **"OAuth2"** in the left menu
2. Scroll to **"Redirects"** section
3. Click **"Add Redirect"**
4. Paste: `https://conceptual-americans-investigation-mpeg.trycloudflare.com`
5. Click **"Save Changes"**

### Step 4: Optional - Add Activity Icon

1. In Activities menu, click **"Art Assets"**
2. Upload a 512x512 PNG icon for Corporate Clicker 3000
3. This makes your activity look professional in Discord

---

## Testing Your Activity

### Create a Test Server
1. Create a new Discord server (or use existing with < 25 members)
2. **Important**: Unverified activities only work in servers with **fewer than 25 members**

### Launch the Activity
1. Join a **voice channel** in your test server
2. Look for the 🚀 **Activities** button (usually near the video/screen share buttons)
3. Click it to open the Activities launcher
4. Your **Corporate Clicker 3000** should appear in the list
5. Click to launch and test!

---

## Troubleshooting

### Activity Not Showing Up
- Make sure Activities are enabled in Settings
- Verify URL Mappings are saved correctly
- Check that you're in a server with < 25 members
- Try refreshing Discord (Ctrl+R or Cmd+R)

### White Screen or Loading Forever
- Check that the tunnel URL is correct and accessible
- Verify nginx is running: `ssh root@143.110.202.161 'systemctl status nginx'`
- Check tunnel status: `ssh root@143.110.202.161 'systemctl status cloudflared-tunnel'`

### CSP or CORS Errors
- All external requests must go through URL Mappings
- Check browser console for specific errors
- Verify CORS headers are set in nginx config

---

## Checking Current Tunnel URL

Your Quick Tunnel URL may change if the server restarts. To check the current URL:

```bash
ssh root@143.110.202.161 'journalctl -u cloudflared-tunnel.service -n 100 | grep "https://.*trycloudflare.com" | tail -1'
```

If the URL changes, you'll need to update the URL Mappings in the Discord Developer Portal.

---

## Upgrading to Production

For a permanent, stable URL that doesn't change:

1. **Option A: Get a Domain**
   - Register a domain (e.g., myactivity.com)
   - Add it to Cloudflare
   - Create a named tunnel with authentication
   - Point your domain to the tunnel

2. **Option B: Use Cloudflare Pages**
   - Deploy your built files to Cloudflare Pages
   - Get a permanent `*.pages.dev` URL
   - Configure that URL in Discord

3. **Option C: Traditional Hosting**
   - Deploy to Vercel, Netlify, or similar
   - These provide permanent HTTPS URLs
   - Update Discord Developer Portal with the new URL

---

## Technical Details

### Current Infrastructure
- **Hosting**: DigitalOcean Droplet (143.110.202.161)
- **Web Server**: nginx 1.24.0
- **SSL/HTTPS**: Cloudflare Quick Tunnel
- **Auto-restart**: systemd service (survives reboots)

### Files Location
- **Deployed Files**: `/var/www/clicker/` on droplet
- **Nginx Config**: `/etc/nginx/sites-available/clicker`
- **Tunnel Service**: `/etc/systemd/system/cloudflared-tunnel.service`

### Deployment Command
From your local machine:
```bash
cd /Users/alexvoigt/Documents/GPT-5/discord_webapi
make deploy
```

This rebuilds the app and syncs to the droplet.

---

## Important Notes

⚠️ **Quick Tunnel Limitation**: The URL `https://conceptual-americans-investigation-mpeg.trycloudflare.com` is temporary and will change if the tunnel restarts. For production use, upgrade to a named tunnel or use a custom domain.

✅ **Activity is Live**: Your Corporate Clicker 3000 is already deployed and accessible via HTTPS. You just need to configure the Discord Developer Portal to make it launchable from Discord.

🎮 **Testing**: Once configured, the activity will appear in the Activities launcher in voice channels of small servers.
