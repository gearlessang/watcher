'use client'

import { useState } from 'react'

type Tab = 'config' | 'collector' | 'alerts' | 'loop'

const TABS: { id: Tab; label: string }[] = [
  { id: 'config',    label: 'CONFIG'         },
  { id: 'collector', label: 'DATA COLLECTOR' },
  { id: 'alerts',    label: 'ALERTS'         },
  { id: 'loop',      label: 'MAIN LOOP'      },
]

const SCRIPT_LINES = [
  'import requests, time, os',
  'from datetime import datetime',
  'from dotenv import load_dotenv',
  '',
  'load_dotenv()',
  '',
  'CHAINS = ["base"]',
  'POLL_INTERVAL_SECONDS = 300',
  'VOLUME_SPIKE_THRESHOLD = 3.0',
  'MIN_VOLUME_24H = 50_000',
  'MIN_LIQUIDITY = 10_000',
  'TOP_N = 10',
  '',
  'TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")',
  'TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")',
  'BASE_URL = "https://api.dexscreener.com"',
  '',
  'def get_top_pairs_by_volume(chain):',
  '    pairs = []',
  '    try:',
  '        resp = requests.get(BASE_URL + "/token-boosts/top/v1", timeout=10)',
  '        boosted = [t for t in resp.json() if t.get("chainId") == chain]',
  '        for token in boosted[:20]:',
  '            addr = token.get("tokenAddress")',
  '            if addr:',
  '                url = BASE_URL + "/token-pairs/v1/" + chain + "/" + addr',
  '                r = requests.get(url, timeout=10)',
  '                if r.ok and isinstance(r.json(), list):',
  '                    pairs.extend(r.json())',
  '    except Exception as e:',
  '        print("[WARN]", e)',
  '    return pairs',
  '',
  'def extract_metrics(pair):',
  '    try:',
  '        volume = pair.get("volume", {})',
  '        vol_1h  = float(volume.get("h1", 0) or 0)',
  '        vol_24h = float(volume.get("h24", 0) or 0)',
  '        liq_usd = float((pair.get("liquidity") or {}).get("usd", 0) or 0)',
  '        if vol_24h < MIN_VOLUME_24H or liq_usd < MIN_LIQUIDITY:',
  '            return None',
  '        avg = vol_24h / 24',
  '        spike_ratio = vol_1h / avg if avg > 0 else 0',
  '        return {',
  '            "symbol": pair["baseToken"]["symbol"],',
  '            "pair_address": pair.get("pairAddress", ""),',
  '            "vol_1h": vol_1h, "vol_24h": vol_24h,',
  '            "liq_usd": liq_usd, "spike_ratio": spike_ratio,',
  '            "url": pair.get("url", ""),',
  '        }',
  '    except:',
  '        return None',
  '',
  'def send_telegram(message):',
  '    if not TELEGRAM_BOT_TOKEN:',
  '        print(message); return',
  '    tg_url = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage"',
  '    requests.post(tg_url, json={',
  '        "chat_id": TELEGRAM_CHAT_ID,',
  '        "text": message,',
  '        "parse_mode": "Markdown",',
  '    })',
  '',
  'def run():',
  '    print("WATCHER starting...")',
  '    volume_history = {}',
  '    cycle = 0',
  '    while True:',
  '        cycle += 1',
  '        for chain in CHAINS:',
  '            pairs  = get_top_pairs_by_volume(chain)',
  '            tokens = [extract_metrics(p) for p in pairs]',
  '            tokens = sorted([t for t in tokens if t], key=lambda x: -x["vol_24h"])',
  '            for t in tokens:',
  '                hist = volume_history.get(t["pair_address"], [])',
  '                if len(hist) >= 3 and t["spike_ratio"] >= VOLUME_SPIKE_THRESHOLD:',
  '                    msg = ("*SPIKE* " + t["symbol"]',
  '                           + " | ratio " + str(round(t["spike_ratio"], 1)) + "x")',
  '                    send_telegram(msg)',
  '                volume_history[t["pair_address"]] = (hist + [t["vol_1h"]])[-12:]',
  '        time.sleep(POLL_INTERVAL_SECONDS)',
  '',
  'if __name__ == "__main__":',
  '    run()',
]

const TAB_RANGES: Record<Tab, [number, number]> = {
  config:    [0, 16],
  collector: [17, 48],
  alerts:    [49, 62],
  loop:      [63, 999],
}

// Simple syntax highlighting
function highlight(line: string): React.ReactNode {
  // Comments
  if (line.trimStart().startsWith('#')) {
    return <span style={{ color: '#44445a' }}>{line}</span>
  }
  // Keywords
  const kwPattern = /\b(def|return|if|for|in|not|and|or|try|except|import|from|while|True|False|None|class)\b/g
  const parts = line.split(kwPattern)
  return parts.map((part, i) => {
    if (/^(def|return|if|for|in|not|and|or|try|except|import|from|while|True|False|None|class)$/.test(part)) {
      return <span key={i} style={{ color: '#ff7755' }}>{part}</span>
    }
    // Strings
    const strPattern = /(".*?"|'.*?')/g
    const strParts = part.split(strPattern)
    return strParts.map((sp, j) => {
      if (/^".*"$|^'.*'$/.test(sp)) {
        return <span key={j} style={{ color: '#ffcc44' }}>{sp}</span>
      }
      return <span key={j} style={{ color: '#b8b8d8' }}>{sp}</span>
    })
  })
}

export default function PythonScript() {
  const [tab, setTab] = useState<Tab>('config')

  const [start, end] = TAB_RANGES[tab]
  const lines = SCRIPT_LINES.slice(start, end + 1)

  const download = () => {
    const blob = new Blob([SCRIPT_LINES.join('\n')], { type: 'text/x-python' })
    const a    = document.createElement('a')
    a.href     = URL.createObjectURL(blob)
    a.download = 'watcher_agent.py'
    a.click()
  }

  return (
    <div>
      <div className="flex items-end justify-between pb-4" style={{ borderBottom: '1px solid #1c1c28' }}>
        <div>
          <div className="font-display" style={{ fontSize: 36, letterSpacing: 2, color: '#d8d8e8' }}>
            PYTHON SCRIPT
          </div>
          <div style={{ fontSize: 11, color: '#666680', marginTop: 4, letterSpacing: 1 }}>
            Agent source code — watcher_agent.py
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
          ↓ DOWNLOAD .PY
        </button>
      </div>

      <div style={{ background: '#0d0d12', border: '1px solid #1c1c28', marginTop: 20 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #1c1c28' }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '10px 20px',
                fontSize: 11,
                color: tab === t.id ? '#00ff88' : '#666680',
                borderBottom: `2px solid ${tab === t.id ? '#00ff88' : 'transparent'}`,
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${tab === t.id ? '#00ff88' : 'transparent'}`,
                cursor: 'pointer',
                letterSpacing: 1,
                fontFamily: 'var(--font-mono)',
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Code */}
        <div style={{ padding: 20 }}>
          <pre
            style={{
              background: '#060608',
              border: '1px solid #252535',
              padding: 16,
              fontSize: 11,
              lineHeight: 1.7,
              overflowX: 'auto',
              color: '#b8b8d8',
              margin: 0,
            }}
          >
            {lines.map((line, i) => (
              <div key={i}>{line === '' ? '\n' : highlight(line)}</div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  )
}
