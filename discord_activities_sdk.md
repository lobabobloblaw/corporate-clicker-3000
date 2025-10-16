# Discord's API for interactive web experiences: The Activities SDK revolution

Discord Activities represents the platform's definitive solution for embedding interactive web applications directly into Discord. **As of October 2024, Discord Activities are fully available to all developers** with complete monetization capabilities, having graduated from developer preview in March 2024. This technology enables developers to build games, dashboards, and React applications that run as **iframe-embedded web apps** within Discord's 200M+ monthly active users, offering unprecedented interactivity beyond traditional bot limitations.

The Activities SDK fundamentally transforms Discord from a communication platform into a full application platform. This means you can now build complete JavaScript/React applications that run inside Discord with access to voice channels, user presence, and multiplayer context—something traditional bot APIs cannot provide. For developers seeking to create game-like or dashboard experiences, Activities are the primary path forward, while traditional bot features (slash commands, buttons, embeds) remain valuable for command-driven interactions and notifications.

## Activities SDK: Discord's native solution for embedding web applications

Discord Activities are web applications that run in **sandboxed iframes** within Discord clients across desktop, web, and mobile platforms. The architecture is straightforward: your web application is hosted on your servers, loaded into an iframe at runtime, and communicates with Discord's client through the Embedded App SDK (`@discord/embedded-app-sdk`, version 2.4.0 as of October 2025).

### Technical architecture and iframe implementation

Discord **does support iframe embedding**, but exclusively through their controlled Activities system. Your application loads at a special `discordsays.com` domain with strict Content Security Policy (CSP) enforcement. When a user launches your Activity, Discord loads your hosted web application URL and embeds it in an iframe, appending query parameters like `instance_id`, `channel_id`, `guild_id`, and `platform`.

The communication flow follows this pattern: Your Web App (iframe) ↔ Embedded App SDK ↔ Discord Client ↔ Discord API. The SDK uses the **postMessage API** for secure cross-origin communication between your iframe and Discord's client. This sandboxed approach ensures security while enabling rich functionality.

**External resource access** requires special handling due to CSP restrictions. Activities cannot directly access external URLs—you must configure URL Mappings in the Discord Developer Portal. This proxy system routes requests through Discord's infrastructure while maintaining security. For example, to access `https://api.example.com`, you'd configure a URL mapping with prefix `/.proxy/external` that targets your external domain. The SDK also provides `patchUrlMappings()` for handling npm modules that reference external URLs.

### React and JavaScript framework integration

Discord **officially supports React** as the primary framework for Activities, providing starter templates that use React, Vite, Node.js, and TypeScript. The integration is seamless—official examples include a `useDiscordSdk` hook that handles authentication and provides access to the SDK throughout your component tree.

Here's the essential React setup pattern:

```typescript
// App.tsx
import { DiscordContextProvider } from './hooks/useDiscordSdk'

export default function App() {
  return (
    <DiscordContextProvider 
      authenticate 
      scope={['identify', 'guilds', 'applications.commands']}
    >
      <Activity />
    </DiscordContextProvider>
  )
}

// In your components
function MyComponent() {
  const { discordSdk, authenticated, session } = useDiscordSdk()
  // Access Discord API, user info, guild data
}
```

Beyond React, Activities support **any JavaScript framework**: Vue, vanilla JavaScript, Angular, or game engines like Phaser and Unity (via WebGL export). The SDK is framework-agnostic since it operates at the web platform level. For multiplayer state management, Discord's examples showcase integration with **Colyseus** (WebSocket-based real-time state synchronization) and custom WebSocket solutions.

### Authentication and Discord API access

The SDK handles OAuth2 authentication flow automatically. After initialization with `new DiscordSDK(YOUR_CLIENT_ID)`, you call `discordSdk.ready()`, then `discordSdk.commands.authorize()` to request scopes. Your backend exchanges the authorization code for an access token, which authenticates the SDK session. Once authenticated, you can access Discord data:

```javascript
// Get current user, guild, channel
const user = await discordSdk.commands.getUser()
const guild = await discordSdk.commands.getGuild()
const participants = await discordSdk.commands.getInstanceConnectedParticipants()

// Subscribe to voice events
discordSdk.subscribe("SPEAKING_START", (event) => {
  console.log(`User ${event.user_id} started speaking`)
})
```

This voice integration capability—detecting when users speak—enables unique social experiences impossible with traditional bots. Activities are inherently **multiplayer by default**, with built-in awareness of who's in the voice channel and their states.

