import type { Token, DexPair } from './types'

const BASE_URL = 'https://api.dexscreener.com'
const MIN_VOL_24H = 10_000
const MIN_LIQ    = 5_000
const SPIKE_THRESHOLD = 3.0

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export function extractMetrics(pair: DexPair, chain = 'base'): Token | null {
  try {
    const volume = pair.volume ?? {}
    const priceChange = pair.priceChange ?? {}
    const liquidity = pair.liquidity ?? {}
    const txns = pair.txns ?? {}

    const vol1h  = Number(volume.h1  ?? 0)
    const vol6h  = Number(volume.h6  ?? 0)
    const vol24h = Number(volume.h24 ?? 0)
    const liqUsd = Number(liquidity.usd ?? 0)
    const mcap   = Number(pair.marketCap ?? pair.fdv ?? 0)

    if (vol24h < MIN_VOL_24H) return null
    if (liqUsd < MIN_LIQ)    return null

    const avgHourly  = vol24h / 24
    const spikeRatio = avgHourly > 0 ? vol1h / avgHourly : 0
    const h1txns = (txns as Record<string, { buys?: number; sells?: number }>).h1 ?? {}

    return {
      symbol:      pair.baseToken?.symbol ?? '???',
      name:        pair.baseToken?.name   ?? 'Unknown',
      address:     pair.baseToken?.address ?? '',
      pairAddress: pair.pairAddress ?? '',
      dex:         pair.dexId ?? '',
      priceUsd:    Number(pair.priceUsd ?? 0),
      mcap,
      vol1h, vol6h, vol24h,
      liqUsd,
      change1h:  Number(priceChange.h1  ?? 0),
      change6h:  Number(priceChange.h6  ?? 0),
      change24h: Number(priceChange.h24 ?? 0),
      buys1h:  h1txns.buys  ?? 0,
      sells1h: h1txns.sells ?? 0,
      spikeRatio,
      url:   pair.url ?? `https://dexscreener.com/${chain}/${pair.pairAddress ?? ''}`,
      chain,
    }
  } catch {
    return null
  }
}

export async function fetchTokens(): Promise<Token[]> {
  const pairs: DexPair[] = []

  try {
    const res = await fetch(`${BASE_URL}/token-boosts/top/v1`, { next: { revalidate: 300 } })
    if (res.ok) {
      const boosted = await res.json() as Array<{ chainId?: string; tokenAddress?: string }>
      const baseAddresses = boosted
        .filter((t) => t.chainId === 'base')
        .slice(0, 10)
        .map((t) => t.tokenAddress)
        .filter(Boolean) as string[]

      for (const addr of baseAddresses) {
        try {
          const r = await fetch(`${BASE_URL}/token-pairs/v1/base/${addr}`, {
            next: { revalidate: 300 },
          })
          if (r.ok) {
            const data = await r.json()
            if (Array.isArray(data)) pairs.push(...data)
          }
        } catch { /* skip */ }
        await sleep(60)
      }
    }
  } catch { /* skip */ }

  try {
    const res = await fetch(`${BASE_URL}/latest/dex/search?q=WETH`, {
      next: { revalidate: 300 },
    })
    if (res.ok) {
      const data = await res.json() as { pairs?: DexPair[] }
      pairs.push(...(data.pairs ?? []).filter((p) => p.chainId === 'base'))
    }
  } catch { /* skip */ }

  // Deduplicate
  const seen = new Set<string>()
  const unique = pairs.filter((p) => {
    if (!p.pairAddress || seen.has(p.pairAddress)) return false
    seen.add(p.pairAddress)
    return true
  })

  const tokens = unique.map((p) => extractMetrics(p)).filter(Boolean) as Token[]
  tokens.sort((a, b) => b.vol24h - a.vol24h)
  return tokens
}

export function fmtUsd(n: number): string {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K'
  return '$' + n.toFixed(2)
}

export function fmtPrice(p: number): string {
  if (p < 0.000001) return p.toExponential(3)
  if (p < 0.001)    return p.toFixed(6)
  if (p < 1)        return p.toFixed(4)
  return p.toFixed(2)
}

export function getSpikeRatio(t: Token): number {
  return t.spikeRatio
}

export { SPIKE_THRESHOLD }
