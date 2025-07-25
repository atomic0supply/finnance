"use client";

import { useState } from "react";
import { useFinanceStore, Property } from "@/stores/useFinanceStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Plus, Edit, Trash2, Home, Building2, Briefcase } from "lucide-react";
import { toast } from "sonner";

export default function PropertiesPage() {
  const { properties, addProperty, updateProperty, deleteProperty, getTransactionsByProperty } = useFinanceStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "home" as "home" | "villa" | "apartment" | "office" | "other",
    address: "",
    value: "",
    notes: ""
  });

  const propertyTypeIcons = {
    home: Home,
    villa: Building2,
    apartment: Building,
    office: Briefcase,
    other: Building
  };

  const propertyTypeLabels = {
    home: "Casa",
    villa: "Villa",
    apartment: "Apartamento",
    office: "Oficina",
    other: "Otro"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address) {
      toast.error("Por favor, completa todos los campos requeridos");
      return;
    }

    const propertyData = {
      ...formData,
      value: formData.value ? parseFloat(formData.value) : undefined
    };

    if (editingProperty) {
      updateProperty(editingProperty.id, propertyData);
      toast.success("Propiedad actualizada exitosamente");
    } else {
      addProperty(propertyData);
      toast.success("Propiedad agregada exitosamente");
    }

    setIsDialogOpen(false);
    setEditingProperty(null);
    setFormData({
      name: "",
      type: "home",
      address: "",
      value: "",
      notes: ""
    });
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      name: property?.name || "",
      type: property?.type || "",
      address: property?.address || "",
      value: property?.value?.toString() || "",
      notes: property?.notes || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta propiedad?")) {
      deleteProperty(id);
      toast.success("Propiedad eliminada exitosamente");
    }
  };

  const getTotalSpent = (propertyId: string) => {
    const transactions = getTransactionsByProperty(propertyId);
    return (transactions || [])
      .filter(t => t && t.type === 'expense')
      .reduce((total, t) => total + (t?.amount || 0), 0);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Propiedades</h1>
          <p className="text-gray-600">Gestiona tus propiedades y gastos asociados</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Propiedad
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProperty ? "Editar Propiedad" : "Agregar Nueva Propiedad"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Casa Principal"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as "home" | "villa" | "apartment" | "office" | "other" }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Casa</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="apartment">Apartamento</SelectItem>
                    <SelectItem value="office">Oficina</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Dirección completa"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="value">Valor (opcional)</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="0.00"
                />
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
                  {editingProperty ? "Actualizar" : "Agregar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {(properties || []).length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay propiedades</h3>
            <p className="text-gray-600 text-center mb-4">
              Comienza agregando tu primera propiedad para llevar un control de gastos asociados
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Mis Propiedades ({(properties || []).length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Gastos Total</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(properties || []).filter(property => property && property.id).map((property) => {
                  const Icon = propertyTypeIcons[property?.type] || Building;
                  const totalSpent = getTotalSpent(property.id);
                  
                  return (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {property.name}
                        </div>
                      </TableCell>
                      <TableCell>{propertyTypeLabels[property?.type] || 'N/A'}</TableCell>
                      <TableCell>{property.address}</TableCell>
                      <TableCell>
                        {property.value ? `$${property.value.toLocaleString()}` : "N/A"}
                      </TableCell>
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
                            onClick={() => handleEdit(property)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(property.id)}
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
