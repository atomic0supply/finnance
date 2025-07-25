import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const VehicleCreateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  brand: z.string().min(1, 'La marca es requerida'),
  model: z.string().min(1, 'El modelo es requerido'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  plate: z.string().min(1, 'La placa es requerida'),
  type: z.enum(['car', 'motorcycle', 'truck', 'other']),
  notes: z.string().optional(),
});

const VehicleUpdateSchema = VehicleCreateSchema.partial();

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

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const user = await getUserFromClerk(userId);
    
    const vehicles = await prisma.vehicle.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
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
    const validatedData = VehicleCreateSchema.parse(body);

    const vehicle = await prisma.vehicle.create({
      data: {
        ...validatedData,
        userId: user.id,
      }
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating vehicle:', error);
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
        { error: 'ID de vehículo requerido' },
        { status: 400 }
      );
    }

    // Validate request body
    const validatedData = VehicleUpdateSchema.parse(updateData);

    // Check if vehicle belongs to user
    const existingVehicle = await prisma.vehicle.findFirst({
      where: { id, userId: user.id }
    });

    if (!existingVehicle) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      );
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: validatedData
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating vehicle:', error);
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
        { error: 'ID de vehículo requerido' },
        { status: 400 }
      );
    }

    // Check if vehicle belongs to user
    const existingVehicle = await prisma.vehicle.findFirst({
      where: { id, userId: user.id }
    });

    if (!existingVehicle) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      );
    }

    await prisma.vehicle.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Vehículo eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}