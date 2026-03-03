'use client'

import { useState } from 'react'
import type { Token, SortKey } from '@/lib/types'
import { fmtUsd, fmtPrice } from '@/lib/dexscreener'

interface TokenTableProps {
  tokens: Token[]
}

function ChangeCell({ pct }: { pct: number }) {
  const color = pct > 0 ? '#00ff88' : pct < 0 ? '#ff3355' : '#666680'
  const sign  = pct > 0 ? '↑' : pct < 0 ? '↓' : ''
  return <span style={{ color }}>{sign}{Math.abs(pct).toFixed(1)}%</span>
}

function SpikeBadge({ ratio }: { ratio: number }) {
  if (ratio >= 5)
    return (
      <span
        className="animate-flicker"
        style={{
          display: 'inline-block',
          background: 'rgba(255,51,85,0.12)',
          border: '1px solid #ff3355',
          color: '#ff3355',
          fontSize: 9,
          padding: '2px 6px',
          letterSpacing: 1,
        }}
      >
        ⚡ SPIKE
      </span>
    )
  if (ratio >= 2)
    return (
      <span
        style={{
          display: 'inline-block',
          background: 'rgba(255,204,0,0.1)',
          border: '1px solid #ffcc00',
          color: '#ffcc00',
          fontSize: 9,
          padding: '2px 6px',
          letterSpacing: 1,
        }}
      >
        🔥 HOT
      </span>
    )
  return null
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'vol24h',   label: 'VOL 24H'  },
  { key: 'vol1h',    label: 'VOL 1H'   },
  { key: 'mcap',     label: 'MCAP'     },
  { key: 'change24h',label: 'Δ 24H'    },
]

export default function TokenTable({ tokens }: TokenTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('vol24h')

  const sorted = [...tokens]
    .sort((a, b) => b[sortKey] - a[sortKey])
    .slice(0, 20)

  return (
    <div style={{ background: '#0d0d12', border: '1px solid #1c1c28', overflow: 'hidden' }}>
      {/* Table header */}
      <div
        className="flex items-center justify-between"
        style={{ padding: '14px 20px', borderBottom: '1px solid #1c1c28' }}
      >
        <span style={{ fontSize: 11, color: '#00ff88', letterSpacing: 2, textTransform: 'uppercase' }}>
          TOP TOKENS — BASE NETWORK
        </span>
        <div className="flex gap-2">
          {SORT_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              style={{
                background: 'transparent',
                border: `1px solid ${sortKey === key ? '#00ff88' : '#1c1c28'}`,
                color: sortKey === key ? '#00ff88' : '#666680',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                padding: '4px 10px',
                cursor: 'pointer',
                letterSpacing: 1,
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#131318' }}>
              {['#','TOKEN','PRICE','MCAP','VOL 1H','VOL 6H','VOL 24H','LIQUIDITY','Δ 1H','Δ 24H','STATUS','LINK'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    fontSize: 9,
                    color: '#44445a',
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #1c1c28',
                    whiteSpace: 'nowrap',
                    fontWeight: 400,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={12} style={{ textAlign: 'center', padding: 40, color: '#44445a', letterSpacing: 2 }}>
                  NO DATA AVAILABLE
                </td>
              </tr>
            )}
            {sorted.map((t, i) => (
              <tr
                key={t.pairAddress || i}
                style={{ borderBottom: '1px solid #1c1c28', transition: 'background 0.1s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,255,136,0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '12px 14px', color: '#44445a' }}>#{i + 1}</td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#d8d8e8' }}>{t.symbol}</span>
                    <span style={{ fontSize: 10, color: '#44445a', textTransform: 'uppercase' }}>{t.dex}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 14px', color: '#d8d8e8', fontWeight: 600 }}>
                  ${fmtPrice(t.priceUsd)}
                </td>
                <td style={{ padding: '12px 14px' }}>{fmtUsd(t.mcap)}</td>
                <td style={{ padding: '12px 14px' }}>{fmtUsd(t.vol1h)}</td>
                <td style={{ padding: '12px 14px' }}>{fmtUsd(t.vol6h)}</td>
                <td style={{ padding: '12px 14px' }}>{fmtUsd(t.vol24h)}</td>
                <td style={{ padding: '12px 14px' }}>{fmtUsd(t.liqUsd)}</td>
                <td style={{ padding: '12px 14px' }}><ChangeCell pct={t.change1h} /></td>
                <td style={{ padding: '12px 14px' }}><ChangeCell pct={t.change24h} /></td>
                <td style={{ padding: '12px 14px' }}><SpikeBadge ratio={t.spikeRatio} /></td>
                <td style={{ padding: '12px 14px' }}>
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#00ff88', textDecoration: 'none', opacity: 0.7, fontSize: 13 }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                  >
                    →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
