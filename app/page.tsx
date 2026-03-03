'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Topbar from '@/components/Topbar'
import Sidebar from '@/components/Sidebar'
import MetricCard from '@/components/MetricCard'
import TokenTable from '@/components/TokenTable'
import SpikeAlerts from '@/components/SpikeAlerts'
import AgentAPI from '@/components/AgentAPI'
import SkillDoc from '@/components/SkillDoc'
import PythonScript from '@/components/PythonScript'
import type { Token, Section } from '@/lib/types'
import { fmtUsd } from '@/lib/dexscreener'

export default function Home() {
  const [section, setSection] = useState<Section>('dashboard')
  const [tokens,  setTokens]  = useState<Token[]>([])
  const [spikes,  setSpikes]  = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUtc, setLastUtc] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/tokens')
      const data = await res.json()
      setTokens(data.tokens  ?? [])
      setSpikes(data.spikes  ?? [])
      setLastUtc(new Date().toISOString().substring(11, 16) + ' UTC')
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [load])

  const top10     = tokens.slice(0, 10)
  const totalVol  = top10.reduce((s, t) => s + t.vol24h, 0)
  const avgMcap   = top10.length ? top10.reduce((s, t) => s + t.mcap, 0) / top10.length : 0

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gridTemplateRows: '56px 1fr',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Topbar */}
      <Topbar
        pairs={tokens.length}
        alerts={spikes.length}
        lastUtc={lastUtc}
      />

      {/* Sidebar */}
      <Sidebar active={section} onChange={setSection} />

      {/* Main */}
      <main style={{ padding: '28px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── DASHBOARD ─────────────────────────────────── */}
        {section === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <PageHeader
              title="DASHBOARD"
              subtitle="Top tokens by volume · Base Network · DexScreener live data"
              action={
                <RefreshBtn loading={loading} onClick={load} />
              }
            />

            {/* Banner */}
            <div style={{ border: '1px solid #1c1c28', overflow: 'hidden' }}>
              <Image
                src="/banner.png"
                alt="Watcher Banner"
                width={1500}
                height={500}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                priority
              />
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              <MetricCard label="Total Vol 24h"    value={loading ? '—' : fmtUsd(totalVol)}  sub="Top 10 tokens"       accent="green"  />
              <MetricCard label="Avg Market Cap"   value={loading ? '—' : fmtUsd(avgMcap)}   sub="Top 10 tokens"       accent="yellow" />
              <MetricCard label="Spikes Detected"  value={loading ? '—' : spikes.length}     sub="Ratio > 3x average"  accent="red"    />
              <MetricCard label="Pairs Analyzed"   value={loading ? '—' : tokens.length}     sub="Quality filtered"    accent="blue"   />
            </div>

            {/* Table */}
            {loading ? <LoadingBlock /> : <TokenTable tokens={tokens} />}
          </div>
        )}

        {/* ── SPIKE ALERTS ──────────────────────────────── */}
        {section === 'spikes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <PageHeader
              title="SPIKE ALERTS"
              subtitle="Tokens with 1h volume exceeding 3x their historical hourly average"
              action={<RefreshBtn loading={loading} onClick={load} />}
            />
            {loading ? <LoadingBlock /> : <SpikeAlerts spikes={spikes} />}
          </div>
        )}

        {/* ── AGENT API ─────────────────────────────────── */}
        {section === 'agent-api' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <PageHeader
              title="AGENT API"
              subtitle="Endpoints for external agent integration · REST · JSON"
            />
            <AgentAPI />
          </div>
        )}

        {/* ── SKILL.MD ──────────────────────────────────── */}
        {section === 'skill' && <SkillDoc />}

        {/* ── PYTHON SCRIPT ─────────────────────────────── */}
        {section === 'script' && <PythonScript />}

      </main>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────

function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle: string
  action?: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingBottom: 16,
        borderBottom: '1px solid #1c1c28',
      }}
    >
      <div>
        <div className="font-display" style={{ fontSize: 36, letterSpacing: 2, color: '#d8d8e8', lineHeight: 1 }}>
          {title}
        </div>
        <div style={{ fontSize: 11, color: '#666680', marginTop: 4, letterSpacing: 1 }}>
          {subtitle}
        </div>
      </div>
      {action}
    </div>
  )
}

function RefreshBtn({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button
      disabled={loading}
      onClick={onClick}
      style={{
        background: 'rgba(0,255,136,0.12)',
        border: '1px solid #00ff88',
        color: '#00ff88',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        padding: '8px 16px',
        cursor: loading ? 'not-allowed' : 'pointer',
        letterSpacing: 1,
        opacity: loading ? 0.5 : 1,
        transition: 'all 0.15s',
      }}
    >
      {loading ? '↻ LOADING...' : '↻ REFRESH'}
    </button>
  )
}

function LoadingBlock() {
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
      <span
        style={{
          display: 'inline-block',
          width: 16, height: 16,
          border: '2px solid #1c1c28',
          borderTopColor: '#00ff88',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginRight: 8,
          verticalAlign: 'middle',
        }}
      />
      LOADING DATA...
    </div>
  )
}
