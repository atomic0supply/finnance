"use client";

import { useState } from "react";
import { useFinanceStore } from "@/stores/useFinanceStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings, Plus, Edit, Trash2, Wifi, Zap, Shield, Calendar, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";

export default function ServicesPage() {
  const { services, addService, updateService, deleteService, toggleServiceStatus, properties, vehicles } = useFinanceStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "subscription" as const,
    amount: "",
    frequency: "monthly" as const,
    nextPayment: "",
    propertyId: "",
    vehicleId: "",
    notes: ""
  });

  const serviceTypeIcons = {
    subscription: Wifi,
    utility: Zap,
    membership: Shield,
    insurance: Shield,
    other: Settings
  };

  const serviceTypeLabels = {
    subscription: "Suscripción",
    utility: "Servicio Público",
    membership: "Membresía",
    insurance: "Seguro",
    other: "Otro"
  };

  const frequencyLabels = {
    monthly: "Mensual",
    quarterly: "Trimestral",
    yearly: "Anual"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount || !formData.nextPayment) {
      toast.error("Por favor, completa todos los campos requeridos");
      return;
    }

    const serviceData = {
      ...formData,
      amount: parseFloat(formData.amount),
      propertyId: formData.propertyId || undefined,
      vehicleId: formData.vehicleId || undefined,
      isActive: true
    };

    if (editingService) {
      updateService(editingService.id, serviceData);
      toast.success("Servicio actualizado exitosamente");
    } else {
      addService(serviceData);
      toast.success("Servicio agregado exitosamente");
    }

    setIsDialogOpen(false);
    setEditingService(null);
    setFormData({
      name: "",
      type: "subscription",
      amount: "",
      frequency: "monthly",
      nextPayment: "",
      propertyId: "",
      vehicleId: "",
      notes: ""
    });
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      type: service.type,
      amount: service.amount.toString(),
      frequency: service.frequency,
      nextPayment: service.nextPayment,
      propertyId: service.propertyId || "",
      vehicleId: service.vehicleId || "",
      notes: service.notes || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      deleteService(id);
      toast.success("Servicio eliminado exitosamente");
    }
  };

  const handleToggleStatus = (id: string) => {
    toggleServiceStatus(id);
    toast.success("Estado del servicio actualizado");
  };

  const getDaysUntilPayment = (nextPayment: string) => {
    const today = new Date();
    const payment = new Date(nextPayment);
    const diffTime = payment.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getAssociatedName = (service: any) => {
    if (service.propertyId) {
      const property = properties.find(p => p.id === service.propertyId);
      return property ? `📍 ${property.name}` : "";
    }
    if (service.vehicleId) {
      const vehicle = vehicles.find(v => v.id === service.vehicleId);
      return vehicle ? `🚗 ${vehicle.name}` : "";
    }
    return "";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Servicios</h1>
          <p className="text-gray-600">Gestiona tus servicios recurrentes y suscripciones</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Editar Servicio" : "Agregar Nuevo Servicio"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Netflix"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subscription">Suscripción</SelectItem>
                      <SelectItem value="utility">Servicio Público</SelectItem>
                      <SelectItem value="membership">Membresía</SelectItem>
                      <SelectItem value="insurance">Seguro</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="frequency">Frecuencia</Label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensual</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Monto *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="nextPayment">Próximo Pago *</Label>
                  <Input
                    id="nextPayment"
                    type="date"
                    value={formData.nextPayment}
                    onChange={(e) => setFormData(prev => ({ ...prev, nextPayment: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="propertyId">Propiedad (opcional)</Label>
                  <Select value={formData.propertyId} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyId: value, vehicleId: "" }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar propiedad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Ninguna</SelectItem>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="vehicleId">Vehículo (opcional)</Label>
                  <Select value={formData.vehicleId} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value, propertyId: "" }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Ninguno</SelectItem>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Información adicional"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingService ? "Actualizar" : "Agregar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay servicios</h3>
            <p className="text-gray-600 text-center mb-4">
              Comienza agregando tu primer servicio recurrente para llevar un control de pagos
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Mis Servicios ({services.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Frecuencia</TableHead>
                  <TableHead>Próximo Pago</TableHead>
                  <TableHead>Asociado</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => {
                  const Icon = serviceTypeIcons[service.type];
                  const daysUntilPayment = getDaysUntilPayment(service.nextPayment);
                  const associatedName = getAssociatedName(service);
                  
                  return (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {service.name}
                        </div>
                      </TableCell>
                      <TableCell>{serviceTypeLabels[service.type]}</TableCell>
                      <TableCell>${service.amount.toLocaleString()}</TableCell>
                      <TableCell>{frequencyLabels[service.frequency]}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(service.nextPayment).toLocaleDateString()}
                          <span className={`text-sm ${daysUntilPayment <= 7 ? 'text-red-600' : 'text-gray-600'}`}>
                            ({daysUntilPayment >= 0 ? `${daysUntilPayment} días` : 'Vencido'})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{associatedName}</span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(service.id)}
                        >
                          {service.isActive ? (
                            <ToggleRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(service)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(service.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
