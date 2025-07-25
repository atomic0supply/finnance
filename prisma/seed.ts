import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

interface UserPreferences {
  language: 'es' | 'en';
  currency: 'USD' | 'EUR' | 'MXN';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    upcomingPayments: boolean;
    budgetAlerts: boolean;
  };
}

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuarios iniciales
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const defaultPreferences: UserPreferences = {
    language: 'es',
    currency: 'USD',
    theme: 'light',
    notifications: {
      email: true,
      push: false,
      upcomingPayments: true,
      budgetAlerts: true
    }
  };

  const adminPreferences: UserPreferences = {
    ...defaultPreferences,
    theme: 'dark',
    notifications: {
      ...defaultPreferences.notifications,
      push: true
    }
  };

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@finnance.com' },
    update: {},
    create: {
      email: 'admin@finnance.com',
      name: 'Administrator',
      role: 'admin',
      passwordHash: adminPassword,
      isActive: true,
      preferences: adminPreferences
    }
  });

  console.log('✅ Usuario administrador creado:', adminUser.email);

  // Create regular user
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@finnance.com' },
    update: {},
    create: {
      email: 'user@finnance.com',
      name: 'Regular User',
      role: 'user',
      passwordHash: userPassword,
      isActive: true,
      preferences: defaultPreferences
    }
  });

  console.log('✅ Usuario regular creado:', regularUser.email);

  // Crear algunas propiedades de ejemplo
  const property1 = await prisma.property.create({
    data: {
      name: 'Casa Principal',
      type: 'house',
      address: 'Calle Principal 123',
      value: 280000,
      userId: regularUser.id
    }
  });

  const property2 = await prisma.property.create({
    data: {
      name: 'Apartamento Centro',
      type: 'apartment',
      address: 'Avenida Central 456',
      value: 165000,
      userId: regularUser.id
    }
  });

  console.log('✅ Propiedades de ejemplo creadas');

  // Crear algunos vehículos de ejemplo
  const vehicle1 = await prisma.vehicle.create({
    data: {
      name: 'Toyota Corolla',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      plate: 'ABC-123',
      type: 'car',
      userId: regularUser.id
    }
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      name: 'Honda Civic',
      brand: 'Honda',
      model: 'Civic',
      year: 2019,
      plate: 'XYZ-789',
      type: 'car',
      userId: regularUser.id
    }
  });

  console.log('✅ Vehículos de ejemplo creados');

  // Crear algunos servicios de ejemplo
  const service1 = await prisma.service.create({
    data: {
      name: 'Netflix',
      type: 'subscription',
      amount: 15.99,
      frequency: 'monthly',
      nextPayment: new Date('2024-02-01'),
      isActive: true,
      userId: regularUser.id
    }
  });

  const service2 = await prisma.service.create({
    data: {
      name: 'Spotify',
      type: 'subscription',
      amount: 9.99,
      frequency: 'monthly',
      nextPayment: new Date('2024-02-01'),
      isActive: true,
      userId: regularUser.id
    }
  });

  const service3 = await prisma.service.create({
    data: {
      name: 'Seguro Auto',
      type: 'insurance',
      amount: 120.00,
      frequency: 'monthly',
      nextPayment: new Date('2024-02-01'),
      isActive: true,
      userId: regularUser.id
    }
  });

  console.log('✅ Servicios de ejemplo creados');

  // Crear algunas transacciones de ejemplo
  const transactions = [
    {
      description: 'Salario mensual',
      category: 'salary',
      type: 'income' as const,
      amount: 3500,
      date: new Date('2024-01-15'),
      userId: regularUser.id
    },
    {
      description: 'Supermercado',
      category: 'groceries',
      type: 'expense' as const,
      amount: 150,
      date: new Date('2024-01-16'),
      userId: regularUser.id
    },
    {
      description: 'Gasolina',
      category: 'transport',
      type: 'expense' as const,
      amount: 60,
      date: new Date('2024-01-17'),
      vehicleId: vehicle1.id,
      userId: regularUser.id
    },
    {
      description: 'Pago Netflix',
      category: 'entertainment',
      type: 'expense' as const,
      amount: 15.99,
      date: new Date('2024-01-18'),
      serviceId: service1.id,
      userId: regularUser.id
    },
    {
      description: 'Mantenimiento casa',
      category: 'maintenance',
      type: 'expense' as const,
      amount: 200,
      date: new Date('2024-01-19'),
      propertyId: property1.id,
      userId: regularUser.id
    }
  ];

  for (const transaction of transactions) {
    await prisma.transaction.create({ data: transaction });
  }

  console.log('✅ Transacciones de ejemplo creadas');

  console.log('🎉 Seed completado exitosamente!');
  console.log('');
  console.log('Usuarios creados:');
  console.log('- Admin: admin@finnance.com / admin123');
  console.log('- Usuario: user@finnance.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });