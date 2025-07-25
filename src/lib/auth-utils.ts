import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export async function getCurrentUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    
    if (!decoded.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        isActive: true 
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      return null;
    }

    // Split name into firstName and lastName for compatibility
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      id: user.id,
      email: user.email,
      firstName,
      lastName,
      role: user.role
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export function generateToken(userId: string): string {
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign(
    { userId },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' } as jwt.SignOptions
  );
}

export function generateRefreshToken(userId: string): string {
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  
  if (!jwtRefreshSecret) {
    throw new Error('JWT_REFRESH_SECRET not configured');
  }

  return jwt.sign(
    { userId },
    jwtRefreshSecret,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } as jwt.SignOptions
  );
}

export function hasPermission(user: AuthUser, permission: string): boolean {
  // Admin has all permissions
  if (user.role === 'admin') {
    return true;
  }

  // Define user permissions
  const userPermissions = [
    'transactions:read',
    'transactions:create',
    'transactions:update',
    'transactions:delete',
    'properties:read',
    'properties:create',
    'properties:update',
    'properties:delete',
    'vehicles:read',
    'vehicles:create',
    'vehicles:update',
    'vehicles:delete',
    'services:read',
    'services:create',
    'services:update',
    'services:delete',
    'reports:read'
  ];

  return userPermissions.includes(permission);
}