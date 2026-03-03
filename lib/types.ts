export interface Token {
  symbol: string
  name: string
  address: string
  pairAddress: string
  dex: string
  priceUsd: number
  mcap: number
  vol1h: number
  vol6h: number
  vol24h: number
  liqUsd: number
  change1h: number
  change6h: number
  change24h: number
  buys1h: number
  sells1h: number
  spikeRatio: number
  url: string
  chain: string
}

export interface DexPair {
  pairAddress?: string
  chainId?: string
  dexId?: string
  baseToken?: { symbol?: string; name?: string; address?: string }
  priceUsd?: string
  marketCap?: number
  fdv?: number
  volume?: { h1?: number; h6?: number; h24?: number }
  liquidity?: { usd?: number }
  priceChange?: { h1?: number; h6?: number; h24?: number }
  txns?: { h1?: { buys?: number; sells?: number } }
  url?: string
}

export type SortKey = 'vol24h' | 'vol1h' | 'mcap' | 'change24h'
export type Section = 'dashboard' | 'spikes' | 'agent-api' | 'skill' | 'script'
