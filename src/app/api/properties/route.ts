import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const PropertyCreateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  type: z.enum(['home', 'villa', 'apartment', 'office', 'other']),
  address: z.string().min(1, 'La dirección es requerida'),
  value: z.number().optional(),
  notes: z.string().optional(),
});

const PropertyUpdateSchema = PropertyCreateSchema.partial();

// Helper function to get or create user
async function getUserFromClerk(clerkId: string) {
  let user = await prisma.user.findUnique({
    where: { clerkId }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId,
        email: '', // Will be updated when we get user info from Clerk
        name: '',
      }
    });
  }

  return user;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const user = await getUserFromClerk(userId);
    
    const properties = await prisma.property.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const user = await getUserFromClerk(userId);
    const body = await request.json();
    
    // Validate request body
    const validatedData = PropertyCreateSchema.parse(body);

    const property = await prisma.property.create({
      data: {
        ...validatedData,
        userId: user.id,
      }
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const user = await getUserFromClerk(userId);
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de propiedad requerido' },
        { status: 400 }
      );
    }

    // Validate request body
    const validatedData = PropertyUpdateSchema.parse(updateData);

    // Check if property belongs to user
    const existingProperty = await prisma.property.findFirst({
      where: { id, userId: user.id }
    });

    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Propiedad no encontrada' },
        { status: 404 }
      );
    }

    const property = await prisma.property.update({
      where: { id },
      data: validatedData
    });

    return NextResponse.json(property);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const user = await getUserFromClerk(userId);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de propiedad requerido' },
        { status: 400 }
      );
    }

    // Check if property belongs to user
    const existingProperty = await prisma.property.findFirst({
      where: { id, userId: user.id }
    });

    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Propiedad no encontrada' },
        { status: 404 }
      );
    }

    await prisma.property.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Propiedad eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}