## Traditional bot API features: Command-driven interactions

While Activities handle rich web experiences, Discord's traditional Bot API provides powerful interaction capabilities through slash commands, message components, and embeds. These features excel at discrete interactions but have fundamental limitations for continuous, stateful experiences.

### Slash commands and message components

**Slash commands** integrate directly into Discord's native UI, appearing when users type "/". They support typed arguments (String, Integer, Number, Boolean, User, Role, Channel), autocomplete for dynamic suggestions, command groups for organization, and ephemeral responses for privacy. Discord allows **100 global commands + 100 guild-specific commands per app**, with up to 25 options per command and 25 predefined choices per option. Commands have a **3-second initial response window** and 15-minute follow-up window.

**Message components** provide interactive elements within messages:

- **Buttons**: Up to 25 per message (5 rows × 5 buttons) with 5 predefined styles (Primary, Secondary, Success, Danger, Link), custom labels, emojis, and 100-character custom IDs
- **Select menus**: 5 types (String Select, User Select, Role Select, Channel Select, Mentionable Select), each with up to 25 options, multi-select support (1-25 selections), and placeholders
- **Modals**: Pop-up forms with up to 5 text input fields (Short or Paragraph styles), character validation (min/max length), and 1,500 character total limit

### Embeds and webhooks

**Embeds** structure rich content with **6,000 total character limit** across all fields: 256-character titles, 4,096-character descriptions, up to 25 fields (256-char names, 1,024-char values), 2,048-character footers, images, thumbnails, and timestamps. Embeds support Markdown formatting and display beautifully across platforms, but they're **static content**—updates require editing the message, subject to rate limits.

**Webhooks** enable external services to post messages without bot authentication at **30 requests per 60 seconds per webhook**. They support custom usernames/avatars, embeds, and components, making them ideal for CI/CD notifications, monitoring alerts, or RSS feeds. However, webhooks are **one-way communication**—they cannot receive interaction responses directly, requiring a bot to handle button clicks or select menu choices on webhook-posted messages.

### Critical limitations for game-like experiences

Traditional bot features **cannot create real-time, continuous, or custom-rendered experiences**. They lack:

- **Real-time gameplay**: No action games, racing, or fighting—only turn-based interactions
- **Custom graphics**: Cannot render sprites, particle effects, animations, or use HTML5 Canvas/WebGL
- **Continuous updates**: Must rely on user interactions to trigger responses; no game loops
- **Persistent UI**: Messages scroll away as conversation continues; no always-visible interfaces
- **Live dashboards**: Message edits hit rate limits (5 actions/second per guild); no smooth chart animations
- **Collaborative editing**: No simultaneous multi-user interactions or operational transforms

For these use cases, **Activities are the only viable solution**. Traditional bot API is best for command-driven bots (moderation, utilities), simple forms and surveys, notifications, FAQ systems, and simple polls—not for rich interactive experiences.

## Official guidelines, best practices, and technical constraints

Discord's Developer Policy mandates strict privacy and security practices. Applications **must not collect login credentials, passwords, or authentication tokens**. Use API data only for stated functionality, respect user privacy settings, and keep tokens encrypted. Data aggregation requires de-identification. Applications must comply with Community Guidelines—no spam, malware, phishing, financial scams, or violations of intellectual property rights.

### Rate limits and quotas

