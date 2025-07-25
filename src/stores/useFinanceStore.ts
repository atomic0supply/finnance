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
  isLoading: boolean;
  error: string | null;
  
  // User actions
  setUser: (user: User | null) => void;
  
  // Loading and error management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Data fetching
  fetchTransactions: () => Promise<void>;
  fetchProperties: () => Promise<void>;
  fetchVehicles: () => Promise<void>;
  fetchServices: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  
  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  duplicateTransaction: (id: string) => Promise<void>;
  
  // Property actions
  addProperty: (property: Omit<Property, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  
  // Vehicle actions
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  
  // Service actions
  addService: (service: Omit<Service, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  toggleServiceStatus: (id: string) => Promise<void>;
  
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

// API helper functions
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      properties: [],
      vehicles: [],
      services: [],
      user: null,
      isLoading: false,
      error: null,
      
      // User actions
      setUser: (user) => set({ user }),
      
      // Loading and error management
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Data fetching
      fetchTransactions: async () => {
        try {
          set({ isLoading: true, error: null });
          const data = await apiRequest('/api/transactions');
          // La API de transacciones devuelve un objeto con transactions y pagination
          set({ transactions: data.transactions || [] });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch transactions' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchProperties: async () => {
        try {
          set({ isLoading: true, error: null });
          const data = await apiRequest('/api/properties');
          // La API devuelve directamente el array de propiedades
          set({ properties: data || [] });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch properties' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchVehicles: async () => {
        try {
          set({ isLoading: true, error: null });
          const data = await apiRequest('/api/vehicles');
          // La API devuelve directamente el array de vehículos
          set({ vehicles: data || [] });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch vehicles' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchServices: async () => {
        try {
          set({ isLoading: true, error: null });
          const data = await apiRequest('/api/services');
          // La API devuelve directamente el array de servicios
          set({ services: data || [] });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch services' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchAllData: async () => {
        const { fetchTransactions, fetchProperties, fetchVehicles, fetchServices } = get();
        await Promise.all([
          fetchTransactions(),
          fetchProperties(),
          fetchVehicles(),
          fetchServices(),
        ]);
      },
      
      // Transaction actions
      addTransaction: async (transaction) => {
        try {
          set({ isLoading: true, error: null });
          const data = await apiRequest('/api/transactions', {
            method: 'POST',
            body: JSON.stringify(transaction),
          });
          set((state) => ({
            transactions: [...state.transactions, data]
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add transaction' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateTransaction: async (id, transaction) => {
        try {
          set({ isLoading: true, error: null });
          const data = await apiRequest(`/api/transactions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(transaction),
          });
          set((state) => ({
            transactions: state.transactions.map((t) =>
              t.id === id ? data : t
            )
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update transaction' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      deleteTransaction: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await apiRequest(`/api/transactions/${id}`, {
            method: 'DELETE',
          });
          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id)
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete transaction' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      duplicateTransaction: async (id) => {
        const { transactions, addTransaction } = get();
        const transaction = transactions.find((t) => t.id === id);
        if (transaction) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id: _id, userId: _userId, createdAt: _createdAt, updatedAt: _updatedAt, ...transactionData } = transaction;
          await addTransaction({
            ...transactionData,
            description: `${transactionData.description} (Copy)`,
          });
        }
      },
      
      // Property actions
      addProperty: async (property) => {
        try {
          set({ isLoading: true, error: null });
          const data = await apiRequest('/api/properties', {
            method: 'POST',
            body: JSON.stringify(property),
          });
          set((state) => ({
            properties: [...state.properties, data]
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add property' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateProperty: async (id, property) => {
        try {
          set({ isLoading: true, error: null });
          const data = await apiRequest(`/api/properties/${id}`, {
            method: 'PUT',
            body: JSON.stringify(property),
          });
          set((state) => ({
            properties: state.properties.map((p) =>
              p.id === id ? data : p
            )
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update property' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      deleteProperty: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await apiRequest(`/api/properties/${id}`, {
            method: 'DELETE',
          });
          set((state) => ({
            properties: state.properties.filter((p) => p.id !== id)
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete property' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Vehicle actions
      addVehicle: async (vehicle) => {
        try {
          set({ isLoading: true, error: null });
          const data = await apiRequest('/api/vehicles', {
            method: 'POST',
            body: JSON.stringify(vehicle),
          });
          set((state) => ({
            vehicles: [...state.vehicles, data]
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add vehicle' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateVehicle: async (id, vehicle) => {
        try {
          set({ isLoading: true, error: null });
          const data = await apiRequest(`/api/vehicles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(vehicle),
          });
          set((state) => ({
            vehicles: state.vehicles.map((v) =>
              v.id === id ? data : v
            )
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update vehicle' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      deleteVehicle: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await apiRequest(`/api/vehicles/${id}`, {
            method: 'DELETE',
          });
          set((state) => ({
            vehicles: state.vehicles.filter((v) => v.id !== id)
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete vehicle' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Service actions
      addService: async (service) => {
        try {
          set({ isLoading: true, error: null });
          const data = await apiRequest('/api/services', {
            method: 'POST',
            body: JSON.stringify(service),
          });
          set((state) => ({
            services: [...state.services, data]
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add service' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateService: async (id, service) => {
        try {
          set({ isLoading: true, error: null });
          const data = await apiRequest(`/api/services/${id}`, {
            method: 'PUT',
            body: JSON.stringify(service),
          });
          set((state) => ({
            services: state.services.map((s) =>
              s.id === id ? data : s
            )
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update service' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      deleteService: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await apiRequest(`/api/services/${id}`, {
            method: 'DELETE',
          });
          set((state) => ({
            services: state.services.filter((s) => s.id !== id)
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete service' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      toggleServiceStatus: async (id) => {
        const service = get().services.find(s => s.id === id);
        if (service) {
          await get().updateService(id, { isActive: !service.isActive });
        }
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
