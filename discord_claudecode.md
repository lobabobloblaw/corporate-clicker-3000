# Building Discord Activities with Claude Code CLI

**Claude Code CLI transforms Discord Activities development from a complex, multi-step process into an efficient, AI-guided workflow.** This agentic coding tool excels at handling Discord's intricate SDK integrations, OAuth2 flows, and iframe constraints while generating production-ready React/TypeScript code. With Claude Sonnet 4 and Opus 4.1 models powering intelligent collaboration, developers can prototype complete multiplayer experiences in hours rather than weeks.

Discord Activities—web applications embedded within Discord's client—present unique challenges: strict Content Security Policy enforcement, OAuth2 authentication requirements, WebSocket state synchronization, and mobile compatibility constraints. Claude Code CLI addresses these challenges through context-aware code generation, proactive debugging, and deep understanding of both Discord's Embedded App SDK and modern web frameworks.

## Claude Code CLI revolutionizes Discord development workflows

Claude Code CLI operates as an intelligent development partner in your terminal, combining natural language understanding with direct codebase manipulation. For Discord Activities, this means transforming complex requirements like "implement OAuth2 authentication with Discord's SDK" into functional code that handles authorization flows, token exchange, and session management—all while respecting Discord's security constraints.

**The agentic approach proves transformative** for Discord development. Rather than writing boilerplate manually, developers describe their intent conversationally. Claude Code reads project structure through CLAUDE.md memory files, understands Discord SDK patterns from documentation, and generates code that integrates seamlessly with existing architectures. This is particularly valuable for Discord Activities where developers must navigate OAuth2 scopes, CSP restrictions, URL mapping requirements, and iframe communication simultaneously.

Installation requires Node.js 18+ and takes seconds: `npm install -g @anthropic-ai/claude-code`. Authentication happens through browser login or API key ($3-$15 per million tokens). Three pricing tiers serve different needs: Pro ($20/month), Max5 ($100/month), and Max20 ($200/month), with higher tiers providing increased usage limits.

**Three chat modes optimize different workflows.** Default mode requires approval for each action, ensuring control over code changes. Auto mode grants Claude autonomy for rapid prototyping—ideal when scaffolding Discord Activity projects from templates. Plan mode excels at complex implementations, using "think" or "ultrathink" commands to architect solutions before writing code. For Discord Activities, Plan mode shines when implementing multiplayer state management or integrating game frameworks like Phaser or Three.js.

Claude Code's file operations leverage powerful tools: Read for examining SDK documentation, Write for creating new components, Edit for modifying authentication flows, and MultiEdit for simultaneous changes across multiple files. The Bash tool enables running development servers, Cloudflare tunnels, and Discord bot commands. Grep and Glob tools help navigate large codebases, crucial when working with Discord's extensive API surface.

**Context management through CLAUDE.md files** proves essential for Discord projects. These hierarchical memory files store project-specific instructions at global, project, and subdirectory levels. For Discord Activities, a project-level CLAUDE.md might specify: "Always use @discord/embedded-app-sdk version 2.4.0, proxy external requests through /.proxy prefix, implement OAuth2 with authorization code flow, and never expose DISCORD_CLIENT_SECRET in client code." Claude Code references these guidelines throughout development, ensuring consistency.

The tool's **state-of-the-art coding capabilities** show in benchmarks: 72.7% on SWE-bench, outperforming competitors. For Discord development, this translates to generating OAuth2 flows that properly handle state parameters, implementing WebSocket connections that respect Discord's proxy rules, and creating React components that integrate Discord's useDiscordSdk hook correctly on first attempt.

## Setting up Discord Activity projects with Claude Code

**Discord Activities require specific project initialization patterns.** The recommended approach uses create-robo, which scaffolds complete projects with frontend (Vite + React), backend (Express API routes), and Discord SDK integration pre-configured. Claude Code excels at guiding this process and customizing templates to specific needs.

Starting a new project begins with: `npx create-robo my-activity --kit activity`. This command generates a structured project with `/src/app` for client-side React code, `/src/api` for server-side API routes handling OAuth2 token exchange, and `/src/hooks` containing the essential useDiscordSdk React hook. Claude Code can then customize this foundation based on requirements.

**Discord's Embedded App SDK (@discord/embedded-app-sdk) forms the core** of all Activities. This SDK handles communication between the iframed application and Discord's client. Claude Code understands the SDK's architecture and generates proper initialization code:

```typescript
import { DiscordSDK } from '@discord/embedded-app-sdk';

const discordSdk = new DiscordSDK(YOUR_OAUTH2_CLIENT_ID);

async function setup() {
  await discordSdk.ready();
  
  const { code } = await discordSdk.commands.authorize({
    client_id: YOUR_OAUTH2_CLIENT_ID,
    response_type: 'code',
    state: '',
    prompt: 'none',
    scope: ['identify', 'guilds'],
  });
  
  const response = await fetch('/.proxy/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  
  const { access_token } = await response.json();
  
  const auth = await discordSdk.commands.authenticate({
    access_token,
  });
}
```

**Claude Code's advantage emerges in OAuth2 implementation.** When prompted to "implement Discord OAuth2 authentication with proper security," Claude generates both client-side authorization requests and server-side token exchange endpoints, ensuring the client secret never reaches the browser. It automatically creates the `/src/api/token.js` endpoint that safely exchanges authorization codes for access tokens using Discord's OAuth2 API.

React integration follows specific patterns optimized for Discord Activities. **The useDiscordSdk hook provides components with authenticated Discord SDK access.** Claude Code generates comprehensive context providers:

