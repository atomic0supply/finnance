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
import { Car, Plus, Edit, Trash2, Bike, Truck } from "lucide-react";
import { toast } from "sonner";

export default function VehiclesPage() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, getTransactionsByVehicle } = useFinanceStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    plate: "",
    type: "car" as const,
    notes: ""
  });

  const vehicleTypeIcons = {
    car: Car,
    motorcycle: Bike,
    truck: Truck,
    other: Car
  };

  const vehicleTypeLabels = {
    car: "Automóvil",
    motorcycle: "Motocicleta",
    truck: "Camión",
    other: "Otro"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.brand || !formData.model || !formData.year || !formData.plate) {
      toast.error("Por favor, completa todos los campos requeridos");
      return;
    }

    const vehicleData = {
      ...formData,
      year: parseInt(formData.year)
    };

    if (editingVehicle) {
      updateVehicle(editingVehicle.id, vehicleData);
      toast.success("Vehículo actualizado exitosamente");
    } else {
      addVehicle(vehicleData);
      toast.success("Vehículo agregado exitosamente");
    }

    setIsDialogOpen(false);
    setEditingVehicle(null);
    setFormData({
      name: "",
      brand: "",
      model: "",
      year: "",
      plate: "",
      type: "car",
      notes: ""
    });
  };

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year.toString(),
      plate: vehicle.plate,
      type: vehicle.type,
      notes: vehicle.notes || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {
      deleteVehicle(id);
      toast.success("Vehículo eliminado exitosamente");
    }
  };

  const getTotalSpent = (vehicleId: string) => {
    const transactions = getTransactionsByVehicle(vehicleId);
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehículos</h1>
          <p className="text-gray-600">Gestiona tus vehículos y gastos asociados</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Vehículo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? "Editar Vehículo" : "Agregar Nuevo Vehículo"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Mi Coche"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Marca *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="Toyota"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="model">Modelo *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="Corolla"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Año *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2020"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="plate">Placa *</Label>
                  <Input
                    id="plate"
                    value={formData.plate}
                    onChange={(e) => setFormData(prev => ({ ...prev, plate: e.target.value }))}
                    placeholder="ABC-123"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Automóvil</SelectItem>
                    <SelectItem value="motorcycle">Motocicleta</SelectItem>
                    <SelectItem value="truck">Camión</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
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
                  {editingVehicle ? "Actualizar" : "Agregar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Car className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay vehículos</h3>
            <p className="text-gray-600 text-center mb-4">
              Comienza agregando tu primer vehículo para llevar un control de gastos asociados
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Mis Vehículos ({vehicles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Marca/Modelo</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Gastos Total</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => {
                  const Icon = vehicleTypeIcons[vehicle.type];
                  const totalSpent = getTotalSpent(vehicle.id);
                  
                  return (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {vehicle.name}
                        </div>
                      </TableCell>
                      <TableCell>{vehicle.brand} {vehicle.model}</TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell>{vehicle.plate}</TableCell>
                      <TableCell>{vehicleTypeLabels[vehicle.type]}</TableCell>
                      <TableCell>
                        <span className="text-red-600 font-medium">
                          ${totalSpent.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(vehicle)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(vehicle.id)}
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
