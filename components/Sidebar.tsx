'use client'

import type { Section } from '@/lib/types'

interface SidebarProps {
  active:    Section
  onChange:  (s: Section) => void
}

const NAV = [
  { section: 'monitor', label: null },
  { section: 'dashboard',  label: 'Dashboard',     icon: '◈' },
  { section: 'spikes',     label: 'Spike Alerts',  icon: '⚡' },
  { section: 'integration', label: null },
  { section: 'agent-api',  label: 'Agent API',     icon: '⬡' },
  { section: 'skill',      label: 'SKILL.md',      icon: '◉' },
  { section: 'source', label: null },
  { section: 'script',     label: 'Python Script', icon: '▸' },
] as const

export default function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <nav
      className="flex flex-col gap-1 py-6"
      style={{
        background: '#0d0d12',
        borderRight: '1px solid #1c1c28',
        width: 220,
      }}
    >
      {NAV.map((item) => {
        // Section header (no label = group header)
        if (item.label === null) {
          return (
            <div
              key={item.section}
              style={{
                padding: '8px 16px 4px',
                fontSize: 9,
                color: '#44445a',
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              {item.section}
            </div>
          )
        }

        const isActive = active === item.section
        return (
          <button
            key={item.section}
            onClick={() => onChange(item.section as Section)}
            className="flex items-center gap-2.5 text-left transition-all duration-150"
            style={{
              padding: '10px 20px',
              fontSize: 12,
              color: isActive ? '#00ff88' : '#666680',
              borderLeft: `2px solid ${isActive ? '#00ff88' : 'transparent'}`,
              background: isActive ? 'rgba(0,255,136,0.08)' : 'transparent',
              cursor: 'pointer',
              border: 'none',
              borderLeft: `2px solid ${isActive ? '#00ff88' : 'transparent'}`,
              width: '100%',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </button>
        )
      })}

      {/* Footer */}
      <div
        className="mt-auto"
        style={{
          padding: '16px 20px',
          borderTop: '1px solid #1c1c28',
          fontSize: 10,
          color: '#44445a',
          lineHeight: 1.7,
          marginTop: 'auto',
        }}
      >
        WATCHER v1.0<br />
        Powered by Conway<br />
        Data: DexScreener API<br />
        <span style={{ color: '#00ff88' }}>●</span> Autonomous agent active
      </div>
    </nav>
  )
}
