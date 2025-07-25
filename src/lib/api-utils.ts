import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface ApiError {
  error: string;
  code?: string;
  details?: any;
}

export function handleApiError(error: unknown): NextResponse<ApiError> {
  console.error('API Error:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Datos de entrada inválidos',
        code: 'VALIDATION_ERROR',
        details: error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      },
      { status: 400 }
    );
  }

  // Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any;
    
    switch (prismaError.code) {
      case 'P2002':
        return NextResponse.json(
          {
            error: 'Ya existe un registro con estos datos',
            code: 'DUPLICATE_ERROR'
          },
          { status: 409 }
        );
      case 'P2025':
        return NextResponse.json(
          {
            error: 'Registro no encontrado',
            code: 'NOT_FOUND'
          },
          { status: 404 }
        );
      case 'P2003':
        return NextResponse.json(
          {
            error: 'Referencia inválida',
            code: 'FOREIGN_KEY_ERROR'
          },
          { status: 400 }
        );
      default:
        return NextResponse.json(
          {
            error: 'Error de base de datos',
            code: 'DATABASE_ERROR'
          },
          { status: 500 }
        );
    }
  }

  // Authentication errors
  if (error instanceof Error) {
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json(
        {
          error: 'No autorizado',
          code: 'UNAUTHORIZED'
        },
        { status: 401 }
      );
    }

    if (error.message.includes('Forbidden')) {
      return NextResponse.json(
        {
          error: 'Acceso denegado',
          code: 'FORBIDDEN'
        },
        { status: 403 }
      );
    }
  }

  // Generic server error
  return NextResponse.json(
    {
      error: 'Error interno del servidor',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    },
    { status: 500 }
  );
}

export function createSuccessResponse<T>(data: T, status: number = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export function successResponse<T>(data: T, status: number = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export function createErrorResponse(message: string, status: number = 400): NextResponse<ApiError> {
  return NextResponse.json({ error: message }, { status });
}