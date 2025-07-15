import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth';

// Types
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  propertyId?: string;
  vehicleId?: string;
  serviceId?: string;
  receipt?: string;
  userId: string; // Add user association
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  name: string;
  type: 'home' | 'villa' | 'apartment' | 'office' | 'other';
  address: string;
  value?: number;
  notes?: string;
  userId: string; // Add user association
  createdAt: string;
}

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  type: 'car' | 'motorcycle' | 'truck' | 'other';
  notes?: string;
  userId: string; // Add user association
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  type: 'subscription' | 'utility' | 'membership' | 'insurance' | 'other';
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  nextPayment: string;
  propertyId?: string;
  vehicleId?: string;
  isActive: boolean;
  notes?: string;
  userId: string; // Add user association
  createdAt: string;
}

interface FinanceState {
  transactions: Transaction[];
  properties: Property[];
  vehicles: Vehicle[];
  services: Service[];
  user: User | null;
  
  // User actions
  setUser: (user: User | null) => void;
  
  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  duplicateTransaction: (id: string) => void;
  
  // Property actions
  addProperty: (property: Omit<Property, 'id' | 'userId' | 'createdAt'>) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  
  // Vehicle actions
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'userId' | 'createdAt'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  
  // Service actions
  addService: (service: Omit<Service, 'id' | 'userId' | 'createdAt'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  toggleServiceStatus: (id: string) => void;
  
  // Utility functions
  getTransactionsByProperty: (propertyId: string) => Transaction[];
  getTransactionsByVehicle: (vehicleId: string) => Transaction[];
  getServicesByProperty: (propertyId: string) => Service[];
  getServicesByVehicle: (vehicleId: string) => Service[];
  getUpcomingPayments: () => (Service & { daysUntilPayment: number })[];
  
  // User-specific data filters
  getUserTransactions: () => Transaction[];
  getUserProperties: () => Property[];
  getUserVehicles: () => Vehicle[];
  getUserServices: () => Service[];
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      properties: [],
      vehicles: [],
      services: [],
      user: null,
      
      // User actions
      setUser: (user) => set({ user }),
      
      // Transaction actions
      addTransaction: (transaction) => {
        const { user } = get();
        if (!user) throw new Error('User not authenticated');
        
        const newTransaction = {
          ...transaction,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          userId: user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction]
        }));
      },
      
      updateTransaction: (id, updatedTransaction) => {
        set((state) => ({
          transactions: state.transactions.map(transaction =>
            transaction.id === id ? { ...transaction, ...updatedTransaction, updatedAt: new Date().toISOString() } : transaction
          )
        }));
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter(transaction => transaction.id !== id)
        }));
      },
      
      duplicateTransaction: (id) => {
        const { user } = get();
        if (!user) throw new Error('User not authenticated');
        
        const transaction = get().transactions.find(t => t.id === id);
        if (transaction) {
          const duplicated = {
            ...transaction,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          set((state) => ({
            transactions: [...state.transactions, duplicated]
          }));
        }
      },
      
      // Property actions
      addProperty: (property) => {
        const { user } = get();
        if (!user) throw new Error('User not authenticated');
        
        const newProperty = {
          ...property,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          userId: user.id,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          properties: [...state.properties, newProperty]
        }));
      },
      
      updateProperty: (id, updatedProperty) => {
        set((state) => ({
          properties: state.properties.map(property =>
            property.id === id ? { ...property, ...updatedProperty } : property
          )
        }));
      },
      
      deleteProperty: (id) => {
        set((state) => ({
          properties: state.properties.filter(property => property.id !== id)
        }));
      },
      
      // Vehicle actions
      addVehicle: (vehicle) => {
        const { user } = get();
        if (!user) throw new Error('User not authenticated');
        
        const newVehicle = {
          ...vehicle,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          userId: user.id,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          vehicles: [...state.vehicles, newVehicle]
        }));
      },
      
      updateVehicle: (id, updatedVehicle) => {
        set((state) => ({
          vehicles: state.vehicles.map(vehicle =>
            vehicle.id === id ? { ...vehicle, ...updatedVehicle } : vehicle
          )
        }));
      },
      
      deleteVehicle: (id) => {
        set((state) => ({
          vehicles: state.vehicles.filter(vehicle => vehicle.id !== id)
        }));
      },
      
      // Service actions
      addService: (service) => {
        const { user } = get();
        if (!user) throw new Error('User not authenticated');
        
        const newService = {
          ...service,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          userId: user.id,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          services: [...state.services, newService]
        }));
      },
      
      updateService: (id, updatedService) => {
        set((state) => ({
          services: state.services.map(service =>
            service.id === id ? { ...service, ...updatedService } : service
          )
        }));
      },
      
      deleteService: (id) => {
        set((state) => ({
          services: state.services.filter(service => service.id !== id)
        }));
      },
      
      toggleServiceStatus: (id) => {
        set((state) => ({
          services: state.services.map(service =>
            service.id === id ? { ...service, isActive: !service.isActive } : service
          )
        }));
      },
      
      // Utility functions
      getTransactionsByProperty: (propertyId) => {
        const { user } = get();
        if (!user) return [];
        return get().transactions.filter(transaction => 
          transaction.propertyId === propertyId && transaction.userId === user.id
        );
      },
      
      getTransactionsByVehicle: (vehicleId) => {
        const { user } = get();
        if (!user) return [];
        return get().transactions.filter(transaction => 
          transaction.vehicleId === vehicleId && transaction.userId === user.id
        );
      },
      
      getServicesByProperty: (propertyId) => {
        const { user } = get();
        if (!user) return [];
        return get().services.filter(service => 
          service.propertyId === propertyId && service.userId === user.id
        );
      },
      
      getServicesByVehicle: (vehicleId) => {
        const { user } = get();
        if (!user) return [];
        return get().services.filter(service => 
          service.vehicleId === vehicleId && service.userId === user.id
        );
      },
      
      getUpcomingPayments: () => {
        const { user } = get();
        if (!user) return [];
        
        const services = get().services.filter(service => 
          service.isActive && service.userId === user.id
        );
        
        return services.map(service => {
          const nextPayment = new Date(service.nextPayment);
          const today = new Date();
          const diffTime = nextPayment.getTime() - today.getTime();
          const daysUntilPayment = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return {
            ...service,
            daysUntilPayment
          };
        }).sort((a, b) => a.daysUntilPayment - b.daysUntilPayment);
      },
      
      // User-specific data filters
      getUserTransactions: () => {
        const { user } = get();
        if (!user) return [];
        return get().transactions.filter(transaction => transaction.userId === user.id);
      },
      
      getUserProperties: () => {
        const { user } = get();
        if (!user) return [];
        return get().properties.filter(property => property.userId === user.id);
      },
      
      getUserVehicles: () => {
        const { user } = get();
        if (!user) return [];
        return get().vehicles.filter(vehicle => vehicle.userId === user.id);
      },
      
      getUserServices: () => {
        const { user } = get();
        if (!user) return [];
        return get().services.filter(service => service.userId === user.id);
      },
    }),
    {
      name: 'finance-storage',
      version: 1,
      partialize: (state) => ({
        // Only persist user data, not sensitive authentication info
        transactions: state.transactions,
        properties: state.properties,
        vehicles: state.vehicles,
        services: state.services,
        user: state.user
      }),
    }
  )
);