```typescript
export function DiscordContextProvider({ 
  authenticate = false,
  scope = ['identify'],
  children 
}) {
  const [discordSdk] = useState(() => new DiscordSDK(CLIENT_ID));
  const [authenticated, setAuthenticated] = useState(false);
  const [session, setSession] = useState(null);
  
  useEffect(() => {
    async function setup() {
      await discordSdk.ready();
      
      if (authenticate) {
        const { code } = await discordSdk.commands.authorize({
          client_id: CLIENT_ID,
          response_type: 'code',
          scope,
        });
        
        const response = await fetch('/.proxy/api/token', {
          method: 'POST',
          body: JSON.stringify({ code }),
        });
        
        const { access_token } = await response.json();
        await discordSdk.commands.authenticate({ access_token });
        setAuthenticated(true);
      }
    }
    setup();
  }, [authenticate]);
  
  return (
    <DiscordContext.Provider value={{ discordSdk, authenticated, session }}>
      {children}
    </DiscordContext.Provider>
  );
}
```

**File structure follows best practices** that Claude Code maintains consistently. The `/src/app` directory contains React components and pages, `/src/api` houses server-side logic, `/public` stores static assets, and environment variables live in `.env` files (never committed). Claude Code enforces this structure through CLAUDE.md instructions, ensuring new features land in appropriate locations.

TypeScript configuration deserves special attention for Discord projects. Claude Code configures `tsconfig.json` with strict mode enabled, path aliases for clean imports (`@/components`, `@/hooks`), and proper React types. This TypeScript foundation enables better code completion and catches Discord API integration errors at compile time rather than runtime.

**Environment variable management requires precision.** Discord Activities need `VITE_DISCORD_CLIENT_ID` (exposed to client), `DISCORD_CLIENT_SECRET` (server-only), and `DISCORD_PUBLIC_KEY` (for request verification). Claude Code generates comprehensive `.env.example` files documenting all required variables and creates logic that validates their presence on startup, failing fast with clear error messages if configuration is missing.

Integration with modern build tools like Vite provides hot module replacement during development. Claude Code configures Vite to handle Discord's proxy requirements through the `@robojs/patch` plugin, which automatically prefixes external requests with `/.proxy` to comply with Discord's Content Security Policy. This eliminates the most common deployment issue—CSP violations blocking external resources.

## Iterative development powered by intelligent collaboration

**Claude Code transforms iterative development from tedious to effortless.** Discord Activities require constant refinement: testing authentication flows, debugging multiplayer state synchronization, optimizing performance for mobile devices, and handling edge cases. Claude Code's conversational interface enables developers to describe issues naturally and receive targeted fixes.

The development loop typically starts with: `npm run dev`, which starts both the Vite development server and automatically provisions a Cloudflare Tunnel for testing in Discord. **Robo.js integrates tunneling seamlessly**, displaying the public URL in the console. Developers copy this URL to Discord's Developer Portal URL Mappings, configuring the root `/` mapping to point to the tunnel. This enables testing the Activity directly within Discord voice channels.

**Cloudflare Tunnel proves essential for local Discord development.** Discord Activities must be HTTPS to function—localhost HTTP won't work. Cloudflare provides free, persistent tunnels with the command `cloudflared tunnel --url http://localhost:5173`. Unlike ngrok's free tier with randomized URLs requiring constant reconfiguration, Cloudflare tunnels remain stable across sessions. Claude Code can generate scripts that automate tunnel creation and URL copying, streamlining the development loop.

Debugging Discord Activities presents unique challenges due to iframe sandboxing. **Chrome DevTools integration is critical.** Opening DevTools while an Activity runs reveals console logs, network requests, and CSP violations. Common errors include blocked external resources (`blocked:csp` messages), authentication failures from misconfigured OAuth2, and WebSocket connection issues.

**Claude Code excels at diagnosing these Discord-specific errors.** Paste a CSP violation into Claude Code's chat with context: "My Discord Activity is blocking requests to api.example.com with CSP error." Claude Code understands Discord's proxy requirements and generates the solution: either configuring URL mappings in the Developer Portal or implementing a server-side proxy endpoint. For URL mapping, Claude provides exact configuration format with prefix and target. For proxying, Claude generates secure API routes with input validation.

Discord's CSP restrictions require **all external requests to be proxied**. This is Discord's most significant constraint. Instead of fetching `https://api.example.com/data` directly, requests must use `/.proxy/api-example/data` with corresponding URL mapping configured. Claude Code handles this systematically:

1. **URL Mapping Configuration** - Claude generates documentation for Developer Portal setup, listing all external domains requiring mapping with recommended prefixes
2. **Automatic Prefixing** - Configures `@robojs/patch` Vite plugin to automatically rewrite fetch calls
3. **Custom Proxy Endpoints** - Creates server-side API routes when automatic solutions fail, with proper security validation

For complex scenarios like Colyseus multiplayer servers, Claude Code configures proxy rules mapping WebSocket connections correctly. Example: `/colyseus` prefix mapping to the game server running on a separate port, ensuring both HTTP and WebSocket upgrade requests reach the correct destination.

**Testing iframe-embedded applications requires specific workflows.** Discord Activities run in iframes with limited storage, restricted browser APIs, and platform-specific quirks. Claude Code helps developers implement testing strategies: creating mock Discord SDK for unit tests, generating integration tests that verify OAuth flows, and building comprehensive error handling that gracefully degrades when browser features are unavailable.

The 25-member server limit for unverified apps affects testing logistics. Claude Code can't change this Discord policy but helps developers create efficient testing environments. Generate documentation for testers explaining how to access unverified Activities, create small test servers optimally configured, and implement feature flags allowing gradual rollout of features to small groups before requesting verification.

**OAuth2 authentication flow debugging benefits tremendously from Claude Code assistance.** OAuth2 implementation requires precisely coordinated client and server code. Common failures include mismatched redirect URIs, incorrect scope configurations, and improper token storage. When authentication fails, describe the error to Claude Code: "Authorization returns 'invalid_redirect_uri'." Claude immediately checks the redirect URI in both the client-side authorize call and the Developer Portal configuration, identifies mismatches, and corrects them.

