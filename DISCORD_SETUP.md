# Discord Developer Portal Setup Guide

This guide walks you through configuring your Discord Activity on Discord's Developer Portal.

## Prerequisites

- A Discord account
- Developer mode enabled in Discord (User Settings → Advanced → Developer Mode)

---

## Step 1: Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"** button (top right)
3. Enter a name for your activity (e.g., "Corporate Clicker 3000")
4. Accept the Terms of Service
5. Click **"Create"**

---

## Step 2: Get Your Credentials

### Client ID (Public)
1. On the **General Information** page, find **Application ID**
2. Click **"Copy"** button next to it
3. Paste this into your `.env` file as `VITE_DISCORD_CLIENT_ID`

### Client Secret (Private - KEEP SECRET!)
1. Still on **General Information** page
2. Find the **Client Secret** section
3. Click **"Reset Secret"** (if this is your first time)
4. Click **"Yes, do it!"** to confirm
5. Copy the secret that appears (you can only see it once!)
6. Paste this into your `.env` file as `DISCORD_CLIENT_SECRET`

**⚠️ IMPORTANT:** Never share your client secret or commit it to git!

Your `.env` should now look like:
```env
VITE_DISCORD_CLIENT_ID=123456789012345678
DISCORD_CLIENT_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
REDIRECT_URI=http://localhost:5173
```

---

## Step 3: Configure OAuth2

1. In the left sidebar, click **"OAuth2"**
2. Scroll down to **"Redirects"** section
3. Click **"Add Redirect"**
4. Enter your redirect URI:
   - **Local development**: `http://localhost:5173`
   - **Cloudflare Tunnel** (for testing in Discord): `https://your-tunnel-url.trycloudflare.com`
   - **Production**: `https://your-domain.com`
5. Click **"Save Changes"** at the bottom

**Note:** You can have multiple redirect URIs (one for each environment).

### OAuth2 Scopes (Reference)
The scopes are configured in your code (`src/hooks/useDiscordSdk.tsx`):
- `identify` - Get user ID and username
- `guilds` - Get list of servers user is in

You don't need to configure these in the portal - they're requested by your app.

---

## Step 4: Enable Activity (Activities Tab)

This is the key step that makes your app an "Activity"!

1. In the left sidebar, click **"Activities"** (under "Rich Presence")
2. You'll see the Activities configuration page

### Activity URL Mapping
This tells Discord where to load your activity from.

#### For Local Development (no Discord client needed):
- Just visit `http://localhost:5173` in your browser
- Uses DiscordSDKMock for testing
- **Don't need to configure Activity URL yet**

#### For Testing in Discord Client (with Cloudflare Tunnel):
1. Start your dev server: `npm run dev`
2. In another terminal, start tunnel: `npx cloudflared tunnel --url http://localhost:5173`
3. Copy the HTTPS URL (e.g., `https://random-name.trycloudflare.com`)
4. In Discord Developer Portal → Activities:
   - Click **"Add URL Mapping"** or edit existing
   - **Target**: `/` (this is the path in your app)
   - **Source**: Paste your Cloudflare tunnel URL
   - Click **"Save"**

Example:
```
Target: /
Source: https://random-name.trycloudflare.com
```

5. Update your `.env` file:
```env
REDIRECT_URI=https://random-name.trycloudflare.com
```

6. Restart your dev server for the new redirect URI to take effect

#### For Production:
```
Target: /
Source: https://your-production-domain.com
```

---

## Step 5: Test Your Activity

### Option A: Browser Testing (Easiest)
1. Make sure your `.env` has local values:
   ```env
   VITE_DISCORD_CLIENT_ID=your_client_id
   DISCORD_CLIENT_SECRET=your_client_secret
   REDIRECT_URI=http://localhost:5173
   ```
2. Run `npm run dev`
3. Visit `http://localhost:5173` in your browser
4. The app will use DiscordSDKMock (fake Discord environment)
5. You can test all game functionality

### Option B: Discord Client Testing (Full testing)

#### Setup:
1. Start dev server: `npm run dev`
2. Start Cloudflare tunnel: `npx cloudflared tunnel --url http://localhost:5173`
3. Copy the tunnel URL
4. Add it to Discord Developer Portal (Activities → URL Mapping)
5. Add it to `.env` as `REDIRECT_URI`
6. Add it to OAuth2 Redirects
7. Restart dev server

#### Launch Activity:
There are several ways to launch your activity in Discord:

**Method 1: Activity Shelf (Recommended)**
1. Open Discord desktop app
2. Join any voice channel
3. Look for the **Activities** button (rocket icon) in the voice channel controls
4. Click it to open the activity launcher
5. Your activity should appear in the list
6. Click it to launch

