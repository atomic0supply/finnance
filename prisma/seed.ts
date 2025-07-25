import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuarios iniciales
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const defaultPreferences = {
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

  const adminPreferences = {
    ...defaultPreferences,
    notifications: {
      ...defaultPreferences.notifications,
      push: true
    }
  };

  // Crear usuario administrador
  const admin = await prisma.user.upsert({
    where: { email: 'admin@finnance.com' },
    update: {},
    create: {
      email: 'admin@finnance.com',
      name: 'Admin User',
      role: 'admin',
      passwordHash: adminPassword,
      isActive: true,
      preferences: adminPreferences,
      lastLogin: new Date()
    }
  });

  console.log('✅ Usuario administrador creado:', admin.email);

  // Crear usuario regular
  const user = await prisma.user.upsert({
    where: { email: 'user@finnance.com' },
    update: {},
    create: {
      email: 'user@finnance.com',
      name: 'Regular User',
      role: 'user',
      passwordHash: userPassword,
      isActive: true,
      preferences: defaultPreferences,
      lastLogin: new Date()
    }
  });

  console.log('✅ Usuario regular creado:', user.email);

  // Crear algunas propiedades de ejemplo
  const property1 = await prisma.property.create({
    data: {
      name: 'Casa Principal',
      type: 'house',
      address: 'Calle Principal 123',
      purchasePrice: 250000,
      currentValue: 280000,
      userId: user.id
    }
  });

  const property2 = await prisma.property.create({
    data: {
      name: 'Apartamento Centro',
      type: 'apartment',
      address: 'Avenida Central 456',
      purchasePrice: 150000,
      currentValue: 165000,
      userId: user.id
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
      purchasePrice: 25000,
      currentValue: 22000,
      userId: user.id
    }
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      name: 'Honda Civic',
      brand: 'Honda',
      model: 'Civic',
      year: 2019,
      purchasePrice: 23000,
      currentValue: 20000,
      userId: user.id
    }
  });

  console.log('✅ Vehículos de ejemplo creados');

  // Crear algunos servicios de ejemplo
  const service1 = await prisma.service.create({
    data: {
      name: 'Netflix',
      category: 'entertainment',
      monthlyPrice: 15.99,
      isActive: true,
      userId: user.id
    }
  });

  const service2 = await prisma.service.create({
    data: {
      name: 'Spotify',
      category: 'entertainment',
      monthlyPrice: 9.99,
      isActive: true,
      userId: user.id
    }
  });

  const service3 = await prisma.service.create({
    data: {
      name: 'Seguro Auto',
      category: 'insurance',
      monthlyPrice: 120.00,
      isActive: true,
      userId: user.id
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
      userId: user.id
    },
    {
      description: 'Supermercado',
      category: 'groceries',
      type: 'expense' as const,
      amount: 150,
      date: new Date('2024-01-16'),
      userId: user.id
    },
    {
      description: 'Gasolina',
      category: 'transport',
      type: 'expense' as const,
      amount: 60,
      date: new Date('2024-01-17'),
      vehicleId: vehicle1.id,
      userId: user.id
    },
    {
      description: 'Pago Netflix',
      category: 'entertainment',
      type: 'expense' as const,
      amount: 15.99,
      date: new Date('2024-01-18'),
      serviceId: service1.id,
      userId: user.id
    },
    {
      description: 'Mantenimiento casa',
      category: 'maintenance',
      type: 'expense' as const,
      amount: 200,
      date: new Date('2024-01-19'),
      propertyId: property1.id,
      userId: user.id
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