Managing OAuth2 state parameters prevents CSRF attacks but adds complexity. Claude Code generates cryptographically secure state parameter creation, session storage, and validation logic automatically. For each authorization request, Claude ensures unique state generation, secure storage (server-side sessions or encrypted cookies), and thorough validation on callback.

**Real-time features like voice events require careful event subscription management.** Discord's SDK emits events for voice state changes (speaking, muting, users joining/leaving). Claude Code generates React hooks that properly subscribe to events, clean up listeners on unmount, and manage state updates:

```typescript
export function useVoiceEvents() {
  const { discordSdk } = useDiscordSdk();
  const [speakingUsers, setSpeakingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleSpeaking = (event: any) => {
      setSpeakingUsers(prev => {
        const next = new Set(prev);
        event.speaking ? next.add(event.userId) : next.delete(event.userId);
        return next;
      });
    };

    discordSdk.subscribe('SPEAKING_START', handleSpeaking);
    discordSdk.subscribe('SPEAKING_STOP', handleSpeaking);

    return () => {
      discordSdk.unsubscribe('SPEAKING_START', handleSpeaking);
      discordSdk.unsubscribe('SPEAKING_STOP', handleSpeaking);
    };
  }, [discordSdk]);

  return speakingUsers;
}
```

This pattern—subscribe in useEffect, return cleanup function—prevents memory leaks common in Discord Activities that manage real-time events. Claude Code applies this pattern consistently across all event types.

## Practical patterns for Discord Activities features

**Building React components optimized for Discord Activities** requires understanding both React best practices and Discord-specific constraints. Claude Code generates components that follow established patterns while respecting Discord's iframe environment, CSP restrictions, and mobile compatibility requirements.

Real-time multiplayer state synchronization represents a core Discord Activities challenge. **Three approaches dominate: @robojs/sync for simplicity, Colyseus for complexity, and custom WebSocket implementations for specific needs.** Claude Code can implement all three based on requirements.

For simple shared state like synchronized video playback or basic multiplayer games, **@robojs/sync provides the easiest path:**

```typescript
import { useSyncState } from '@robojs/sync';

export function SharedVideoPlayer() {
  const { session } = useDiscordSdk();
  const [isPlaying, setPlaying] = useSyncState(
    false, 
    ['video-player', session.channelId]
  );
  const [currentTime, setCurrentTime] = useSyncState(
    0,
    ['video-time', session.channelId]
  );

  return (
    <video 
      playing={isPlaying}
      currentTime={currentTime}
      onPlay={() => setPlaying(true)}
      onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
    />
  );
}
```

The dependency array controls which clients share state. All clients in the same channel see synchronized playback state automatically. Claude Code generates these patterns with appropriate dependency arrays based on whether state should be per-user, per-channel, or global.

**Colyseus framework integration provides authoritative multiplayer architecture** for complex games. Server maintains the single source of truth, clients receive state deltas, and the server validates all actions. Claude Code scaffolds complete Colyseus implementations:

The server defines room logic and state schema:

```typescript
import { Room, Client } from "@colyseus/core";
import { Schema, MapSchema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("string") name: string;
}

export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

export class GameRoom extends Room {
  maxClients = 8;
  state = new GameState();

  onCreate(options) {
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (this.isValidMove(data.x, data.y)) {
        player.x = data.x;
        player.y = data.y;
      }
    });
  }

  onJoin(client: Client, options: any) {
    const player = new Player();
    player.name = options.discordUsername;
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
  }
}
```

The client connects and renders state:

```typescript
import { Client } from 'colyseus.js';

const client = new Client('wss://your-server.com');
const room = await client.join('game_room', {
  discordUsername: session.username
});

room.onStateChange((state) => {
  renderPlayers(state.players);
});

function handleInput(x, y) {
  room.send('move', { x, y });
}
```

**Claude Code generates both server and client code simultaneously**, ensuring protocol compatibility. It understands Colyseus's state synchronization mechanics and creates schemas that efficiently serialize game state updates. For Discord Activities specifically, Claude Code configures proxy mappings so WebSocket connections to the Colyseus server work through Discord's proxy.

Canvas and WebGL rendering enable visually rich Discord Activities. **Three.js for 3D and PixiJS for 2D** integrate cleanly with React through refs. Claude Code generates complete setups:

```typescript
import * as THREE from 'three';
import { useRef, useEffect } from 'react';

export function ThreeJSCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { discordSdk } = useDiscordSdk();

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 
      window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x5865F2 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
}
```

Discord's iframe environment supports WebGL without restrictions, making Three.js a viable choice for 3D games. **Claude Code handles WebGL context management, proper cleanup, and responsive canvas sizing** automatically. For mobile compatibility, Claude adjusts rendering quality based on device capabilities detected through the Discord SDK.

**Phaser game framework integration** follows a specific pattern. Claude Code generates the Phaser configuration, initializes the game instance, and bridges Discord SDK data into Phaser scenes:

```typescript
import Phaser from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 200 } }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

function create() {
  // Access Discord data in Phaser
  const discordUsername = this.registry.get('discordUsername');
  this.add.text(10, 10, `Welcome, ${discordUsername}!`);
}

export function PhaserGame() {
  const { session } = useDiscordSdk();
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    gameRef.current = new Phaser.Game(config);
    gameRef.current.registry.set('discordUsername', session.username);

    return () => {
      gameRef.current?.destroy(true);
    };
  }, [session]);

  return <div id="phaser-game" />;
}
```

The official Phaser Discord multiplayer template demonstrates best practices that Claude Code replicates: separating game logic from Discord integration, using Colyseus for state synchronization, and properly handling asset loading through Discord's proxy.

**State management and persistence challenges** arise from Discord's iframe constraints. localStorage may not persist reliably across sessions, and cookies face restrictions. Claude Code implements robust persistence strategies:

