"use client";

import { useState } from "react";
import { useFinanceStore } from "@/stores/useFinanceStore";
import type { Transaction } from "@/stores/useFinanceStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  TrendingUp,
  TrendingDown,
  Building,
  Car,
  Download
} from "lucide-react";
import { toast } from "sonner";

export default function TransactionsPage() {
  const { 
    transactions = [], 
    properties = [], 
    vehicles = [],
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    duplicateTransaction
  } = useFinanceStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    propertyId: "",
    vehicleId: "",
    receipt: ""
  });

  const categories = [
    "Alimentación",
    "Transporte",
    "Vivienda",
    "Servicios",
    "Entretenimiento",
    "Salud",
    "Educación",
    "Ropa",
    "Tecnología",
    "Otros"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || !formData.description) {
      toast.error("Por favor, completa todos los campos requeridos");
      return;
    }

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      propertyId: formData.propertyId || undefined,
      vehicleId: formData.vehicleId || undefined,
      receipt: formData.receipt || undefined
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData);
      toast.success("Transacción actualizada exitosamente");
    } else {
      addTransaction(transactionData);
      toast.success("Transacción agregada exitosamente");
    }

    setIsDialogOpen(false);
    setEditingTransaction(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: "expense",
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
      propertyId: "",
      vehicleId: "",
      receipt: ""
    });
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction?.type || "expense",
      category: transaction?.category || "",
      amount: transaction?.amount?.toString() || "",
      description: transaction?.description || "",
      date: transaction?.date || "",
      propertyId: transaction?.propertyId || "",
      vehicleId: transaction?.vehicleId || "",
      receipt: transaction?.receipt || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta transacción?")) {
      deleteTransaction(id);
      toast.success("Transacción eliminada exitosamente");
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateTransaction(id);
    toast.success("Transacción duplicada exitosamente");
  };

  const getAssociatedName = (transaction: Transaction) => {
    if (transaction?.propertyId) {
      const property = (properties || []).find(p => p?.id === transaction.propertyId);
      return property ? { name: property.name, icon: Building } : null;
    }
    if (transaction?.vehicleId) {
      const vehicle = (vehicles || []).find(v => v?.id === transaction.vehicleId);
      return vehicle ? { name: vehicle.name, icon: Car } : null;
    }
    return null;
  };

  const totalIncome = (transactions || [])
    .filter(t => t && t.type === 'income')
    .reduce((sum, t) => sum + (t?.amount || 0), 0);

  const totalExpenses = (transactions || [])
    .filter(t => t && t.type === 'expense')
    .reduce((sum, t) => sum + (t?.amount || 0), 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transacciones</h1>
          <p className="text-gray-600">Gestiona tus ingresos y gastos</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button 
              onClick={() => {
                console.log('Botón clickeado, estado actual:', isDialogOpen);
                setIsDialogOpen(true);
                console.log('Estado después de setIsDialogOpen(true):', true);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Transacción
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingTransaction ? "Editar Transacción" : "Agregar Nueva Transacción"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Tipo *</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as "income" | "expense" }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Ingreso</SelectItem>
                          <SelectItem value="expense">Gasto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Categoría *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            category ? (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ) : null
                          ))}
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
                      <Label htmlFor="date">Fecha *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descripción *</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descripción de la transacción"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="propertyId">Propiedad (opcional)</Label>
                      <Select value={formData.propertyId || "none"} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyId: value === "none" ? "" : value, vehicleId: "" }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar propiedad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Ninguna</SelectItem>
                          {Array.isArray(properties) && properties.map((property) => (
                            property?.id && property?.name ? (
                              <SelectItem key={property.id} value={property.id}>
                                {property.name}
                              </SelectItem>
                            ) : null
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="vehicleId">Vehículo (opcional)</Label>
                      <Select value={formData.vehicleId || "none"} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value === "none" ? "" : value, propertyId: "" }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar vehículo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Ninguno</SelectItem>
                          {Array.isArray(vehicles) && vehicles.map((vehicle) => (
                            vehicle?.id && vehicle?.name ? (
                              <SelectItem key={vehicle.id} value={vehicle.id}>
                                {vehicle.name}
                              </SelectItem>
                            ) : null
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingTransaction ? "Actualizar" : "Agregar"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalIncome.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gastos</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalExpenses.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <CreditCard className={`h-4 w-4 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${balance.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de transacciones */}
      {(transactions || []).length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay transacciones</h3>
            <p className="text-gray-600 text-center mb-4">
              Comienza agregando tu primera transacción para llevar un control de tus finanzas
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Transacciones ({(transactions || []).length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Asociado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(transactions || [])
                  .filter(transaction => transaction && transaction.id)
                  .sort((a, b) => new Date(b?.date || '').getTime() - new Date(a?.date || '').getTime())
                  .map((transaction) => {
                    const associated = getAssociatedName(transaction);
                    
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <Badge 
                            variant={transaction?.type === 'income' ? 'default' : 'secondary'}
                            className={transaction?.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          >
                            {transaction?.type === 'income' ? 'Ingreso' : 'Gasto'}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction?.category || 'N/A'}</TableCell>
                        <TableCell>{transaction?.description || 'N/A'}</TableCell>
                        <TableCell className={`font-medium ${transaction?.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          ${(transaction?.amount || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>{transaction?.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>
                          {associated && (
                            <div className="flex items-center gap-2">
                              {associated.icon && <associated.icon className="h-4 w-4" />}
                              <span className="text-sm">{associated.name}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(transaction)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDuplicate(transaction?.id || '')}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(transaction?.id || '')}
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
