'use client'

import { useState } from 'react'

function EndpointBlock({
  method,
  path,
  desc,
  params,
}: {
  method: 'GET' | 'POST'
  path: string
  desc: string
  params?: { name: string; type: string; desc: string }[]
}) {
  return (
    <div
      style={{
        background: '#060608',
        border: '1px solid #252535',
        padding: '12px 14px',
        marginBottom: 12,
        fontSize: 11,
        lineHeight: 1.7,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          background: 'rgba(0,255,136,0.12)',
          border: '1px solid #00ff88',
          color: '#00ff88',
          fontSize: 9,
          padding: '2px 8px',
          marginRight: 8,
          letterSpacing: 1,
        }}
      >
        {method}
      </span>
      <span style={{ color: '#d8d8e8', fontWeight: 600 }}>{path}</span>
      <div style={{ color: '#666680', fontSize: 10, marginTop: 6 }}>{desc}</div>
      {params && (
        <div style={{ marginTop: 8 }}>
          {params.map((p) => (
            <div
              key={p.name}
              style={{
                display: 'flex',
                gap: 8,
                fontSize: 11,
                color: '#666680',
                padding: '3px 0',
                borderBottom: '1px solid #1c1c28',
              }}
            >
              <span style={{ color: '#4488ff', minWidth: 120 }}>{p.name}</span>
              <span style={{ color: '#ffcc00', minWidth: 60 }}>{p.type}</span>
              <span>{p.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CodeBlock({ children, copyText }: { children: React.ReactNode; copyText: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(copyText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div
      style={{
        background: '#060608',
        border: '1px solid #252535',
        padding: '14px 16px',
        fontSize: 11,
        lineHeight: 1.8,
        overflowX: 'auto',
        position: 'relative',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <button
        onClick={copy}
        style={{
          position: 'absolute',
          top: 8, right: 8,
          background: '#131318',
          border: '1px solid #1c1c28',
          color: '#666680',
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          padding: '3px 8px',
          cursor: 'pointer',
          letterSpacing: 1,
        }}
      >
        {copied ? '✓ COPIED' : 'COPY'}
      </button>
      {children}
    </div>
  )
}

function Panel({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0d0d12', border: '1px solid #1c1c28' }}>
      <div
        style={{
          background: '#131318',
          borderBottom: '1px solid #1c1c28',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span>{icon}</span>
        <span style={{ fontSize: 11, color: '#00ff88', letterSpacing: 2, textTransform: 'uppercase' }}>
          {title}
        </span>
      </div>
      <div style={{ padding: 18 }}>{children}</div>
    </div>
  )
}

const SPIKE_RESPONSE = `{
  "status": "ok",
  "timestamp": "2026-02-19T03:00:00Z",
  "chain": "base",
  "spikes": [
    {
      "symbol": "TGATE",
      "address": "0xf406...",
      "price_usd": 0.053729,
      "mcap": 372000,
      "vol_1h": 89000,
      "vol_24h": 1700000,
      "liq_usd": 177000,
      "change_1h": 187.4,
      "spike_ratio": 12.8,
      "dex": "uniswap",
      "url": "https://dexscreener.com/..."
    }
  ]
}`

const WEBHOOK_PAYLOAD = `{
  "event": "spike_detected",
  "agent": "watcher-v1",
  "token": {
    "symbol": "TGATE",
    "spike_ratio": 12.8,
    "vol_1h": 89000,
    "change_1h": 187.4,
    "urgency": "HIGH"
  },
  "suggested_action": "INVESTIGATE",
  "signature": "0xabc123..."
}`

export default function AgentAPI() {
  const [query, setQuery]   = useState('WETH')
  const [result, setResult] = useState('// Enter a token and run the query to see live DexScreener data...')
  const [loading, setLoading] = useState(false)

  const runQuery = async () => {
    if (!query.trim()) return
    setLoading(true)
    setResult('// Executing query...')
    try {
      const res = await fetch(
        `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(query)}`
      )
      const data = await res.json()
      const pairs = (data.pairs ?? [])
        .filter((p: { chainId?: string }) => p.chainId === 'base')
        .slice(0, 3)
        .map((p: {
          baseToken?: { symbol?: string }
          priceUsd?: string
          volume?: { h24?: number }
          marketCap?: number
          priceChange?: { h1?: number }
          dexId?: string
          url?: string
        }) => ({
          symbol:   p.baseToken?.symbol,
          price:    '$' + parseFloat(p.priceUsd ?? '0').toFixed(6),
          vol_24h:  p.volume?.h24,
          mcap:     p.marketCap,
          change1h: (p.priceChange?.h1 ?? 0).toFixed(1) + '%',
          dex:      p.dexId,
          url:      p.url,
        }))
      if (!pairs.length) {
        setResult(`// No results on Base for "${query}"\n// Try another token or chain`)
      } else {
        setResult(JSON.stringify(pairs, null, 2))
      }
    } catch (e) {
      setResult('// Error: ' + String(e))
    }
    setLoading(false)
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
      }}
    >
      {/* Endpoints */}
      <Panel icon="◈" title="Available Endpoints">
        <EndpointBlock
          method="GET"
          path="/api/v1/top-tokens"
          desc="Returns top tokens by 24h volume on Base. Configurable filters."
          params={[
            { name: 'chain',       type: 'string',  desc: 'base | solana | bsc' },
            { name: 'limit',       type: 'integer', desc: 'Max results (default: 10)' },
            { name: 'min_vol_24h', type: 'number',  desc: 'Minimum volume in USD' },
            { name: 'min_liq',     type: 'number',  desc: 'Minimum liquidity in USD' },
          ]}
        />
        <EndpointBlock
          method="GET"
          path="/api/v1/spikes"
          desc="Returns tokens with active volume spike (ratio ≥ threshold)."
          params={[
            { name: 'threshold', type: 'number', desc: 'Minimum ratio (default: 3.0)' },
            { name: 'chain',     type: 'string', desc: 'Chain to filter' },
          ]}
        />
        <EndpointBlock
          method="GET"
          path="/api/v1/token/{address}"
          desc="Full data for a specific token by contract address."
        />
        <EndpointBlock
          method="POST"
          path="/api/v1/subscribe"
          desc="Subscribe an external agent to spike alerts via webhook."
          params={[
            { name: 'webhook_url', type: 'string', desc: 'Receiving agent URL' },
            { name: 'threshold',   type: 'number', desc: 'Spike ratio to notify' },
            { name: 'chains',      type: 'array',  desc: 'Chains to monitor' },
          ]}
        />
      </Panel>

      {/* Live terminal */}
      <Panel icon="⬡" title="Live Terminal">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 10, color: '#44445a', letterSpacing: 1 }}>
            QUERY DEXSCREENER DIRECTLY
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runQuery()}
            placeholder="e.g. WETH, USDC, cbBTC..."
            style={{
              background: '#060608',
              border: '1px solid #252535',
              color: '#00ff88',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              padding: '10px 14px',
              outline: 'none',
              width: '100%',
            }}
          />
          <button
            onClick={runQuery}
            disabled={loading}
            style={{
              background: 'rgba(0,255,136,0.12)',
              border: '1px solid #00ff88',
              color: '#00ff88',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              padding: 10,
              cursor: 'pointer',
              letterSpacing: 2,
              transition: 'all 0.15s',
            }}
          >
            {loading ? '// LOADING...' : '▸ RUN QUERY'}
          </button>
          <pre
            style={{
              background: '#060608',
              border: '1px solid #252535',
              padding: '12px 14px',
              fontSize: 10,
              color: '#666680',
              minHeight: 80,
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              overflowX: 'auto',
            }}
          >
            {result}
          </pre>
        </div>
      </Panel>

      {/* Response format */}
      <Panel icon="◉" title="Response Format">
        <CodeBlock copyText={SPIKE_RESPONSE}>
          <pre style={{ color: '#b8b8d8', margin: 0 }}>
            <span style={{ color: '#44445a' }}>{'// GET /api/v1/spikes\n'}</span>
            {SPIKE_RESPONSE}
          </pre>
        </CodeBlock>
      </Panel>

      {/* Webhook payload */}
      <Panel icon="▸" title="Webhook Payload (agents)">
        <p style={{ fontSize: 10, color: '#666680', marginBottom: 10, lineHeight: 1.6 }}>
          When a spike is detected, WATCHER POSTs to all subscribed agents with this payload.
          Your agent can react by buying, alerting, or storing the data.
        </p>
        <CodeBlock copyText={WEBHOOK_PAYLOAD}>
          <pre style={{ color: '#b8b8d8', margin: 0 }}>
            <span style={{ color: '#44445a' }}>{'// POST → your-agent.xyz/webhook\n'}</span>
            {WEBHOOK_PAYLOAD}
          </pre>
        </CodeBlock>
      </Panel>
    </div>
  )
}