For client-side persistence, IndexedDB provides reliable storage:

```typescript
async function saveGameProgress(userId: string, progress: GameProgress) {
  const db = await openDB('discord-activity', 1, {
    upgrade(db) {
      db.createObjectStore('progress', { keyPath: 'userId' });
    },
  });
  
  await db.put('progress', { userId, ...progress });
}
```

For server-side persistence, Claude generates API endpoints with proper authentication:

```typescript
// /src/api/save-progress.ts
export default async (request) => {
  const { userId, accessToken, progress } = await request.json();
  
  // Verify token with Discord API
  const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (!userResponse.ok) return { error: 'Unauthorized' };
  
  const user = await userResponse.json();
  if (user.id !== userId) return { error: 'Token mismatch' };
  
  // Save to database
  await db.gameProgress.upsert({
    where: { userId },
    update: progress,
    create: { userId, ...progress }
  });
  
  return { success: true };
};
```

This pattern—verify Discord token, validate user identity, then persist data—ensures security while enabling cloud save functionality. Claude Code generates comprehensive database schemas, migration files, and API routes with proper error handling.

**Network requests and proxy configuration** require systematic handling. Claude Code implements three-tier strategies:

First, **configure URL mappings** in Discord Developer Portal for known external domains. Claude generates documentation listing all required mappings with exact prefix and target configurations.

Second, **implement automatic request rewriting** using `@robojs/patch`:

```javascript
// vite.config.js
import { DiscordProxy } from '@robojs/patch';

export default {
  plugins: [DiscordProxy.Vite()]
};
```

Third, **create secure proxy endpoints** for dynamic or authenticated requests:

```typescript
// /src/api/proxy.ts
const ALLOWED_DOMAINS = ['api.example.com', 'cdn.assets.com'];

export default async (request) => {
  const { url } = request.query;
  const parsedUrl = new URL(url);
  
  if (!ALLOWED_DOMAINS.includes(parsedUrl.hostname)) {
    return { error: 'Domain not allowed' };
  }
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'DiscordActivity/1.0'
    }
  });
  
  return response;
};
```

Claude Code generates allowlists, input validation, and error handling automatically, preventing common security vulnerabilities like SSRF attacks.

**Hybrid bot + Activity architectures** combine Discord bots with Activities for rich experiences. Bots handle persistent features like notifications and commands, while Activities provide interactive UIs. Claude Code scaffolds both components with shared backend logic:

```typescript
// Shared user data service
export class UserService {
  async getUserData(userId: string) {
    return db.users.findUnique({ where: { userId } });
  }
  
  async updateScore(userId: string, score: number) {
    return db.users.update({
      where: { userId },
      data: { score }
    });
  }
}

// Bot uses service
client.on('messageCreate', async (message) => {
  if (message.content === '!score') {
    const data = await userService.getUserData(message.author.id);
    message.reply(`Your score: ${data.score}`);
  }
});

// Activity uses same service
export function ActivityUI() {
  const { session, accessToken } = useDiscordSdk();
  const [score, setScore] = useState(0);
  
  async function updateScore(newScore: number) {
    await fetch('/.proxy/api/update-score', {
      method: 'POST',
      body: JSON.stringify({ 
        userId: session.id, 
        score: newScore,
        accessToken 
      })
    });
    setScore(newScore);
  }
}
```

This architecture enables bots to launch Activities via voice channel invites, Activities to trigger bot notifications, and both to share user progress and leaderboards. Claude Code maintains consistency between bot commands and Activity features, generating parallel implementations.

## Claude Code's advantages for Discord development

**Agentic coding capabilities transform SDK integration** from documentation-reading marathons to conversational implementation. Discord's Embedded App SDK spans authentication, voice events, RPC commands, and iframe communication—hundreds of API endpoints with specific requirements. Claude Code understands this API surface comprehensively.

When developers request "implement Discord voice state detection showing who's speaking," Claude Code generates complete solutions including SDK subscription setup, React state management, cleanup on unmount, and UI rendering—all in one response. Traditional development requires reading documentation, understanding subscription patterns, handling edge cases, and implementing proper cleanup. Claude Code handles this cognitive load.

**Rapid prototyping accelerates Discord development dramatically.** The "Death by AI" case study from Playroom demonstrates production-ready Discord Activities deployed within one day of SDK access, ultimately reaching 7 million users. Claude Code enables similar velocity through its ability to generate complete features from descriptions.

Example: "Create a multiplayer clicker game where all players see real-time click counts." Claude Code generates:

```typescript
// Complete implementation in minutes
import { useSyncState } from '@robojs/sync';

export function ClickerGame() {
  const { session } = useDiscordSdk();
  const [clicks, setClicks] = useSyncState(0, ['global-clicks']);
  const [playerClicks, setPlayerClicks] = useSyncState(0, 
    ['player-clicks', session.id]);

  return (
    <div>
      <h1>Total Clicks: {clicks}</h1>
      <h2>Your Clicks: {playerClicks}</h2>
      <button onClick={() => {
        setClicks(clicks + 1);
        setPlayerClicks(playerClicks + 1);
      }}>
        Click!
      </button>
      <PlayerLeaderboard />
    </div>
  );
}
```

Claude Code includes the leaderboard component, styling, and multiplayer synchronization without additional prompting—understanding that clicker games inherently need these features.

**Debugging Discord-specific constraints** benefits immensely from Claude Code's contextual understanding. The 25-member server limit for unverified apps is a common stumbling block. When developers encounter this limitation, Claude Code explains the restriction, generates documentation for testers, and suggests development workflows (maintaining separate test servers, implementing feature flags for gradual rollout).

CSP issues—the most common Discord Activities problem—receive systematic solutions. Describe the blocked resource and Claude Code immediately provides three tiered solutions: URL mapping configuration for Developer Portal, automatic rewriting via `@robojs/patch`, or secure proxy implementation. Claude remembers which approach you prefer and applies it consistently.

