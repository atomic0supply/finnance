import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, RegisterData, LoginResponse } from '@/types/auth';
import { hasPermission, canAccessRoute } from '@/config/roles';

interface AuthStore extends AuthState {
  // Additional state
  tokenExpiry: string | null;
  lastActivity: string | null;
  
  // Internal methods
  setUser: (user: User) => void;
  setTokens: (token: string, refreshToken: string, expiresAt: string) => void;
  clearAuth: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  updateLastActivity: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      tokenExpiry: null,
      lastActivity: null,

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setTokens: (token: string, refreshToken: string, expiresAt: string) => {
        set({ 
          token, 
          refreshToken, 
          tokenExpiry: expiresAt,
          isAuthenticated: true 
        });
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          tokenExpiry: null,
          lastActivity: null,
          error: null
        });
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      updateLastActivity: () => {
        set({ lastActivity: new Date().toISOString() });
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
          }

          const data: LoginResponse = await response.json();
          
          set({
            user: data.user,
            token: data.token,
            refreshToken: data.refreshToken,
            tokenExpiry: data.expiresAt,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            lastActivity: new Date().toISOString()
          });

        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
            isAuthenticated: false
          });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Registration failed');
          }

          const data: LoginResponse = await response.json();
          
          set({
            user: data.user,
            token: data.token,
            refreshToken: data.refreshToken,
            tokenExpiry: data.expiresAt,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            lastActivity: new Date().toISOString()
          });

        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false,
            isAuthenticated: false
          });
          throw error;
        }
      },

      logout: () => {
        const { token } = get();
        
        // Call logout endpoint to invalidate token
        if (token) {
          fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }).catch(() => {
            // Ignore errors on logout
          });
        }

        get().clearAuth();
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          get().clearAuth();
          throw new Error('No refresh token available');
        }

        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (!response.ok) {
            get().clearAuth();
            throw new Error('Token refresh failed');
          }

          const data: LoginResponse = await response.json();
          
          set({
            user: data.user,
            token: data.token,
            refreshToken: data.refreshToken,
            tokenExpiry: data.expiresAt,
            isAuthenticated: true,
            lastActivity: new Date().toISOString()
          });

        } catch (error) {
          get().clearAuth();
          throw error;
        }
      },

      updateProfile: async (userData: Partial<User>) => {
        const { token, user } = get();
        
        if (!token || !user) {
          throw new Error('Not authenticated');
        }

        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Profile update failed');
          }

          const updatedUser: User = await response.json();
          set({ user: updatedUser });

        } catch (error) {
          throw error;
        }
      },

      changePassword: async (oldPassword: string, newPassword: string) => {
        const { token } = get();
        
        if (!token) {
          throw new Error('Not authenticated');
        }

        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ oldPassword, newPassword }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Password change failed');
          }

        } catch (error) {
          throw error;
        }
      },

      hasPermission: (resource: string, action: string) => {
        const { user } = get();
        if (!user) return false;

        // Admin has all permissions
        if (user.role === 'admin') return true;

        // Get permissions from role configuration
        const rolePermissions = get().user?.role ? 
          require('@/config/roles').DEFAULT_PERMISSIONS[user.role] || [] : [];

        return hasPermission(rolePermissions, resource, action);
      },

      canAccess: (path: string) => {
        const { user } = get();
        if (!user) return false;

        return canAccessRoute(user.role, path);
      },
    }),
    {
      name: 'auth-storage',
      version: 1,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        tokenExpiry: state.tokenExpiry,
        isAuthenticated: state.isAuthenticated,
        lastActivity: state.lastActivity
      }),
    }
  )
);

// Auto-refresh token when it's about to expire
let refreshTimer: NodeJS.Timeout | null = null;

export function setupTokenRefresh() {
  const checkAndRefresh = () => {
    const { token, tokenExpiry, refreshAuth, clearAuth } = useAuthStore.getState();
    
    if (!token || !tokenExpiry) return;

    const expiryTime = new Date(tokenExpiry).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    // Refresh if token expires in 5 minutes
    if (expiryTime - now < fiveMinutes) {
      refreshAuth().catch(() => {
        clearAuth();
      });
    }
  };

  // Clear existing timer
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }

  // Check every minute
  refreshTimer = setInterval(checkAndRefresh, 60 * 1000);

  // Initial check
  checkAndRefresh();
}

// Activity tracker
export function trackActivity() {
  const { isAuthenticated, updateLastActivity } = useAuthStore.getState();
  
  if (isAuthenticated) {
    updateLastActivity();
  }
}
