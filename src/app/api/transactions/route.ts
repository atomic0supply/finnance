import { NextRequest, NextResponse } from 'next/server'
import transactions, { type Transaction } from '@/data/transactions'
import { requireAuth } from '@/lib/auth'
import { sanitizeString } from '@/lib/sanitize'

export const revalidate = 60

export async function GET(request: NextRequest) {
  const auth = requireAuth(request, ['admin', 'user'])
  if (auth) return auth

  return NextResponse.json(transactions, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=120'
    }
  })
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request, ['admin'])
  if (auth) return auth

  const body = await request.json().catch(() => null)
  if (!body)
    return new NextResponse('Invalid JSON', { status: 400 })

  const { date, description, category, type, amount } = body as Record<string, unknown>

  if (
    typeof date !== 'string' ||
    typeof description !== 'string' ||
    typeof category !== 'string' ||
    (type !== 'income' && type !== 'expense') ||
    typeof amount !== 'number'
  ) {
    return new NextResponse('Bad Request', { status: 400 })
  }

  const newTx: Transaction = {
    id: transactions.length + 1,
    date: sanitizeString(date),
    description: sanitizeString(description),
    category: sanitizeString(category),
    type,
    amount,
  }

  transactions.push(newTx)

  return NextResponse.json(newTx, { status: 201 })
}