**Code generation for boilerplate eliminates tedious work.** OAuth2 setup requires coordinated client-side authorization, server-side token exchange, and secure token storage. This typically takes hours for first-time Discord developers. Claude Code generates production-ready OAuth2 flows in seconds:

```typescript
// Client-side authorization
const { code } = await discordSdk.commands.authorize({
  client_id: CLIENT_ID,
  response_type: 'code',
  state: generateSecureState(),
  prompt: 'none',
  scope: ['identify', 'guilds']
});

// Server-side token exchange
app.post('/api/token', async (req, res) => {
  const { code, state } = req.body;
  
  if (!validateState(state, req.session)) {
    return res.status(401).json({ error: 'Invalid state' });
  }
  
  const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.REDIRECT_URI
    })
  });
  
  const tokens = await tokenResponse.json();
  
  // Secure token storage
  req.session.accessToken = tokens.access_token;
  req.session.refreshToken = tokens.refresh_token;
  
  res.json({ access_token: tokens.access_token });
});

// Token refresh logic
async function refreshAccessToken(refreshToken: string) {
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  });
  return response.json();
}
```

Claude Code includes CSRF protection via state parameters, secure token storage in server-side sessions, refresh token handling, and proper error responses. This comprehensive implementation would take experienced developers 2-4 hours; Claude Code delivers it in minutes.

**Handling framework-specific patterns** showcases Claude Code's depth. React hooks require specific patterns—subscriptions in useEffect, cleanup functions, dependency arrays. Discord Activities add complexity with SDK events and multiplayer state. Claude Code generates hooks following best practices:

```typescript
export function useChannelMembers() {
  const { discordSdk } = useDiscordSdk();
  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    let mounted = true;

    async function fetchMembers() {
      const channel = await discordSdk.commands.getChannel({
        channel_id: discordSdk.channelId
      });
      
      if (mounted) {
        setMembers(channel.members);
      }
    }

    fetchMembers();

    const handleMemberJoin = (event: any) => {
      if (mounted) {
        setMembers(prev => [...prev, event.user]);
      }
    };

    const handleMemberLeave = (event: any) => {
      if (mounted) {
        setMembers(prev => prev.filter(m => m.id !== event.user.id));
      }
    };

    discordSdk.subscribe('CHANNEL_MEMBER_JOIN', handleMemberJoin);
    discordSdk.subscribe('CHANNEL_MEMBER_LEAVE', handleMemberLeave);

    return () => {
      mounted = false;
      discordSdk.unsubscribe('CHANNEL_MEMBER_JOIN', handleMemberJoin);
      discordSdk.unsubscribe('CHANNEL_MEMBER_LEAVE', handleMemberLeave);
    };
  }, [discordSdk]);

  return members;
}
```

The `mounted` flag prevents state updates after unmount, subscriptions clean up properly, and dependency arrays include only stable references. These patterns prevent common React bugs that plague Discord Activities development.

Vite configuration for Discord Activities requires specific plugins and proxy setup. Claude Code generates complete configurations:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { DiscordProxy } from '@robojs/patch';

export default defineConfig({
  plugins: [
    react(),
    DiscordProxy.Vite()
  ],
  server: {
    port: 5173,
    proxy: {
      '/.proxy': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/.proxy/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'discord-sdk': ['@discord/embedded-app-sdk'],
          'vendor': ['react', 'react-dom']
        }
      }
    }
  }
});
```

This configuration handles Discord proxy rules, optimizes bundle splitting for faster loads, and configures development server proxying. Claude Code adjusts these settings based on specific requirements—adding Colyseus WebSocket proxy configuration for multiplayer games, Three.js chunk optimization for 3D graphics, or Phaser asset handling.

**Node.js server setup** for Discord Activities follows specific patterns. Express servers need endpoints for OAuth2 token exchange, webhook handlers for Discord events, and potentially Colyseus server integration. Claude Code scaffolds complete servers:

```typescript
import express from 'express';
import session from 'express-session';
import { Server } from 'colyseus';

const app = express();

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// OAuth2 token exchange
app.post('/api/token', async (req, res) => {
  // Implementation generated above
});

// User data endpoint
app.get('/api/user', async (req, res) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
    headers: { Authorization: `Bearer ${req.session.accessToken}` }
  });
  
  const user = await userResponse.json();
  res.json(user);
});

// Colyseus server
const gameServer = new Server({
  server: app,
});

gameServer.define('game_room', GameRoom);

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
```

Claude Code configures session security (httpOnly cookies, secure flags for production, appropriate maxAge), implements proper authentication checks, and integrates Colyseus seamlessly. The server structure scales from simple Activities to complex multiplayer games.

## Preparing Discord Activities for production

**Verification process unlocks Discord Activities' full potential.** Unverified apps work only in servers with fewer than 25 members and lack discoverability features. Verification requires identity verification via Stripe (Discord's partner), completed application information (privacy policy URL, terms of service, support server), and demonstrated functionality.

Claude Code assists verification preparation by generating required documentation. Request "create a privacy policy for my Discord Activity that collects usernames and game progress," and Claude generates comprehensive privacy policies covering data collection, storage, usage, and user rights compliant with GDPR and CCPA.

Terms of service generation follows similar patterns. Claude understands Discord's Developer Terms of Service requirements and creates ToS documents covering acceptable use, liability limitations, account termination conditions, and dispute resolution. These documents protect developers while meeting Discord's verification requirements.

**Environment variable management** demands strict separation between development and production. Claude Code creates comprehensive environment configurations:

```bash
# .env.development
NODE_ENV=development
VITE_DISCORD_CLIENT_ID=123456789
DISCORD_CLIENT_SECRET=dev_secret_here
DISCORD_PUBLIC_KEY=dev_public_key
DATABASE_URL=postgresql://localhost:5432/discord_activity_dev
SESSION_SECRET=dev_session_secret
FRONTEND_URL=http://localhost:5173

