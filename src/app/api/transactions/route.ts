import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, createSuccessResponse } from '@/lib/api-utils';
import { CreateTransactionSchema, TransactionQuerySchema } from '@/lib/validations';

export const revalidate = 60;

async function getUserFromClerk(clerkUserId: string) {
  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId }
  });

  if (!user) {
    // Create user if doesn't exist (first time login)
    user = await prisma.user.create({
      data: {
        clerkId: clerkUserId,
        email: '', // Will be updated from Clerk webhook
        name: '', // Will be updated from Clerk webhook
      }
    });
  }

  return user;
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await getUserFromClerk(userId);

    const { searchParams } = new URL(request.url);
    const query = TransactionQuerySchema.parse(Object.fromEntries(searchParams));

    const where: any = {
      userId: user.id,
    };

    // Apply filters
    if (query.type) {
      where.type = query.type;
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.startDate || query.endDate) {
      where.date = {};
      if (query.startDate) {
        where.date.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.date.lte = new Date(query.endDate);
      }
    }

    if (query.propertyId) {
      where.propertyId = query.propertyId;
    }

    if (query.vehicleId) {
      where.vehicleId = query.vehicleId;
    }

    if (query.serviceId) {
      where.serviceId = query.serviceId;
    }

    if (query.search) {
      where.OR = [
        { description: { contains: query.search, mode: 'insensitive' } },
        { notes: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    // Pagination
    const skip = (query.page - 1) * query.limit;

    // Execute queries in parallel
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          property: {
            select: { id: true, name: true, type: true }
          },
          vehicle: {
            select: { id: true, name: true, brand: true, model: true }
          },
          service: {
            select: { id: true, name: true, type: true }
          }
        },
        orderBy: { date: 'desc' },
        skip,
        take: query.limit
      }),
      prisma.transaction.count({ where })
    ]);

    const response = {
      transactions,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit)
      }
    };

    return createSuccessResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await getUserFromClerk(userId);

    const body = await request.json();
    const data = CreateTransactionSchema.parse(body);

    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        userId: user.id,
        date: new Date(data.date)
      },
      include: {
        property: {
          select: { id: true, name: true, type: true }
        },
        vehicle: {
          select: { id: true, name: true, brand: true, model: true }
        },
        service: {
          select: { id: true, name: true, type: true }
        }
      }
    });

    return createSuccessResponse(transaction, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
