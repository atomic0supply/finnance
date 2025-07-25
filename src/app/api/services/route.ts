import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const ServiceCreateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  type: z.enum(['subscription', 'utility', 'membership', 'insurance', 'other']),
  amount: z.number().positive('El monto debe ser positivo'),
  frequency: z.enum(['monthly', 'quarterly', 'yearly']),
  nextPayment: z.string().min(1, 'La fecha de próximo pago es requerida'),
  propertyId: z.string().optional(),
  vehicleId: z.string().optional(),
  isActive: z.boolean().default(true),
  notes: z.string().optional(),
});

const ServiceUpdateSchema = ServiceCreateSchema.partial();

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
    
    const services = await prisma.service.findMany({
      where: { userId: user.id },
      include: {
        property: true,
        vehicle: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
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
    const validatedData = ServiceCreateSchema.parse(body);

    // Validate property/vehicle ownership if provided
    if (validatedData.propertyId) {
      const property = await prisma.property.findFirst({
        where: { id: validatedData.propertyId, userId: user.id }
      });
      if (!property) {
        return NextResponse.json(
          { error: 'Propiedad no encontrada' },
          { status: 404 }
        );
      }
    }

    if (validatedData.vehicleId) {
      const vehicle = await prisma.vehicle.findFirst({
        where: { id: validatedData.vehicleId, userId: user.id }
      });
      if (!vehicle) {
        return NextResponse.json(
          { error: 'Vehículo no encontrado' },
          { status: 404 }
        );
      }
    }

    const service = await prisma.service.create({
      data: {
        ...validatedData,
        userId: user.id,
        nextPayment: new Date(validatedData.nextPayment),
      },
      include: {
        property: true,
        vehicle: true,
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating service:', error);
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
        { error: 'ID de servicio requerido' },
        { status: 400 }
      );
    }

    // Validate request body
    const validatedData = ServiceUpdateSchema.parse(updateData);

    // Check if service belongs to user
    const existingService = await prisma.service.findFirst({
      where: { id, userId: user.id }
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    // Validate property/vehicle ownership if provided
    if (validatedData.propertyId) {
      const property = await prisma.property.findFirst({
        where: { id: validatedData.propertyId, userId: user.id }
      });
      if (!property) {
        return NextResponse.json(
          { error: 'Propiedad no encontrada' },
          { status: 404 }
        );
      }
    }

    if (validatedData.vehicleId) {
      const vehicle = await prisma.vehicle.findFirst({
        where: { id: validatedData.vehicleId, userId: user.id }
      });
      if (!vehicle) {
        return NextResponse.json(
          { error: 'Vehículo no encontrado' },
          { status: 404 }
        );
      }
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...validatedData,
        ...(validatedData.nextPayment && { nextPayment: new Date(validatedData.nextPayment) }),
      },
      include: {
        property: true,
        vehicle: true,
      }
    });

    return NextResponse.json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating service:', error);
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
        { error: 'ID de servicio requerido' },
        { status: 400 }
      );
    }

    // Check if service belongs to user
    const existingService = await prisma.service.findFirst({
      where: { id, userId: user.id }
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    await prisma.service.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Servicio eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}