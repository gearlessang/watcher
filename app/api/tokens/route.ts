import { NextResponse } from 'next/server'
import { fetchTokens } from '@/lib/dexscreener'

export const revalidate = 300 // 5 min ISR

export async function GET() {
  try {
    const tokens = await fetchTokens()
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      chain: 'base',
      count: tokens.length,
      tokens,
      spikes: tokens.filter((t) => t.spikeRatio >= 3.0),
    })
  } catch (err) {
    return NextResponse.json({ status: 'error', message: String(err) }, { status: 500 })
  }
}
