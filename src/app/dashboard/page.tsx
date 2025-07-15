"use client";

import { useFinanceStore } from "@/stores/useFinanceStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Building, 
  Car, 
  Settings, 
  Calendar,
  AlertTriangle,
  Plus
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { 
    transactions, 
    properties, 
    vehicles, 
    services, 
    getUpcomingPayments 
  } = useFinanceStore();

  const upcomingPayments = getUpcomingPayments();
  const overduePayments = upcomingPayments.filter(s => s.daysUntilPayment < 0);
  const dueSoonPayments = upcomingPayments.filter(s => s.daysUntilPayment >= 0 && s.daysUntilPayment <= 7);

  // Calcular estadísticas
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const activeServices = services.filter(s => s.isActive);
  const monthlyServiceCost = activeServices
    .filter(s => s.frequency === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0);

  const stats = [
    {
      title: "Balance Total",
      value: `$${balance.toLocaleString()}`,
      icon: DollarSign,
      color: balance >= 0 ? "text-green-600" : "text-red-600"
    },
    {
      title: "Ingresos",
      value: `$${totalIncome.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Gastos",
      value: `$${totalExpenses.toLocaleString()}`,
      icon: TrendingDown,
      color: "text-red-600"
    },
    {
      title: "Servicios Mensuales",
      value: `$${monthlyServiceCost.toLocaleString()}`,
      icon: Settings,
      color: "text-blue-600"
    }
  ];

  const quickActions = [
    {
      title: "Agregar Transacción",
      href: "/transactions",
      icon: Plus,
      description: "Registra un nuevo ingreso o gasto"
    },
    {
      title: "Gestionar Propiedades",
      href: "/properties",
      icon: Building,
      description: `${properties.length} propiedades registradas`
    },
    {
      title: "Gestionar Vehículos",
      href: "/vehicles",
      icon: Car,
      description: `${vehicles.length} vehículos registrados`
    },
    {
      title: "Ver Calendario",
      href: "/calendar",
      icon: Calendar,
      description: "Próximos pagos y fechas importantes"
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen de tu situación financiera</p>
      </div>

      {/* Alertas */}
      {(overduePayments.length > 0 || dueSoonPayments.length > 0) && (
        <div className="mb-6 space-y-4">
          {overduePayments.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-900">Pagos Vencidos</h3>
                    <p className="text-sm text-red-700">
                      Tienes {overduePayments.length} pago(s) vencido(s)
                    </p>
                  </div>
                  <Link href="/calendar" className="ml-auto">
                    <Button variant="outline" size="sm" className="border-red-300">
                      Ver Calendario
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {dueSoonPayments.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-yellow-900">Próximos Pagos</h3>
                    <p className="text-sm text-yellow-700">
                      {dueSoonPayments.length} pago(s) en los próximos 7 días
                    </p>
                  </div>
                  <Link href="/calendar" className="ml-auto">
                    <Button variant="outline" size="sm" className="border-yellow-300">
                      Ver Calendario
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} href={action.href}>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium">{action.title}</h4>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Próximos pagos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Próximos Pagos
              <Link href="/calendar">
                <Button variant="outline" size="sm">Ver Todos</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingPayments.length === 0 ? (
              <p className="text-gray-600 text-sm">No hay pagos programados</p>
            ) : (
              <div className="space-y-3">
                {upcomingPayments.slice(0, 5).map((service) => {
                  const isOverdue = service.daysUntilPayment < 0;
                  const isDueSoon = service.daysUntilPayment >= 0 && service.daysUntilPayment <= 7;
                  
                  return (
                    <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{service.name}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(service.nextPayment).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${service.amount.toLocaleString()}</div>
                        <Badge 
                          variant={isOverdue ? "destructive" : isDueSoon ? "secondary" : "outline"}
                          className={isDueSoon ? "bg-yellow-100 text-yellow-800" : ""}
                        >
                          {service.daysUntilPayment >= 0 
                            ? `${service.daysUntilPayment} días` 
                            : 'Vencido'
                          }
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
