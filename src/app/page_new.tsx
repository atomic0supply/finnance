import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Finnance</h1>
              <span className="ml-2 text-sm text-gray-500">v2.0</span>
            </div>
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Gestiona tus finanzas
            <span className="text-blue-600"> con confianza</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Sistema completo de gestión financiera personal con autenticación segura, 
            control de gastos, seguimiento de propiedades y vehículos, y reportes detallados.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="px-8 py-3">
                Comenzar Gratis
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 py-3">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900">Características Principales</h3>
          <p className="mt-4 text-lg text-gray-600">
            Todo lo que necesitas para controlar tus finanzas personales
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                Gestión de Transacciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Registra y categoriza todos tus ingresos y gastos. 
                Duplica transacciones recurrentes y mantén un historial completo.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                Propiedades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Administra tus bienes inmuebles, registra gastos asociados 
                y mantén un seguimiento del valor de tus propiedades.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🚗</span>
                Vehículos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Controla los gastos de mantenimiento, combustible y seguros 
                de todos tus vehículos en un solo lugar.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Reportes Detallados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Visualiza tus finanzas con gráficos y reportes personalizados. 
                Analiza tendencias y toma decisiones informadas.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔔</span>
                Servicios Recurrentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Programa recordatorios para pagos recurrentes como suscripciones, 
                servicios y seguros. Nunca olvides un pago.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔐</span>
                Seguridad Avanzada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Autenticación JWT, roles de usuario y permisos granulares. 
                Tus datos están protegidos con los más altos estándares.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900">Seguridad de Nivel Empresarial</h3>
            <p className="mt-4 text-lg text-gray-600">
              Tu información financiera está protegida con las mejores prácticas de seguridad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Autenticación JWT
              </h4>
              <p className="text-gray-600">
                Tokens seguros con expiración automática y renovación transparente
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Control de Acceso
              </h4>
              <p className="text-gray-600">
                Roles de usuario y permisos granulares para cada funcionalidad
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Datos Protegidos
              </h4>
              <p className="text-gray-600">
                Encriptación de passwords y filtrado automático por usuario
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Prueba la Aplicación
          </h3>
          <p className="text-gray-600 mb-6">
            Usa estas credenciales para probar todas las funcionalidades
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Cuenta Administrador</h4>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> admin@finnance.com<br />
                <strong>Contraseña:</strong> admin123
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Acceso completo a todas las funcionalidades
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Cuenta Usuario</h4>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> user@finnance.com<br />
                <strong>Contraseña:</strong> user123
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Acceso a funcionalidades de usuario regular
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/login">
              <Button size="lg" className="px-8 py-3">
                Probar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Finnance</h4>
              <p className="text-gray-400">
                Sistema completo de gestión financiera personal con 
                seguridad empresarial.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Características</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Gestión de Transacciones</li>
                <li>Control de Propiedades</li>
                <li>Seguimiento de Vehículos</li>
                <li>Reportes Detallados</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Seguridad</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Autenticación JWT</li>
                <li>Control de Acceso</li>
                <li>Roles de Usuario</li>
                <li>Datos Encriptados</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentación API</li>
                <li>Guía de Seguridad</li>
                <li>Casos de Uso</li>
                <li>Mejores Prácticas</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Finnance. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
