import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { verifyToken } from './jwt';
import { prisma } from './prisma';
import { JWTPayload, User } from '@/types/auth';
import { hasPermission } from '@/config/roles';

export interface AuthResult {
  user: User;
  payload: JWTPayload;
}

export function requireAuth(
  request: NextRequest,
  allowedRoles?: string[]
): NextResponse | AuthResult {
  const header = request.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return NextResponse.json(
      { error: 'No token provided' },
      { status: 401 }
    );
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // Note: This function is synchronous but getUserById is now async
  // This will need to be refactored to be async in the calling code
  const user = getUserByIdSync(payload.userId);
  if (!user || !user.isActive) {
    return NextResponse.json(
      { error: 'User not found or inactive' },
      { status: 401 }
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  return { user, payload };
}

export function requirePermission(
  request: NextRequest,
  resource: string,
  action: string
): NextResponse | AuthResult {
  const authResult = requireAuth(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user, payload } = authResult;
  
  if (!hasPermission(payload.permissions, resource, action)) {
    return NextResponse.json(
      { error: `Permission denied for ${action} on ${resource}` },
      { status: 403 }
    );
  }

  return authResult;
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { 
        email,
        isActive: true
      }
    });

    if (!user || !user.passwordHash) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return null;
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Convert Prisma user to User type
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'admin' | 'user' | 'viewer',
      createdAt: user.createdAt.toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: user.isActive,
      preferences: user.preferences as any || {
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
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'user' | 'viewer' = 'user'
): Promise<User> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const defaultPreferences = {
      language: 'es',
      currency: 'USD',
      theme: 'light',
      notifications: {
        email: true,
        push: false,
        upcomingPayments: true,
        budgetAlerts: true
      }
    };

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        role,
        passwordHash: hashedPassword,
        isActive: true,
        preferences: defaultPreferences
      }
    });

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role as 'admin' | 'user' | 'viewer',
      createdAt: newUser.createdAt.toISOString(),
      lastLogin: newUser.lastLogin?.toISOString(),
      isActive: newUser.isActive,
      preferences: newUser.preferences as any || defaultPreferences
    };
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'admin' | 'user' | 'viewer',
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.lastLogin?.toISOString(),
      isActive: user.isActive,
      preferences: user.preferences as any || {
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
    };
  } catch (error) {
    console.error('Get user by ID error:', error);
    return null;
  }
}

// Temporary sync function for backward compatibility
// This should be removed once all calling code is updated to async
function getUserByIdSync(id: string): User | null {
  // This is a temporary workaround - in production, all auth should be async
  console.warn('Using synchronous getUserByIdSync - this should be migrated to async');
  return null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'admin' | 'user' | 'viewer',
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.lastLogin?.toISOString(),
      isActive: user.isActive,
      preferences: user.preferences as any || {
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
    };
  } catch (error) {
    console.error('Get user by email error:', error);
    return null;
  }
}

export async function updateUserPassword(
  email: string,
  newPassword: string
): Promise<boolean> {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword }
    });

    return true;
  } catch (error) {
    console.error('Update password error:', error);
    return false;
  }
}

export async function updateUserProfile(
  id: string,
  data: Partial<Pick<User, 'name' | 'preferences'>>
): Promise<User | null> {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.preferences && { preferences: data.preferences })
      }
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role as 'admin' | 'user' | 'viewer',
      createdAt: updatedUser.createdAt.toISOString(),
      lastLogin: updatedUser.lastLogin?.toISOString(),
      isActive: updatedUser.isActive,
      preferences: updatedUser.preferences as any
    };
  } catch (error) {
    console.error('Update user profile error:', error);
    return null;
  }
}
