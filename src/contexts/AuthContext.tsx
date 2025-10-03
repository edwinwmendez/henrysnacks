import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
} | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case 'LOGIN_ERROR':
    case 'REGISTER_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Inicia en true para verificar localStorage
  error: null
};

// Simulated users database
const mockUsers: User[] = [
  {
    id: '1',
    name: 'María García',
    email: 'maria@example.com',
    phone: '+51 987654321',
    role: 'customer',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Admin Usuario',
    email: 'admin@henrysnacks.pe',
    phone: '+51 999888777',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('auth_user');
        dispatch({ type: 'LOGOUT' });
      }
    } else {
      // No hay usuario guardado, terminar carga
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user in mock database
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Usuario no encontrado' });
      return;
    }

    // Simulate password validation (in real app, this would be done on server)
    if (password.length < 6) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Contraseña incorrecta' });
      return;
    }

    // Store user in localStorage
    localStorage.setItem('auth_user', JSON.stringify(user));
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
  };
  const register = async (name: string, email: string, phone: string, _password: string): Promise<void> => {
    dispatch({ type: 'REGISTER_START' });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      dispatch({ type: 'REGISTER_ERROR', payload: 'Este email ya está registrado' });
      return;
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    // Add to mock database
    mockUsers.push(newUser);

    // Store user in localStorage
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    dispatch({ type: 'REGISTER_SUCCESS', payload: newUser });
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{
      state,
      login,
      register,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}