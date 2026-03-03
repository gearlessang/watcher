import type { Token } from '@/lib/types'
import { fmtUsd } from '@/lib/dexscreener'

interface SpikeAlertsProps {
  spikes: Token[]
}

export default function SpikeAlerts({ spikes }: SpikeAlertsProps) {
  if (spikes.length === 0) {
    return (
      <div
        style={{
          background: '#0d0d12',
          border: '1px solid #1c1c28',
          padding: 40,
          textAlign: 'center',
          color: '#44445a',
          fontSize: 12,
          letterSpacing: 2,
        }}
      >
        ✓ NO SPIKES DETECTED — market is calm
      </div>
    )
  }

  const sorted = [...spikes].sort((a, b) => b.spikeRatio - a.spikeRatio)

  return (
    <div className="flex flex-col gap-2.5">
      {sorted.map((t) => (
        <div
          key={t.pairAddress}
          style={{
            background: '#0d0d12',
            border: '1px solid #1c1c28',
            borderLeft: '3px solid #ff3355',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            animation: 'slideIn 0.3s ease both',
          }}
        >
          <span style={{ fontSize: 20, flexShrink: 0 }}>⚡</span>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#ff3355', marginBottom: 3 }}>
              {t.symbol} — {t.name}
            </div>
            <div style={{ fontSize: 11, color: '#666680' }}>
              {t.dex.toUpperCase()} · Vol 1h: {fmtUsd(t.vol1h)} ·{' '}
              MCap: {fmtUsd(t.mcap)} · Δ1h: {t.change1h.toFixed(1)}% ·{' '}
              Liq: {fmtUsd(t.liqUsd)}
              <br />
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#00ff88', textDecoration: 'none' }}
              >
                View on DexScreener →
              </a>
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#ff3355' }}>
              {t.spikeRatio.toFixed(1)}x
            </div>
            <div style={{ fontSize: 9, color: '#44445a', letterSpacing: 1 }}>SPIKE RATIO</div>
          </div>
        </div>
      ))}
    </div>
  )
}
