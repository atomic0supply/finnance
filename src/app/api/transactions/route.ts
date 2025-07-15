import { NextRequest, NextResponse } from 'next/server'
import transactions, { type Transaction } from '@/data/transactions'
import { requireAuth, requirePermission } from '@/lib/auth'
import { sanitizeString } from '@/lib/sanitize'

export const revalidate = 60

export async function GET(request: NextRequest) {
  const authResult = requirePermission(request, 'transactions', 'read')
  if (authResult instanceof NextResponse) return authResult

  const { user } = authResult
  
  // Filter transactions by user
  const userTransactions = transactions.filter(t => t.userId === user.id)

  return NextResponse.json(userTransactions, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=120'
    }
  })
}

export async function POST(request: NextRequest) {
  const authResult = requirePermission(request, 'transactions', 'create')
  if (authResult instanceof NextResponse) return authResult

  const { user } = authResult

  const body = await request.json().catch(() => null)
  if (!body)
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    )

  const { date, description, category, type, amount, propertyId, vehicleId, serviceId, receipt } = body as Record<string, unknown>

  if (
    typeof date !== 'string' ||
    typeof description !== 'string' ||
    typeof category !== 'string' ||
    (type !== 'income' && type !== 'expense') ||
    typeof amount !== 'number'
  ) {
    return NextResponse.json(
      { error: 'Invalid transaction data' },
      { status: 400 }
    )
  }

  const newTx: Transaction = {
    id: (transactions.length + 1).toString(),
    date: sanitizeString(date),
    description: sanitizeString(description),
    category: sanitizeString(category),
    type,
    amount,
    propertyId: propertyId ? sanitizeString(propertyId as string) : undefined,
    vehicleId: vehicleId ? sanitizeString(vehicleId as string) : undefined,
    serviceId: serviceId ? sanitizeString(serviceId as string) : undefined,
    receipt: receipt ? sanitizeString(receipt as string) : undefined,
    userId: user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  transactions.push(newTx)

  return NextResponse.json(newTx, { status: 201 })
}