**Global rate limit**: 50 requests per second across all endpoints. Per-route limits vary by endpoint, indicated by `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `X-RateLimit-Reset-After`, and `X-RateLimit-Bucket` headers. Implement throttling with exponential backoff. **Webhook limits**: 5 requests per 2 seconds per webhook, 30 messages per minute per channel. Special restrictions include **2 channel name/topic updates per 10 minutes**.

Gateway connections require proper heartbeat management. Message Content Intent is **required for verified bots** (enforced in API v10+), and intents are required for certain data like guild members and presences.

### Size and component limits

**Messages**: 2,000 characters maximum (exceeding sends as .txt file). **Embeds**: 6,000 characters total, with sub-limits per field. **File attachments**: 8MB for non-Nitro users, 100MB for Nitro (increased from 50MB in 2024). 

**Component maximums**: 25 buttons per message (5 rows × 5 buttons), 5 select menus per message (1 per ActionRow), 25 options per select menu, 5 text inputs per modal, 25 embed fields per embed, and 25 command options per slash command. **Custom IDs**: 100 characters. **Slash command data**: 4,000 characters combined across name, description, and value properties.

### Activities-specific constraints

**Content Security Policy** in Activities prevents direct external URL access without URL Mapping configuration. All network requests are proxied through Discord's infrastructure, adding potential latency. **Storage is unreliable**—localStorage/sessionStorage may not persist across sessions, requiring backend databases for persistence. IndexedDB may work but isn't guaranteed.

**Unverified Activities** during development can only be launched in servers with **fewer than 25 members** and are accessible only to app developers and invited app testers (up to 100 team members plus invited testers). **Verified Activities** have no server size limits, enable monetization, and appear in Discord's Activity launcher for all users.

**Monetization constraints**: In-App Purchases currently available only in **US, UK, EU** (desktop), with a maximum of **50 SKUs/in-game products per Activity**. Discord takes a standard platform fee. **Integration limits**: Servers have a 50-integration total limit, and Activities count toward this.

### Scaling and architecture best practices

For bots approaching **2,000 guilds, implement sharding** (mandatory at 2,500+). Best practice suggests ~1 shard per 1,000 guilds. Use databases (MongoDB, PostgreSQL, SQLite) instead of JSON files. Implement proper error handling, logging, and version control. Always use 2FA on developer accounts, validate and sanitize user inputs, and conduct regular security audits.

For Activities, optimize asset loading and minimize bundle sizes since running in an iframe adds overhead. Use the `@robojs/patch` package to automatically handle CSP compliance by patching network requests to comply with Discord Proxy rules. Test thoroughly on mobile—touch interactions need explicit handling, and screen size variations must be considered.

## 2024-2025 updates: Platform evolution and new capabilities

Discord has significantly enhanced its API capabilities throughout 2024-2025, with Activities representing the most transformative addition. The **March 2024 public launch** of the Embedded App SDK (previously limited developer preview) opened Activities to all developers. In **June 2024, Discord made all Activities free** for users (previously Nitro-only), dramatically expanding potential reach. **August 2024** brought the verification process for Activities, enabling public discovery and monetization.

### Performance and infrastructure improvements

**July 2024 updates** introduced **HEVC (H.265) video playback** on desktop/web with 25-50% better compression than H.264. Image upload compression improved by 14% in size and 9% in latency. Gateway bandwidth reduced by **~20% through delta updates**. Full Unicode support for attachment filenames was added.

**June 2024 updates** saw API upgraded to **Python 3.11**, achieving 5-10% latency reduction. GIF picker optimizations delivered 80% load time improvement on lower-end devices. Gateway zstd compression reduced bandwidth by 25%. AV1 hardware decoding launched for Windows, and picture-in-picture support arrived for mobile calls (iOS & Android).

**March 2025 patch notes** highlighted API deployment changes for improved reliability. Spotify embed latency improved by **~83% at p95**, with failures reduced by **~88%**. HDR to SDR tone-mapping enhancements improved video quality.

### API version status

**API v10** remains the current default version as of October 2025, with Message Content Intent enforcement for verified bots, improved localization support for slash commands, and enhanced gateway compression (zstd). **API v9** continues to be supported alongside v10 with no deprecation timeline announced. Earlier versions (v6, v7) have been decommissioned.

### Social SDK and platform features

The Social SDK received multiple updates including simplified mobile account linking via deep-linking, iOS 18.2+ echo canceller support, new `Client::GetRelationshipsByGroup` API, and AGC2 (Automatic Gain Control 2) extended to mobile. Additional platform features included **Roblox account linking**, usernameless/passwordless login with passkey support, and enhanced share experiences on Android.

### Discovery and monetization evolution

The **App Directory** launched for discovering Activities. **Premium Apps monetization** was introduced with requirements that prices must match or beat external platforms. The **Discord App Pitches 2024** awarded $30,000 to the top prize winner (Soulbound, a web3 meta-RPG), demonstrating Discord's commitment to fostering the developer ecosystem.

## Real-world examples: Activities and bots in production

Discord's ecosystem showcases diverse interactive experiences built with both Activities and traditional bot APIs. The contrast between implementations illustrates when each approach excels.

### Official Discord Activities

Discord's first-party Activities demonstrate the platform's capabilities. **Chess in the Park** offers classical chess with move history and customizable boards, requiring real-time state synchronization impossible with bot APIs. **Putt Party** delivers chaotic mini-golf with physics and power-ups, leveraging canvas rendering for smooth animations. **Watch Together** enables synchronized YouTube viewing with group playback controls—a shared media experience requiring persistent UI and real-time synchronization.

**Death By AI** represents a breakthrough case study: this GPT-powered interactive storytelling experience reached **7 million players within weeks** of launch using the Playroom multiplayer framework. **Gartic Phone** brings the drawing telephone game to Discord, requiring canvas drawing tools and real-time collaboration features that bot APIs cannot provide.

### Third-party Activities and integrations

**Soulbound**, winner of Discord App Pitches 2024, built a persistent MMO RPG entirely in Discord with dungeons, guilds, quests, co-op raids, and a community-driven world. The game demonstrates how Activities enable complex persistent state management across sessions.

**StableDreamer** (Stability.ai's Activity) integrates AI image generation directly into Discord, providing real-time feedback for UX improvement. This showcases how Activities enable AI tool integration with rich visual interfaces. **Memrise** brought its language learning platform to Discord as an Activity, demonstrating successful cross-platform app porting.

### High-engagement bot experiences

Traditional bot APIs power different interaction patterns. **Dank Memer** (877K+ servers) created an interactive economy system with virtual currency, meme generation, robbery mechanics, trading, and gambling—all through button-based interactions and embed displays. The bot generates server-wide social dynamics through discrete command interactions.

**Mudae** and **Karuta** operate massive card collection games with 70,000+ anime characters using command-driven rolling, claiming, and trading mechanics. These bots demonstrate how traditional APIs excel at turn-based, collection-oriented gameplay where custom graphics aren't required.

**MEE6** (3.37M+ servers) provides leveling systems, automated moderation, custom commands, and role rewards through slash commands and message monitoring. The bot includes a **web dashboard** (external to Discord) for configuration—a hybrid approach where complex configuration happens outside Discord while interaction happens through bot commands.

### Framework integrations and templates

The **Colyseus multiplayer framework** integrates with Activities through official examples, demonstrating room-based matchmaking by `channelId`, real-time state synchronization, and voice activity detection integration. **Phaser** (JavaScript game framework) provides Discord Activity templates with multiplayer support, enabling rapid game development for Discord.

**Robo.js** emerged as a framework specifically optimized for Discord Activities, offering file-based routing, automatic server management, plugin ecosystems, and streamlined development workflows. **Wonderland Engine** examples demonstrate 3D rendering with performant WebGL in Discord.

## Official documentation and developer resources

Discord provides comprehensive documentation across multiple platforms. The **Discord Developer Portal** (discord.com/developers/docs) serves as the main documentation hub covering REST API, Gateway API, Voice API, OAuth2, webhooks, and more. The **API Documentation GitHub repository** (github.com/discord/discord-api-docs) accepts community contributions under Creative Commons Attribution-ShareAlike 4.0 for docs and MIT for code samples.

### Activities-specific resources

The **Embedded App SDK** documentation at discord.com/developers/docs/activities/overview covers building multiplayer games and social experiences. The **SDK GitHub repository** (github.com/discord/embedded-app-sdk) hosts version 2.4.0 with the NPM package `@discord/embedded-app-sdk`. The **Examples repository** (github.com/discord/embedded-app-sdk-examples) provides starter templates using Node.js, React, and Vite, plus Phaser game framework examples, Colyseus multiplayer integration, and Wonderland Engine 3D rendering demonstrations.

Official starter templates can be initialized with:
```bash
npx create-robo@latest my-activity --template discord-activity
# OR
git clone https://github.com/discord/getting-started-activity
```

### Additional documentation sections

The **Rate Limits documentation** (discord.com/developers/docs/topics/rate-limits) provides comprehensive rate limiting guidance. The **Change Log** (discord.com/developers/docs/change-log) tracks official API version changes. **Developer Terms** and **Developer Policy** (support-dev.discord.com) outline legal requirements and rules updated July 8, 2024.

The **Discord Developers server** provides community support through #activities-dev-help and #api-help channels with direct access to Discord engineers. The **Discord Status Page** (discordstatus.com) offers real-time API status, incident reports, and monitoring.

### Community resources and tools

**Discord.js Guide** (discordjs.guide) provides comprehensive tutorials for JavaScript bot development, updated to v14 using API v10. **Discord.py Documentation** (discordpy.readthedocs.io) offers Python-specific implementations with detailed changelogs. **Pycord Guide** (guide.pycord.dev) documents rules, common practices, and best practices.

**Top.gg** serves as the largest Discord bot directory with trending bots and analytics. **RoboPlay** offers hosting optimized for Robo.js Activities. For local development, official templates include **Cloudflare Tunnel** for free tunneling, enabling testing without deployment.

## Verification process and production deployment

Unverified Activities during development face significant restrictions: they're accessible only to app developers and invited app testers, can only be launched in servers with **fewer than 25 members**, cannot enable monetization, and don't appear in Discord's Activity launcher for public users. To add testers, developers can add up to 100 team members through the Developer Portal or invite Discord friends as App Testers who must accept invitations via email.

**Verified Activities** unlock full platform capabilities: all Discord users can discover and launch them, no server size limits apply, monetization enables in-app purchases (US/UK/EU currently), and Activities appear in the launcher, search, and recommendations with rich presence in member lists and profiles.

### Steps to verification

The verification process requires: (1) building and testing your Activity thoroughly as unverified, (2) enabling Activities in Developer Portal settings, (3) completing discovery requirements including app description, privacy policy URL, terms of service URL, tags, categories, screenshots, and age rating, (4) submitting for verification by clicking "Enable Discovery" after reviewing all criteria.

Discord reviews Activities for compliance with Developer Terms of Service and Developer Policy, content appropriateness, technical functionality, and user safety. **Review typically takes 3-7 weeks**. Best practices suggest maintaining separate unverified (dev) and verified (production) Activities, testing thoroughly before verification, and building a Discord server for your Activity to gather community feedback.

### Deployment requirements

Activities must be **publicly accessible via HTTPS** with fast loading and 24/7 uptime recommended. Hosting options include Cloudflare Workers/Pages (recommended in official examples), Vercel (for Next.js/React apps), Railway (Node.js deployment), RoboPlay (optimized for Robo.js Activities), and traditional hosting (AWS, DigitalOcean).

Required environment variables:
```env
VITE_CLIENT_ID=your_discord_client_id
CLIENT_SECRET=your_discord_client_secret
```

## Key technical decisions: When to use Activities vs. bot API

The fundamental decision point is simple: **If your interaction model is request-response with predefined Discord components, use the Bot API. If you need custom rendering, real-time state, or game loops, use Activities.**

Bot APIs excel at command-driven interactions, configuration management, moderation actions, simple forms and surveys, notifications and alerts, FAQ systems, and simple polls. They're ideal when you can work within Discord's component limitations and don't need continuous state or custom graphics.

Activities are essential for multiplayer games requiring real-time updates, custom graphics with HTML5 Canvas or WebGL, continuous state management with game loops, collaborative tools with simultaneous editing, live dashboards with streaming data, creative tools for drawing/music/video, and immersive social experiences with rich media.

### Hybrid approaches

Many successful Discord applications use both approaches in combination: a bot handles commands, notifications, and server management, while an Activity provides core gameplay or interactive experiences. The bot can trigger Activity launches via slash commands, and Activities can report results back through bot messages for persistence in chat history.

**Example hybrid flow**:
1. User runs `/play game` (bot slash command)
2. Bot sends message with "Launch Game Activity" button
3. Button opens embedded game app (Activity with full web UI)
4. After game completion, Activity sends results to bot via webhook
5. Bot posts game summary in channel for persistent record

This pattern leverages the strengths of each approach: Activities for rich interactive experiences requiring custom UI, and bot APIs for integration with Discord's native features like persistent messages, notifications, and command discoverability.

## Conclusion: A transformed platform for web developers

Discord has fundamentally transformed from a communication platform into a full application platform through Activities. The iframe-embedded architecture with the Embedded App SDK enables developers to build complete JavaScript/React applications that run directly in Discord, accessing 200M+ monthly active users with built-in social context, voice integration, and multiplayer awareness.

The technical implementation is production-ready with comprehensive documentation, official React templates, framework support for any JavaScript stack, real-world examples demonstrating diverse use cases from games to AI tools, and a clear verification path to public distribution with monetization. The 2024-2025 updates demonstrate Discord's continued commitment to the platform with regular performance improvements, new capabilities, and ecosystem investments like the $30,000 App Pitches competition.

For developers building interactive experiences, the path forward is clear: Activities represent Discord's native solution for web-based applications, while traditional bot APIs remain powerful for command-driven interactions. The combination of both approaches enables sophisticated hybrid applications that leverage Discord's unique position as a social platform where users already spend significant time together.