# .env.production
NODE_ENV=production
VITE_DISCORD_CLIENT_ID=987654321
DISCORD_CLIENT_SECRET=prod_secret_here
DISCORD_PUBLIC_KEY=prod_public_key
DATABASE_URL=postgresql://prod.db.host:5432/discord_activity_prod
SESSION_SECRET=prod_session_secret_generated_securely
FRONTEND_URL=https://your-activity.com
```

Claude Code generates scripts validating environment variables on startup, failing fast with clear error messages when required variables are missing. This prevents deploying with development credentials to production.

**Hosting platform selection** depends on Activity requirements. Serverless platforms like Cloudflare Workers and Vercel suit HTTP-based Activities handling authentication and API routes. Railway and traditional VPS options support persistent connections required for complex multiplayer servers.

Cloudflare Workers deployment with Claude Code guidance:

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler publish
```

Claude Code generates `wrangler.toml` configuration:

```toml
name = "discord-activity"
main = "src/index.js"
compatibility_date = "2024-01-01"

[env.production]
vars = { ENVIRONMENT = "production" }
```

Secrets management uses Wrangler commands: `wrangler secret put DISCORD_CLIENT_SECRET`. Claude Code documents this process comprehensively.

Vercel deployment follows similar patterns. Claude Code creates `vercel.json` configuration and documents environment variable setup through Vercel's dashboard. Critical note: Vercel doesn't support traditional Discord bots requiring persistent WebSocket connections but works perfectly for HTTP-based Activities.

**Performance optimization for iframe contexts** requires careful asset management. Discord's iframe environment adds overhead—the Discord client itself consumes resources, leaving less for Activities. Claude Code implements optimization strategies:

Code splitting reduces initial bundle size:

```typescript
// Lazy load heavy components
const GameEngine = lazy(() => import('./GameEngine'));
const Leaderboard = lazy(() => import('./Leaderboard'));

export function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/game" element={<GameEngine />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Suspense>
  );
}
```

Asset optimization compresses images and uses modern formats:

```javascript
// vite.config.js optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('three')) {
            return 'three';
          }
        }
      }
    },
    assetsInlineLimit: 4096,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

Claude Code configures these optimizations automatically when generating production builds, ensuring minimal bundle sizes and fast load times.

**Mobile compatibility testing** requires specific considerations. Discord Activities support iOS and Android, but mobile devices have limited processing power and battery constraints. Claude Code generates responsive designs automatically using Tailwind CSS with mobile-first breakpoints:

```tsx
export function MobileOptimizedUI() {
  return (
    <div className="
      flex flex-col
      p-4 md:p-8
      text-sm md:text-base
      gap-2 md:gap-4
    ">
      <button className="
        py-3 px-6 md:py-4 md:px-8
        text-lg md:text-xl
        min-h-[44px]
        active:scale-95 transition-transform
      ">
        Tap to Play
      </button>
    </div>
  );
}
```

Touch target sizes meet Apple's minimum 44x44 pixel recommendation. Claude Code adds `active:scale-95` for visual feedback since hover states don't exist on mobile. The responsive padding and text sizing ensure readability across device sizes.

Performance monitoring for mobile includes detecting device capabilities and adjusting quality:

```typescript
function getDeviceTier() {
  const memory = (navigator as any).deviceMemory; // GB
  const cores = navigator.hardwareConcurrency;
  
  if (memory >= 8 && cores >= 4) return 'high';
  if (memory >= 4 && cores >= 2) return 'medium';
  return 'low';
}

export function AdaptiveRenderer() {
  const [tier] = useState(getDeviceTier());
  
  return (
    <Canvas
      pixelRatio={tier === 'high' ? 2 : 1}
      antialias={tier === 'high'}
      shadows={tier === 'high'}
    >
      <Scene quality={tier} />
    </Canvas>
  );
}
```

Claude Code generates adaptive rendering logic ensuring smooth performance on all devices. Low-end devices receive simplified graphics, while high-end devices get enhanced visuals.

Mobile OAuth2 redirect handling requires special configuration. Discord uses custom URL schemes for mobile: `discord-APP_ID:/authorize/callback`. Claude Code configures redirect URIs correctly for both platforms:

```typescript
const REDIRECT_URI = platform === 'mobile' 
  ? `discord-${CLIENT_ID}:/authorize/callback`
  : 'https://yourdomain.com/callback';
```

Testing mobile requires actual devices or emulators. Claude Code documents testing procedures: opening Discord on mobile, joining voice channels, launching Activities, and monitoring for heating issues or performance problems.

## Learning from real-world Discord Activities

**Official Discord Activities showcase production patterns.** Activities like "Putt Party" (built with Cocos Creator), "Watch Together" (synchronized YouTube viewing), and "Gartic Phone" (drawing game) demonstrate various approaches. Examining open-source implementations reveals best practices Claude Code can replicate.

The **Phaser multiplayer template** (github.com/phaserjs/discord-multiplayer-template) exemplifies production-ready structure. Separate `client` and `server` packages with clear boundaries, Colyseus handling multiplayer state, Vite building the frontend, and comprehensive OAuth2 implementation. Claude Code can scaffold similar architectures:

"Create a Phaser multiplayer Discord Activity with Colyseus backend" generates the monorepo structure, configures build tools for both packages, implements Phaser game scenes with Discord integration, sets up Colyseus rooms with state synchronization, and creates development scripts handling both client and server with single command.

**Hugo-Dz/discord-activity-starter** demonstrates Three.js integration with SvelteKit. This project proves 3D graphics work excellently in Discord Activities, shows physics simulation via Rapier, and implements Playroom multiplayer for real-time state. Claude Code can generate similar 3D Activities:

```typescript
import * as THREE from 'three';
import { Physics, RigidBody } from '@react-three/rapier';
import { Canvas } from '@react-three/fiber';

