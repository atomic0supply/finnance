import { NextRequest, NextResponse } from 'next/server'

export function requireAuth(
  request: NextRequest,
  allowedRoles: string[]
): NextResponse | null {
  const header = request.headers.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  const admin = process.env.ADMIN_TOKEN
  const user = process.env.USER_TOKEN

  let role: string | null = null
  if (token && token === admin) role = 'admin'
  else if (token && token === user) role = 'user'

  if (!role) return new NextResponse('Unauthorized', { status: 401 })
  if (!allowedRoles.includes(role))
    return new NextResponse('Forbidden', { status: 403 })

  return null
}
