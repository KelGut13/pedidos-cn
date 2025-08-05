import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

// Crear contexto de autenticación
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar token al cargar
  useEffect(() => {
    const validarToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.validarToken(token);
        
        if (response.success) {
          // Token válido, pero necesitamos obtener datos del usuario
          // Para ahora usamos los datos del localStorage si existen
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
          } else {
            // Si no hay datos del usuario guardados, hacemos logout
            logout();
          }
        } else {
          // Token inválido, limpiar estado
          logout();
        }
      } catch (error) {
        console.error('Error al validar token:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    validarToken();
  }, [token]);

  // Función de login
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        const { token, usuario } = response;
        
        // Guardar token y usuario en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(usuario));
        
        // Actualizar estado
        setToken(token);
        setCurrentUser(usuario);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Error de login:', error);
      
      const errorMessage = error.response?.data?.error || 
                           'Error al iniciar sesión. Verifica tus credenciales.';
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Función de logout
  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpiar estado
    setToken(null);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
