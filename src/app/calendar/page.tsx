"use client";

import { useState } from "react";
import { useFinanceStore } from "@/stores/useFinanceStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  DollarSign
} from "lucide-react";

export default function CalendarPage() {
  const { services, getUpcomingPayments } = useFinanceStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const upcomingPayments = getUpcomingPayments();

  const getPaymentsForDate = (date: Date) => {
    return upcomingPayments.filter(service => {
      const paymentDate = new Date(service.nextPayment);
      return paymentDate.toDateString() === date.toDateString();
    });
  };

  const getPaymentsByMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    return upcomingPayments.filter(service => {
      const paymentDate = new Date(service.nextPayment);
      return paymentDate.getFullYear() === year && paymentDate.getMonth() === month;
    });
  };

  const getTotalMonthlyAmount = (date: Date) => {
    const monthlyPayments = getPaymentsByMonth(date);
    return monthlyPayments.reduce((total, service) => total + service.amount, 0);
  };

  const getPaymentStatus = (daysUntilPayment: number) => {
    if (daysUntilPayment < 0) return { status: 'overdue', color: 'bg-red-100 text-red-800', icon: AlertCircle };
    if (daysUntilPayment <= 7) return { status: 'due-soon', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    return { status: 'upcoming', color: 'bg-green-100 text-green-800', icon: CheckCircle };
  };

  const selectedDatePayments = selectedDate ? getPaymentsForDate(selectedDate) : [];
  const currentMonthTotal = getTotalMonthlyAmount(selectedDate || new Date());

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendario de Pagos</h1>
          <p className="text-gray-600">Visualiza tus próximos pagos y fechas importantes</p>
        </div>
        
        <div className="flex items-center gap-2 text-lg font-semibold">
          <DollarSign className="h-5 w-5" />
          Total del mes: ${currentMonthTotal.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  hasPayments: (date) => getPaymentsForDate(date).length > 0
                }}
                modifiersStyles={{
                  hasPayments: { 
                    backgroundColor: '#3b82f6', 
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }}
              />
              
              {selectedDate && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Pagos para {selectedDate.toLocaleDateString()}
                  </h3>
                  {selectedDatePayments.length === 0 ? (
                    <p className="text-gray-600 text-sm">No hay pagos programados para este día</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDatePayments.map((service) => {
                        const { color, icon: Icon } = getPaymentStatus(service.daysUntilPayment);
                        return (
                          <div key={service.id} className="flex items-center justify-between p-2 bg-white rounded border">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span className="font-medium">{service.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className={color}>
                                ${service.amount.toLocaleString()}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Próximos pagos */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Próximos Pagos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingPayments.length === 0 ? (
                <p className="text-gray-600 text-sm">No hay pagos programados</p>
              ) : (
                <div className="space-y-3">
                  {upcomingPayments.slice(0, 10).map((service) => {
                    const { color, icon: Icon } = getPaymentStatus(service.daysUntilPayment);
                    return (
                      <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <div>
                            <p className="font-medium text-sm">{service.name}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(service.nextPayment).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${service.amount.toLocaleString()}</div>
                          <Badge variant="secondary" className={`${color} text-xs`}>
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

          {/* Resumen de estados */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Vencidos</span>
                  </div>
                  <Badge variant="destructive">
                    {upcomingPayments.filter(s => s.daysUntilPayment < 0).length}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Próximos 7 días</span>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {upcomingPayments.filter(s => s.daysUntilPayment >= 0 && s.daysUntilPayment <= 7).length}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Próximos</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {upcomingPayments.filter(s => s.daysUntilPayment > 7).length}
                  </Badge>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total servicios activos</span>
                    <span>{services.filter(s => s.isActive).length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
