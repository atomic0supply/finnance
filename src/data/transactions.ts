export interface Transaction {
  id: string;
  date: string; // ISO date string
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  propertyId?: string;
  vehicleId?: string;
  serviceId?: string;
  receipt?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const transactions: Transaction[] = [
  { 
    id: '1', 
    date: '2024-01-05', 
    description: 'Salary', 
    category: 'Income', 
    type: 'income', 
    amount: 5000,
    userId: '1',
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z'
  },
  { 
    id: '2', 
    date: '2024-01-10', 
    description: 'Groceries', 
    category: 'Food', 
    type: 'expense', 
    amount: 120,
    userId: '1',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z'
  },
  { 
    id: '3', 
    date: '2024-01-15', 
    description: 'Electricity Bill', 
    category: 'Utilities', 
    type: 'expense', 
    amount: 60,
    userId: '1',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  { 
    id: '4', 
    date: '2024-02-03', 
    description: 'Freelance Project', 
    category: 'Income', 
    type: 'income', 
    amount: 800,
    userId: '2',
    createdAt: '2024-02-03T00:00:00.000Z',
    updatedAt: '2024-02-03T00:00:00.000Z'
  },
  { 
    id: '5', 
    date: '2024-02-14', 
    description: 'Restaurant', 
    category: 'Food', 
    type: 'expense', 
    amount: 45,
    userId: '2',
    createdAt: '2024-02-14T00:00:00.000Z',
    updatedAt: '2024-02-14T00:00:00.000Z'
  },
  { 
    id: '6', 
    date: '2024-03-07', 
    description: 'Rent', 
    category: 'Housing', 
    type: 'expense', 
    amount: 1000,
    userId: '1',
    createdAt: '2024-03-07T00:00:00.000Z',
    updatedAt: '2024-03-07T00:00:00.000Z'
  },
  { 
    id: '7', 
    date: '2024-03-18', 
    description: 'Stock Dividend', 
    category: 'Investment', 
    type: 'income', 
    amount: 200,
    userId: '1',
    createdAt: '2024-03-18T00:00:00.000Z',
    updatedAt: '2024-03-18T00:00:00.000Z'
  },
  { 
    id: '8', 
    date: '2023-11-22', 
    description: 'Car Repair', 
    category: 'Transport', 
    type: 'expense', 
    amount: 300,
    userId: '2',
    createdAt: '2023-11-22T00:00:00.000Z',
    updatedAt: '2023-11-22T00:00:00.000Z'
  },
  { 
    id: '9', 
    date: '2023-12-02', 
    description: 'Bonus', 
    category: 'Income', 
    type: 'income', 
    amount: 1200,
    userId: '1',
    createdAt: '2023-12-02T00:00:00.000Z',
    updatedAt: '2023-12-02T00:00:00.000Z'
  },
  { 
    id: '10', 
    date: '2024-04-13', 
    description: 'New Laptop', 
    category: 'Electronics', 
    type: 'expense', 
    amount: 1500,
    userId: '1',
    createdAt: '2024-04-13T00:00:00.000Z',
    updatedAt: '2024-04-13T00:00:00.000Z'
  }
];

export default transactions;
