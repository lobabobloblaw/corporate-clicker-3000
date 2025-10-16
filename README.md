# Discord Activity - Production-Ready Foundation

A complete Discord Activity starter built with Robo.js, React 18, TypeScript, and Tailwind CSS. Includes OAuth2 authentication, mobile optimization, and CSP compliance out of the box.

## Features

- **Discord SDK Integration** - Full integration with @discord/embedded-app-sdk
- **Secure OAuth2 Flow** - Server-side token exchange with CSRF protection
- **Mobile Optimized** - Touch-friendly UI with 44px minimum touch targets
- **CSP Compliant** - All external requests properly proxied via @robojs/patch
- **TypeScript** - Full type safety with strict mode enabled
- **Tailwind CSS** - Discord brand colors and utility-first styling
- **Production Ready** - Best practices for security, performance, and scalability

## Prerequisites

- Node.js 18+
- A Discord application ([create one here](https://discord.com/developers/applications))
- Discord Developer account

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select existing one
3. Navigate to "OAuth2" section
4. Add redirect URI: `http://localhost:5173` (for local development)
5. Copy your Client ID and Client Secret

### 3. Set Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your Discord credentials:

```env
VITE_DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=http://localhost:5173
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Testing in Discord

To test your Activity in the actual Discord client, you need HTTPS. Use Cloudflare Tunnel:

### 1. Install Cloudflare Tunnel

```bash
npm install -g cloudflared
```

### 2. Create Tunnel

```bash
cloudflared tunnel --url http://localhost:5173
```

This will give you an HTTPS URL like `https://random-name.trycloudflare.com`

### 3. Update Discord App

1. Go to Discord Developer Portal
2. Add the Cloudflare tunnel URL to your OAuth2 redirect URIs
3. Update `.env` with: `REDIRECT_URI=https://your-tunnel.trycloudflare.com`

### 4. Configure Activity URL Mapping

1. In Discord Developer Portal, go to "Activities" section
2. Set your Activity URL to the Cloudflare tunnel URL
3. Save changes

## Project Structure

```
discord-activity/
├── src/
│   ├── app/              # Frontend React application
│   │   ├── App.tsx       # Main app component
│   │   ├── main.tsx      # React entry point
│   │   └── index.css     # Global styles + Tailwind
│   ├── api/              # Backend API endpoints (Robo.js)
│   │   ├── token.ts      # OAuth2 token exchange
│   │   └── user.ts       # User information endpoint
│   ├── hooks/            # Custom React hooks
│   │   ├── useDiscordSdk.tsx        # Discord SDK context
│   │   └── useDeviceCapabilities.ts # Device detection
│   ├── components/       # Reusable React components
│   └── types/            # TypeScript type definitions
│       └── discord.ts    # Discord-related types
├── public/               # Static assets
├── .env                  # Environment variables (git-ignored)
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md            # This file
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run deploy` - Deploy to production (Robo.js)
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier

## Discord SDK Usage

The Discord SDK is available throughout your app via the `useDiscordSdk` hook:

```tsx
import { useDiscordSdk } from '@hooks/useDiscordSdk'

function MyComponent() {
  const { sdk, isReady, auth, authenticate } = useDiscordSdk()

  if (!isReady) return <div>Loading...</div>
  if (!auth.isAuthenticated) {
    return <button onClick={authenticate}>Sign in</button>
  }

  return <div>Welcome, {auth.user?.username}!</div>
}
```

## Mobile Optimization

This template follows Discord's mobile best practices:

- **44px minimum touch targets** - All interactive elements
- **Active states instead of hover** - Better mobile UX
- **Responsive breakpoints** - Mobile-first design
- **Safe area support** - Handles notched devices
- **Device detection** - Adaptive rendering via `useDeviceCapabilities`

## Security Best Practices

- **Client Secret Protection** - Never exposed to client code
- **Server-side Token Exchange** - OAuth2 code exchange on server
- **CSRF Protection** - State parameter validation
- **Session Management** - Secure token storage (update for production)
- **CSP Compliance** - All requests proxied via Robo.js

## Production Deployment

Before deploying to production:

1. **Update Session Storage** - Replace in-memory storage in `src/api/token.ts` with Redis or database
2. **Set Production Environment Variables** - Use your hosting platform's environment variable system
3. **Configure CORS** - Update allowed origins for production domains
4. **Enable Logging** - Add proper logging and error tracking
5. **Test Mobile** - Test on actual Discord mobile clients (iOS & Android)
6. **Review Security** - Audit all security-sensitive code

## Common Issues

### "VITE_DISCORD_CLIENT_ID is not defined"
- Make sure `.env` file exists and contains `VITE_DISCORD_CLIENT_ID`
- Restart dev server after changing `.env`

### OAuth2 redirect error
- Ensure redirect URI in `.env` matches Discord Developer Portal exactly
- Check for trailing slashes and protocol (http vs https)

### CSP errors in browser console
- Use `/.proxy/` prefix for all external API calls
- Configure URL mappings in `vite.config.ts`

### Activity not loading in Discord
- Use HTTPS (Cloudflare Tunnel) for testing
- Check Discord Developer Portal Activity URL mapping
- Verify activity is enabled for your application

## Resources

- [Discord Embedded App SDK Docs](https://discord.com/developers/docs/activities/overview)
- [Robo.js Documentation](https://robojs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## License

MIT
