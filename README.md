# WATCHER — Crypto Intelligence Agent

Autonomous crypto intelligence agent monitoring Base Network tokens in real-time.

## Stack

- **Next.js 14** — App Router + API Routes
- **TypeScript** — Full type safety
- **Tailwind CSS** — Utility styling
- **DexScreener API** — Public, no API key required
- **Conway Cloud** — Autonomous deployment + payments via x402/USDC

## Project Structure

```
watcher/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Main client shell
│   ├── globals.css         # Global styles + CSS variables
│   └── api/
│       └── tokens/
│           └── route.ts    # Server-side DexScreener proxy (5min ISR)
├── components/
│   ├── Topbar.tsx          # Header with logo + live stats
│   ├── Sidebar.tsx         # Navigation
│   ├── MetricCard.tsx      # Stats cards
│   ├── TokenTable.tsx      # Sortable token table
│   ├── SpikeAlerts.tsx     # Spike detection list
│   ├── AgentAPI.tsx        # API docs + live terminal
│   ├── SkillDoc.tsx        # SKILL.md viewer + download
│   └── PythonScript.tsx    # Syntax-highlighted Python source
├── lib/
│   ├── types.ts            # Shared TypeScript interfaces
│   └── dexscreener.ts      # Fetch + metric extraction utils
├── public/
│   ├── logo.png            # Watcher logo (512x512)
│   └── banner.png          # Watcher banner (1500x500)
└── README.md
```

## Setup

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build
npm start
```

## Environment Variables

No required env vars for basic operation — DexScreener API is public.

For Telegram alerts from the Python agent:

```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

## Python Agent

The standalone Python monitoring agent is viewable/downloadable in the **Python Script** tab.

```bash
pip install requests python-dotenv
cp .env.example .env   # add Telegram credentials
python watcher_agent.py
```

## Conway Deployment

```bash
# 1. Install Conway Terminal
npx conway-terminal

# 2. Agent generates its own EVM wallet automatically

# 3. Deploy to Conway Cloud (agent pays with USDC via x402)
npx conway deploy

# 4. Domain registered autonomously via Conway Domains
```

## Features

- **Real-time monitoring** — 5 minute polling cycle, auto-refresh
- **Spike detection** — Volume 1h vs historical hourly average (ratio ≥ 3x)
- **Agent API** — REST endpoints for external agent integration
- **SKILL.md** — Machine-readable integration documentation
- **Webhook subscriptions** — Push alerts to external agents
- **Autonomous operation** — Self-funded via Conway + USDC