export function Physics3DGame() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <Physics>
        <RigidBody position={[0, 10, 0]}>
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#5865F2" />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed">
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#2c2f33" />
          </mesh>
        </RigidBody>
      </Physics>
    </Canvas>
  );
}
```

This creates a physics sandbox with falling objects and ground plane—a foundation for 3D multiplayer games. Claude Code adds player controls, networking via Playroom, and Discord user integration.

**Common pitfalls emerge from community experience.** CSP violations dominate troubleshooting forums. Developers frequently encounter "blocked:csp" errors when loading external resources. Claude Code preemptively addresses this by configuring URL mappings and `@robojs/patch` during initial setup.

OAuth2 configuration errors rank second. Mismatched redirect URIs between code and Developer Portal cause frustrating authentication failures. Claude Code validates OAuth2 configuration, checking redirect URI consistency across client code, server configuration, and documented Developer Portal setup.

The 25-member server limit surprises many developers. Claude Code proactively documents this limitation during project initialization, explaining that unverified Activities work only in small servers and verification takes 3-7 weeks after submission.

**Unity WebGL integration** presents unique challenges. Unity's Game SDK doesn't support WebGL builds, requiring iframe bridge patterns. External Unity services face CSP blocks, necessitating proxy implementation. Claude Code can scaffold Unity bridges:

```typescript
// Parent iframe with Discord SDK
const discordSdk = new DiscordSDK(CLIENT_ID);
await discordSdk.ready();

const iframe = document.getElementById('unity-iframe');

// Send Discord data to Unity
iframe.contentWindow.postMessage({
  type: 'discord-user',
  data: {
    username: session.username,
    id: session.id
  }
}, '*');

// Receive Unity events
window.addEventListener('message', (event) => {
  if (event.data.type === 'unity-event') {
    // Handle Unity game events
    console.log('Unity event:', event.data.payload);
  }
});
```

Unity C# script receives messages:

```csharp
// Unity side
public void HandleDiscordMessage(string message) {
    var data = JsonUtility.FromJson<DiscordUserData>(message);
    usernameText.text = data.username;
}

void Start() {
    Application.ExternalCall("window.parent.postMessage", 
        JsonUtility.ToJson(new { type = "unity-ready" }), "*");
}
```

Claude Code generates both sides of this bridge, ensuring protocol consistency and proper error handling.

**"Death by AI" case study** from Playroom demonstrates production scale. This Activity reached 7 million users, generated 1.2 billion AI tokens, and achieved 30%+ Day 7 engagement. Key learnings include cost management through AI provider volume deals, multilingual support requiring careful prompt engineering, and regional AI model restrictions necessitating geographic routing.

Claude Code can implement similar AI integrations. Request "integrate OpenAI for AI-generated responses in my Discord Activity" and Claude generates:

```typescript
// Server-side AI endpoint
app.post('/api/ai-chat', async (req, res) => {
  const { message, userId, accessToken } = req.body;
  
  // Verify Discord token
  const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (!userResponse.ok) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Call OpenAI
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a helpful game character.' },
      { role: 'user', content: message }
    ],
    max_tokens: 150,
    user: userId // Track usage per user
  });
  
  res.json({ 
    response: completion.choices[0].message.content 
  });
});

