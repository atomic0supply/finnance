import jwt from 'jsonwebtoken';
import { JWTPayload, User } from '@/types/auth';
import { getRolePermissions } from '@/config/roles';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export function generateTokens(user: User): TokenPair {
  const permissions = getRolePermissions(user.role);
  
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId: user.id,
    email: user.email,
    role: user.role,
    permissions
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'finnance-app',
    audience: 'finnance-users'
  });

  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'finnance-app',
      audience: 'finnance-users'
    }
  );

  // Calculate expiration time
  const expiresAt = new Date();
  expiresAt.setTime(expiresAt.getTime() + (15 * 60 * 1000)); // 15 minutes

  return {
    accessToken,
    refreshToken,
    expiresAt
  };
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'finnance-app',
      audience: 'finnance-users'
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function verifyRefreshToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'finnance-app',
      audience: 'finnance-users'
    }) as { userId: string; email: string };
    
    return decoded;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    if (!decoded || !decoded.exp) return true;
    
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch {
    return true;
  }
}

export function getTokenExpirationTime(token: string): Date | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    if (!decoded || !decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
}

export function generatePasswordResetToken(email: string): string {
  return jwt.sign(
    { email, purpose: 'password-reset' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

export function verifyPasswordResetToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; purpose: string };
    
    if (decoded.purpose !== 'password-reset') {
      return null;
    }
    
    return { email: decoded.email };
  } catch {
    return null;
  }
}
