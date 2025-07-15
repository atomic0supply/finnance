import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { verifyToken } from './jwt'
import { JWTPayload, User } from '@/types/auth'
import { hasPermission } from '@/config/roles'

// Mock user database - replace with real database
const USERS_DB: User[] = [
  {
    id: '1',
    email: 'admin@finnance.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    isActive: true,
    preferences: {
      language: 'es',
      currency: 'USD',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        upcomingPayments: true,
        budgetAlerts: true
      }
    }
  },
  {
    id: '2',
    email: 'user@finnance.com',
    name: 'Regular User',
    role: 'user',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    isActive: true,
    preferences: {
      language: 'es',
      currency: 'USD',
      theme: 'light',
      notifications: {
        email: true,
        push: false,
        upcomingPayments: true,
        budgetAlerts: true
      }
    }
  }
];

// Mock password storage - replace with real database
const PASSWORDS_DB: Record<string, string> = {
  'admin@finnance.com': bcrypt.hashSync('admin123', 10),
  'user@finnance.com': bcrypt.hashSync('user123', 10)
};

export interface AuthResult {
  user: User;
  payload: JWTPayload;
}

export function requireAuth(
  request: NextRequest,
  allowedRoles?: string[]
): NextResponse | AuthResult {
  const header = request.headers.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return NextResponse.json(
      { error: 'No token provided' },
      { status: 401 }
    )
  }

  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }

  const user = USERS_DB.find(u => u.id === payload.userId)
  if (!user || !user.isActive) {
    return NextResponse.json(
      { error: 'User not found or inactive' },
      { status: 401 }
    )
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    )
  }

  return { user, payload }
}

export function requirePermission(
  request: NextRequest,
  resource: string,
  action: string
): NextResponse | AuthResult {
  const authResult = requireAuth(request)
  
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user, payload } = authResult
  
  if (!hasPermission(payload.permissions, resource, action)) {
    return NextResponse.json(
      { error: `Permission denied for ${action} on ${resource}` },
      { status: 403 }
    )
  }

  return authResult
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  const user = USERS_DB.find(u => u.email === email && u.isActive)
  if (!user) return null

  const storedPassword = PASSWORDS_DB[email]
  if (!storedPassword) return null

  const isValidPassword = await bcrypt.compare(password, storedPassword)
  if (!isValidPassword) return null

  // Update last login
  user.lastLogin = new Date().toISOString()

  return user
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'user' | 'viewer' = 'user'
): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const newUser: User = {
    id: (USERS_DB.length + 1).toString(),
    email,
    name,
    role,
    createdAt: new Date().toISOString(),
    isActive: true,
    preferences: {
      language: 'es',
      currency: 'USD',
      theme: 'light',
      notifications: {
        email: true,
        push: false,
        upcomingPayments: true,
        budgetAlerts: true
      }
    }
  }

  USERS_DB.push(newUser)
  PASSWORDS_DB[email] = hashedPassword

  return newUser
}

export function getUserById(id: string): User | null {
  return USERS_DB.find(u => u.id === id) || null
}

export function getUserByEmail(email: string): User | null {
  return USERS_DB.find(u => u.email === email) || null
}

export async function updateUserPassword(
  email: string,
  newPassword: string
): Promise<boolean> {
  const user = getUserByEmail(email)
  if (!user) return false

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  PASSWORDS_DB[email] = hashedPassword

  return true
}