// Client-side usage
export function AIChat() {
  const { session, accessToken } = useDiscordSdk();
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);

  async function sendMessage() {
    const response = await fetch('/.proxy/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        userId: session.id,
        accessToken
      })
    });
    
    const data = await response.json();
    setResponses([...responses, { user: message, ai: data.response }]);
    setMessage('');
  }

  return (
    <div>
      {responses.map((r, i) => (
        <div key={i}>
          <p><strong>You:</strong> {r.user}</p>
          <p><strong>AI:</strong> {r.ai}</p>
        </div>
      ))}
      <input 
        value={message} 
        onChange={e => setMessage(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && sendMessage()}
      />
    </div>
  );
}
```

This implements authenticated AI chat with proper token verification, usage tracking per user, and clean UI. Claude Code handles OpenAI API key security, rate limiting, and error handling automatically.

**Clicker game examples** demonstrate simplicity can succeed. Discord's official "The Last Meadow" April Fools Activity was a clicker game earning limited-time avatar decorations. Claude Code generates clicker game foundations rapidly:

```typescript
export function ClickerGame() {
  const { session } = useDiscordSdk();
  const [clicks, setClicks] = useSyncState(0, ['global-clicks']);
  const [userClicks, setUserClicks] = useSyncState(0, 
    ['user', session.id, 'clicks']);
  const [upgrades, setUpgrades] = useState({
    autoClicker: 0,
    multiplier: 1
  });

  useEffect(() => {
    if (upgrades.autoClicker > 0) {
      const interval = setInterval(() => {
        setClicks(c => c + upgrades.autoClicker);
        setUserClicks(c => c + upgrades.autoClicker);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [upgrades.autoClicker]);

  const clicksPerSecond = upgrades.autoClicker;
  const upgradeAutoCost = Math.floor(10 * Math.pow(1.15, upgrades.autoClicker));

  function buyAutoClicker() {
    if (userClicks >= upgradeAutoCost) {
      setUserClicks(c => c - upgradeAutoCost);
      setUpgrades(u => ({ ...u, autoClicker: u.autoClicker + 1 }));
    }
  }

  return (
    <div>
      <h1>Total Clicks: {clicks.toLocaleString()}</h1>
      <h2>Your Clicks: {userClicks.toLocaleString()}</h2>
      <h3>Per Second: {clicksPerSecond}</h3>
      
      <button 
        onClick={() => {
          setClicks(c => c + upgrades.multiplier);
          setUserClicks(c => c + upgrades.multiplier);
        }}
        className="big-click-button"
      >
        Click! (+{upgrades.multiplier})
      </button>
      
      <div className="upgrades">
        <button 
          onClick={buyAutoClicker}
          disabled={userClicks < upgradeAutoCost}
        >
          Auto Clicker ({upgrades.autoClicker})
          <br />
          Cost: {upgradeAutoCost}
        </button>
      </div>
    </div>
  );
}
```

This implements global click tracking, per-user progress, auto-clickers generating passive income, and upgrade purchases with increasing costs. The foundation extends to complex idle game mechanics—prestige systems, multiple resources, achievements. Claude Code adds these features iteratively based on descriptions.

**Multiplayer racing games** like "Exoracer" demonstrate competitive activities. Claude Code generates racing game foundations with Colyseus:

```typescript
// Server: Race room
export class RaceRoom extends Room {
  maxClients = 8;
  
  onCreate() {
    this.setState(new RaceState());
    
    this.onMessage('update-position', (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.position = data.position;
      player.checkpoint = data.checkpoint;
      
      // Check for race completion
      if (data.checkpoint === this.state.totalCheckpoints) {
        player.finished = true;
        player.finishTime = Date.now() - this.state.raceStartTime;
        this.broadcast('player-finished', {
          playerId: client.sessionId,
          time: player.finishTime
        });
      }
    });
  }
}

// Client: Race game
export function RaceGame() {
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Map<string, Player>>(new Map());

  useEffect(() => {
    const client = new Client('wss://your-server.com');
    client.join('race_room').then(room => {
      setRoom(room);
      
      room.onStateChange((state) => {
        setPlayers(new Map(state.players));
      });
    });
  }, []);

  return (
    <Canvas>
      {Array.from(players.values()).map(player => (
        <PlayerCar 
          key={player.id}
          position={player.position}
          rotation={player.rotation}
          color={player.color}
        />
      ))}
      <RaceTrack />
    </Canvas>
  );
}
```

Claude Code generates complete racing game architecture including position synchronization, checkpoint tracking, finish time recording, and leaderboards. Adding power-ups, ghost cars, or custom tracks requires simple descriptions.

## Synthesizing Discord development with Claude Code

**Claude Code CLI fundamentally changes Discord Activities development** from documentation-heavy manual coding to conversational implementation. The combination of agentic capabilities, Discord SDK understanding, and React/TypeScript expertise enables developers to build production-ready Activities in a fraction of traditional time.

Key workflows emerge: initialize projects with `create-robo`, describe features conversationally to Claude Code, test iteratively through Cloudflare tunnels, debug Discord-specific constraints with AI assistance, optimize for production with automated performance improvements, and deploy using platform-specific configurations Claude generates.

The technology stack Claude Code optimizes for—React, TypeScript, Vite, Tailwind CSS, Colyseus, Three.js—aligns perfectly with Discord Activities requirements. TypeScript's strong typing enables better AI code generation, Vite's fast HMR accelerates iteration, Tailwind's utility classes simplify responsive design, and Colyseus provides robust multiplayer foundations.

**Security remains paramount.** Claude Code enforces best practices: never exposing client secrets, implementing OAuth2 with CSRF protection via state parameters, validating all user inputs, and securing token storage server-side. These patterns protect developers and users while meeting Discord's verification requirements.

Mobile compatibility requires specific attention. Claude Code generates responsive designs automatically, implements touch-optimized controls, and creates adaptive rendering adjusting quality based on device capabilities. Testing on actual mobile devices remains essential—Claude Code documents testing procedures comprehensively.

**The future of Discord Activities development** leans heavily toward AI-assisted workflows. Projects like Playroom's "Death by AI" reaching 7 million users within weeks demonstrate velocity achievable with proper tooling. Claude Code represents the cutting edge of this workflow, enabling developers to describe complex multiplayer games conversationally and receive production-ready implementations.

Starting points for new developers: install Claude Code CLI, create Discord Activity project with Robo.js, configure OAuth2 credentials in environment variables, describe desired features to Claude Code, test in Discord voice channels through Cloudflare tunnels, iterate based on feedback, optimize for mobile, submit for verification, and deploy to production hosting.

Experienced developers leverage Claude Code differently: scaffold complex architectures (Colyseus multiplayer, Three.js 3D graphics, Phaser games), implement advanced features (AI chat, physics simulation, custom game engines), debug Discord-specific constraints (CSP violations, OAuth2 issues, mobile performance), optimize performance (code splitting, asset compression, adaptive rendering), and maintain codebases (refactoring, testing, documentation).

The Discord Activities ecosystem continues maturing with frameworks like Robo.js providing integrated solutions, Playroom offering simplified multiplayer, and Colyseus enabling complex game state management. Claude Code understands these tools comprehensively, generating configurations and implementations following each framework's best practices.

**Success patterns repeat across projects:** start simple with proven templates, implement core features rapidly using AI assistance, test extensively in Discord (desktop, web, mobile), iterate based on real user feedback, optimize performance for iframe constraints, prepare comprehensive documentation for verification, and deploy to production hosting with proper monitoring.

Discord's verification process, while taking 3-7 weeks, opens Activities to unlimited servers and discovery features. Claude Code assists verification preparation by generating required privacy policies, terms of service, and documentation. The identity verification through Stripe remains manual but Claude documents requirements clearly.

Developers building Discord Activities with Claude Code CLI report dramatic productivity improvements—projects taking weeks traditionally complete in days. The conversational interface lowers barriers for newcomers while advanced features like subagents, custom commands, and MCP integrations serve experienced developers building complex systems.

**The combination of Claude Code CLI and Discord Activities represents the future of social gaming development**—rapid prototyping, AI-assisted implementation, and production deployment at unprecedented velocity. Whether building simple clicker games or complex multiplayer 3D experiences, Claude Code provides the intelligent partnership developers need to succeed on Discord's platform.