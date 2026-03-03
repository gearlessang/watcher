'use client'

export default function SkillDoc() {
  const download = () => {
    const content = document.getElementById('skill-content')?.innerText ?? ''
    const blob = new Blob([content], { type: 'text/markdown' })
    const a    = document.createElement('a')
    a.href     = URL.createObjectURL(blob)
    a.download = 'SKILL.md'
    a.click()
  }

  return (
    <div>
      <div className="flex items-end justify-between pb-4" style={{ borderBottom: '1px solid #1c1c28' }}>
        <div>
          <div className="font-display" style={{ fontSize: 36, letterSpacing: 2, color: '#d8d8e8' }}>
            SKILL.MD
          </div>
          <div style={{ fontSize: 11, color: '#666680', marginTop: 4, letterSpacing: 1 }}>
            Documentation for external agents to integrate with WATCHER
          </div>
        </div>
        <button
          onClick={download}
          style={{
            background: 'rgba(0,255,136,0.12)',
            border: '1px solid #00ff88',
            color: '#00ff88',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            padding: '8px 16px',
            cursor: 'pointer',
            letterSpacing: 1,
          }}
        >
          ↓ DOWNLOAD .MD
        </button>
      </div>

      <div
        id="skill-content"
        style={{
          background: '#0d0d12',
          border: '1px solid #1c1c28',
          padding: 28,
          fontSize: 12,
          lineHeight: 1.8,
          marginTop: 20,
        }}
      >
        <SkillSection title="WATCHER — SKILL.md">
          <p>
            This document defines how any MCP or HTTP-compatible AI agent can interact with the WATCHER
            system to retrieve token data, subscribe to alerts, and publish information.
          </p>
        </SkillSection>
        <hr style={{ border: 'none', borderTop: '1px solid #1c1c28', margin: '20px 0' }} />

        <SkillSection title="Description">
          <p>
            WATCHER is an autonomous journalist agent that monitors tokens on Base Network (and other EVM
            chains) using the public DexScreener API. It publishes real-time rankings and detects volume spikes.
          </p>
          <p>
            <strong>Base URL:</strong> <code>https://watcher.agent.xyz</code> (configurable via Conway Domains)
          </p>
          <p>
            <strong>Auth:</strong> API key in header <code>X-Agent-Key</code> (obtained on registration)
          </p>
        </SkillSection>
        <hr style={{ border: 'none', borderTop: '1px solid #1c1c28', margin: '20px 0' }} />

        <SkillSection title="When to use this skill">
          <ul style={{ paddingLeft: 20 }}>
            {[
              'When you need real-time token data from Base / Solana / BSC',
              'When you want to know which tokens have the most activity right now',
              'When you need to detect unusual volume opportunities',
              'When you want to subscribe to automatic spike alerts',
              "When your agent needs market data to support a decision",
            ].map((item) => (
              <li key={item} style={{ marginBottom: 4 }}>{item}</li>
            ))}
          </ul>
        </SkillSection>
        <hr style={{ border: 'none', borderTop: '1px solid #1c1c28', margin: '20px 0' }} />

        <SkillSection title="Endpoints">
          <SubTitle>1. Top tokens by volume</SubTitle>
          <CodeLine>GET /api/v1/top-tokens?chain=base&amp;limit=10&amp;min_vol_24h=50000</CodeLine>
          <p>Returns tokens sorted by 24h volume. Filter with <code>min_vol_24h</code> and <code>min_liq</code>.</p>

          <SubTitle>2. Active spikes</SubTitle>
          <CodeLine>GET /api/v1/spikes?threshold=3.0&amp;chain=base</CodeLine>
          <p>Returns tokens whose 1h volume exceeds <code>threshold</code> times their historical hourly average.</p>

          <SubTitle>3. Specific token</SubTitle>
          <CodeLine>GET /api/v1/token/0xf406574...</CodeLine>
          <p>Full price, volume, liquidity, change, and metrics data for a specific token.</p>

          <SubTitle>4. Subscribe webhook</SubTitle>
          <CodeLine>{`POST /api/v1/subscribe\nBody: {"webhook_url": "https://my-agent.xyz/hook", "threshold": 3.0}`}</CodeLine>
          <p>
            Registers your agent to receive automatic notifications when a spike is detected.
            Payload includes an EVM <code>signature</code> to verify message authenticity.
          </p>
        </SkillSection>
        <hr style={{ border: 'none', borderTop: '1px solid #1c1c28', margin: '20px 0' }} />

        <SkillSection title="Response Fields">
          <ul style={{ paddingLeft: 20 }}>
            {[
              ['symbol',            'Token ticker (e.g. TGATE)'],
              ['address',           'Contract address'],
              ['price_usd',         'Current price in USD'],
              ['mcap',              'Market cap in USD'],
              ['vol_1h/6h/24h',     'Volume by period'],
              ['liq_usd',           'Total pool liquidity in USD'],
              ['change_1h/24h',     'Price change %'],
              ['spike_ratio',       'Ratio vs hourly average (>3 = spike)'],
              ['dex',               'Exchange (uniswap, aerodrome, etc)'],
              ['url',               'Direct DexScreener link'],
            ].map(([field, desc]) => (
              <li key={field} style={{ marginBottom: 4 }}>
                <code>{field}</code> — {desc}
              </li>
            ))}
          </ul>
        </SkillSection>
        <hr style={{ border: 'none', borderTop: '1px solid #1c1c28', margin: '20px 0' }} />

        <SkillSection title="Rate Limits">
          <ul style={{ paddingLeft: 20 }}>
            <li>No API key: 10 requests/min (public mode)</li>
            <li>With API key: 300 requests/min</li>
            <li>Webhooks: max 50 subscribers per instance</li>
          </ul>
        </SkillSection>
        <hr style={{ border: 'none', borderTop: '1px solid #1c1c28', margin: '20px 0' }} />

        <SkillSection title="Conway Integration">
          <p>
            This agent runs on Conway Cloud with its own EVM identity at{' '}
            <code>~/.conway/wallet.json</code>. It pays for its own hosting and domain with USDC
            via the x402 protocol. No human intervention required to keep it alive.
          </p>
          <p>
            To deploy your own instance: <code>npx conway-terminal</code> and follow Conway Cloud
            instructions.
          </p>
        </SkillSection>
      </div>
    </div>
  )
}

function SkillSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <h2
        className="font-display"
        style={{ fontSize: 24, letterSpacing: 2, color: '#00ff88', marginBottom: 8, marginTop: 24 }}
      >
        {title}
      </h2>
      <div style={{ color: '#666680' }}>{children}</div>
    </div>
  )
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: 13,
        color: '#ffcc00',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 6,
        marginTop: 16,
      }}
    >
      {children}
    </h3>
  )
}

function CodeLine({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#060608',
        border: '1px solid #252535',
        padding: '8px 12px',
        fontSize: 11,
        color: '#00ff88',
        marginBottom: 8,
        whiteSpace: 'pre',
        overflowX: 'auto',
      }}
    >
      {children}
    </div>
  )
}
