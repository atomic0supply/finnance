import { z } from 'zod';

// User validation schemas
export const CreateUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  firstName: z.string().min(1, 'El nombre es requerido').max(100),
  lastName: z.string().min(1, 'El apellido es requerido').max(100),
  role: z.enum(['user', 'admin']).default('user'),
});

export const UserUpdateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200).optional(),
  preferences: z.record(z.string(), z.any()).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Transaction validation schemas
export const CreateTransactionSchema = z.object({
  amount: z.number().positive('El monto debe ser positivo'),
  description: z.string().min(1, 'La descripción es requerida').max(255),
  category: z.string().min(1, 'La categoría es requerida').max(100),
  type: z.enum(['income', 'expense']),
  date: z.string().or(z.date()),
  notes: z.string().max(1000).optional(),
  propertyId: z.string().uuid().optional(),
  vehicleId: z.string().uuid().optional(),
  serviceId: z.string().uuid().optional(),
  isRecurring: z.boolean().default(false),
});

export const UpdateTransactionSchema = CreateTransactionSchema.partial();

// Property validation schemas
export const CreatePropertySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255),
  type: z.string().min(1, 'El tipo es requerido').max(50),
  address: z.string().min(1, 'La dirección es requerida'),
  purchaseDate: z.string().or(z.date()),
  purchasePrice: z.number().positive('El precio de compra debe ser positivo'),
  currentValue: z.number().positive().optional(),
  notes: z.string().max(1000).optional(),
});

export const UpdatePropertySchema = CreatePropertySchema.partial();

// Vehicle validation schemas
export const CreateVehicleSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255),
  brand: z.string().min(1, 'La marca es requerida').max(100),
  model: z.string().min(1, 'El modelo es requerido').max(100),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  licensePlate: z.string().max(20).optional(),
  purchaseDate: z.string().or(z.date()),
  purchasePrice: z.number().positive('El precio de compra debe ser positivo'),
  currentValue: z.number().positive().optional(),
  notes: z.string().max(1000).optional(),
});

export const UpdateVehicleSchema = CreateVehicleSchema.partial();

// Service validation schemas
export const CreateServiceSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255),
  description: z.string().max(1000).optional(),
  category: z.string().min(1, 'La categoría es requerida').max(100),
  amount: z.number().positive('El monto debe ser positivo'),
  frequency: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
});

export const UpdateServiceSchema = CreateServiceSchema.partial();

// Query validation schemas
export const TransactionQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).default(1),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).default(50),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  propertyId: z.string().uuid().optional(),
  vehicleId: z.string().uuid().optional(),
  serviceId: z.string().uuid().optional(),
  search: z.string().optional(),
});

export type CreateUserData = z.infer<typeof CreateUserSchema>;
export type UserUpdateData = z.infer<typeof UserUpdateSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
export type CreateTransactionData = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionData = z.infer<typeof UpdateTransactionSchema>;
export type CreatePropertyData = z.infer<typeof CreatePropertySchema>;
export type UpdatePropertyData = z.infer<typeof UpdatePropertySchema>;
export type CreateVehicleData = z.infer<typeof CreateVehicleSchema>;
export type UpdateVehicleData = z.infer<typeof UpdateVehicleSchema>;
export type CreateServiceData = z.infer<typeof CreateServiceSchema>;
export type UpdateServiceData = z.infer<typeof UpdateServiceSchema>;
export type TransactionQuery = z.infer<typeof TransactionQuerySchema>;