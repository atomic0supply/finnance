import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';
import { generateTokens } from '@/lib/jwt';
import { RegisterData, LoginResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterData = await request.json();
    const { email, password, name, role = 'user' } = body;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['user', 'viewer'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    try {
      // Create user
      const user = await createUser(email, password, name, role);
      
      // Generate tokens
      const tokens = generateTokens(user);
      
      const response: LoginResponse = {
        user,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.expiresAt.toISOString()
      };

      return NextResponse.json(response, { status: 201 });

    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate')) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
      throw error;
    }

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
