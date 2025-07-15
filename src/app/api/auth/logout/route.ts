import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authResult = requireAuth(request);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // In a real application, you would:
    // 1. Add token to blacklist
    // 2. Clear any server-side sessions
    // 3. Log the logout event
    
    return NextResponse.json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
