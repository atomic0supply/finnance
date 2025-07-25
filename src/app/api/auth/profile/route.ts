import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { handleApiError, successResponse } from '@/lib/api-utils';
import { UserUpdateSchema } from '@/lib/validations';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find or create user in our database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      // Create user if doesn't exist (first time login)
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: '', // Will be updated from Clerk webhook
          name: '', // Will be updated from Clerk webhook
        }
      });
    }

    return successResponse(user);

  } catch (error) {
    console.error('Profile fetch error:', error);
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate update data with Zod
    const validatedData = UserUpdateSchema.parse(body);

    if (Object.keys(validatedData).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      );
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: validatedData
    });

    return successResponse(updatedUser);

  } catch (error) {
    console.error('Profile update error:', error);
    return handleApiError(error);
  }
}