**Method 2: Direct URL (For Testing)**
1. Generate an activity invite URL using: `npm run robo invite`
2. Or manually construct: `https://discord.com/activities/{YOUR_APPLICATION_ID}`
3. Paste this in Discord chat while in a voice channel
4. Click the link to launch

**Method 3: Developer Test URL**
In the Developer Portal → Activities page, there's a "Test in Discord" button that generates a URL for testing.

---

## Step 6: Verify Everything Works

### Checklist:
- [ ] Can you see the sign-in screen?
- [ ] Does clicking "Sign in with Discord" open OAuth popup?
- [ ] After signing in, do you see your Discord username in the game?
- [ ] Can you click the money button and see the counter increase?
- [ ] Do the upgrades work?
- [ ] Are popup ads appearing?

### Common Issues:

**"VITE_DISCORD_CLIENT_ID is not defined"**
- Make sure `.env` file exists in project root
- Restart dev server after changing `.env`

**OAuth2 Redirect Error**
- Redirect URI in `.env` must EXACTLY match what's in Developer Portal
- Include protocol (http:// or https://)
- No trailing slashes
- Case sensitive!

**Activity doesn't appear in Discord**
- Make sure you're in a voice channel
- Activity URL mapping must be configured
- Cloudflare tunnel must be running
- URL must be HTTPS (except localhost)

**"This activity is not available"**
- Check that your dev server is running
- Verify Cloudflare tunnel is still active
- Tunnel URLs change each time - update the mapping

**CSP errors in browser console**
- External resources are blocked by Discord
- All assets must be bundled locally or use Discord CDN
- Use `/.proxy/` prefix for external APIs

---

## Step 7: Inviting Others (During Development)

### Unverified App Limitations
By default, unverified apps can only be used in servers with **less than 25 members**.

To test with others:
1. Create a small test server (or use existing small server)
2. Make sure it has less than 25 members
3. Join a voice channel in that server
4. Launch your activity
5. Share the session with others in the voice channel

### Server Requirements for Testing:
- Must have less than 25 members
- You must have permission to use voice channels
- Others must join the same voice channel

---

## Step 8: Going to Production

When you're ready to deploy:

### 1. Update Environment Variables
```env
VITE_DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
REDIRECT_URI=https://your-production-domain.com
NODE_ENV=production
```

### 2. Update Discord Developer Portal

**OAuth2 Redirects:**
- Add: `https://your-production-domain.com`

**Activity URL Mapping:**
```
Target: /
Source: https://your-production-domain.com
```

### 3. Build and Deploy
```bash
npm run build
npm run deploy  # or deploy to your hosting platform
```

### 4. Request Verification (Optional)
If you want to use your activity in servers with 25+ members:
1. Go to Developer Portal → Your App
2. Fill out all required information (description, privacy policy, etc.)
3. Submit for verification
4. Wait for Discord to review (can take several weeks)

---

## Understanding Activity vs Bot vs OAuth App

**Activity (What you're building):**
- Embedded web app that runs in Discord
- Lives in voice channels
- Uses Embedded App SDK
- Needs Activity URL mapping

**Bot:**
- Server-side application that responds to commands
- Uses Discord Bot API
- Needs Bot Token
- **Not what you're building here**

**OAuth App:**
- Lets users sign in with Discord
- Your activity uses OAuth for authentication
- All activities need OAuth configured

Your app is an **Activity** that uses **OAuth** for authentication. You don't need to create a bot.

---

## Quick Reference: Where Everything Is

| What | Where in Developer Portal |
|------|--------------------------|
| Client ID | General Information → Application ID |
| Client Secret | General Information → Client Secret |
| OAuth2 Redirects | OAuth2 → Redirects |
| Activity URL | Activities → URL Mappings |
| Test in Discord | Activities → "Test in Discord" button |

---

## Need Help?

- [Discord Embedded App SDK Docs](https://discord.com/developers/docs/activities/overview)
- [Discord Developer Support Server](https://discord.gg/discord-developers)
- Check `CLAUDE.md` for development patterns
- Check `README.md` for troubleshooting

---

## Example Complete Setup

Here's what a complete setup looks like:

### Developer Portal Settings:
```
Application Name: Corporate Clicker 3000
Client ID: 1234567890123456789
Client Secret: (hidden)

OAuth2 Redirects:
  - http://localhost:5173
  - https://random.trycloudflare.com
  - https://corpclicker.example.com

Activity URL Mappings:
  Target: /
  Source: https://random.trycloudflare.com
```

### Your .env file:
```env
VITE_DISCORD_CLIENT_ID=1234567890123456789
DISCORD_CLIENT_SECRET=your_secret_here
REDIRECT_URI=https://random.trycloudflare.com
```

### Testing:
1. `npm run dev` (terminal 1)
2. `npx cloudflared tunnel --url http://localhost:5173` (terminal 2)
3. Open Discord, join voice channel
4. Click Activities → Corporate Clicker 3000
5. Sign in and play!
