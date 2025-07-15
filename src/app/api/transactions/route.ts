import { NextResponse } from 'next/server'
import transactions from '@/data/transactions'

export const revalidate = 60

export async function GET() {
  return NextResponse.json(transactions, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=120'
    }
  })
}
