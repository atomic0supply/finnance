export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language: 'es' | 'en';
  currency: 'USD' | 'EUR' | 'MXN';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    upcomingPayments: boolean;
    budgetAlerts: boolean;
  };
}

export interface Permission {
  resource: 'transactions' | 'properties' | 'vehicles' | 'services' | 'users' | 'reports';
  actions: ('create' | 'read' | 'update' | 'delete' | 'export')[];
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isDefault: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  
  // Permission checks
  hasPermission: (resource: string, action: string) => boolean;
  canAccess: (path: string) => boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'user' | 'viewer';
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  permissions: Permission[];
  iat: number;
  exp: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
}
