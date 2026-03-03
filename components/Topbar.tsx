'use client'

import Image from 'next/image'

interface TopbarProps {
  pairs:   number
  alerts:  number
  lastUtc: string
}

export default function Topbar({ pairs, alerts, lastUtc }: TopbarProps) {
  return (
    <header
      className="col-span-2 flex items-center gap-5 px-6 sticky top-0 z-50"
      style={{
        background: '#0d0d12',
        borderBottom: '1px solid #1c1c28',
        height: 56,
      }}
    >
      {/* Logo + wordmark */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <Image src="/logo.png" alt="Watcher" width={36} height={36} priority />
        <span
          className="font-display glow-green tracking-widest"
          style={{ fontSize: 22, color: '#00ff88', letterSpacing: 4 }}
        >
          WATCHER
        </span>
        <span style={{ color: '#44445a', fontSize: 13 }}>// AGENT</span>
      </div>

      {/* Stats */}
      <div className="flex gap-6 ml-8">
        <Stat label="Chain"             value="BASE" />
        <Stat label="Active Pairs"      value={pairs > 0 ? String(pairs) : '—'} />
        <Stat label="Last Updated (UTC)" value={lastUtc || '—'} />
        <Stat
          label="Active Alerts"
          value={String(alerts)}
          valueStyle={{ color: alerts > 0 ? '#ff3355' : '#00ff88' }}
        />
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 ml-auto">
        <span
          className="animate-pulse rounded-full"
          style={{ width: 8, height: 8, background: '#00ff88', boxShadow: '0 0 8px #00ff88', display: 'inline-block' }}
        />
        <span style={{ fontSize: 10, color: '#00ff88', letterSpacing: 1 }}>LIVE</span>
      </div>
    </header>
  )
}

function Stat({
  label,
  value,
  valueStyle,
}: {
  label: string
  value: string
  valueStyle?: React.CSSProperties
}) {
  return (
    <div className="flex flex-col">
      <span style={{ fontSize: 9, color: '#44445a', letterSpacing: 2, textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ fontSize: 13, color: '#00ff88', fontWeight: 600, ...valueStyle }}>
        {value}
      </span>
    </div>
  )
}
