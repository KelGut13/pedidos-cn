import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Lock, 
  LogIn, 
  Eye, 
  EyeOff,
  Shield,
  Sparkles
} from 'lucide-react';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();
  
  // Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Si está cargando la verificación del token, mostrar pantalla de carga
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Verificando sesión...</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      const resultado = await login(email.trim(), contrasena.trim());
      
      if (resultado.success) {
        // Redirigir al dashboard
        navigate('/');
      } else {
        setError(resultado.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error de login:', error);
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-decoracion login-decoracion-1"></div>
        <div className="login-decoracion login-decoracion-2"></div>
        <div className="login-decoracion login-decoracion-3"></div>
      </div>

      <motion.div 
        className="login-wrapper"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="login-header"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="login-icon-wrapper">
            <Shield className="login-main-icon" />
          </div>
          <h1 className="login-title">
            <Sparkles className="login-sparkle" />
            Pedidos CN
          </h1>
          <p className="login-subtitle">Accede a tu cuenta</p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="login-form"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {error && (
            <motion.div 
              className="login-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <div className="login-field-group">
            <label className="login-label">Email</label>
            <div className="login-input-wrapper">
              <User className="login-input-icon" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="Ingresa tu email"
                required
              />
            </div>
          </div>

          <div className="login-field-group">
            <label className="login-label">Contraseña</label>
            <div className="login-input-wrapper">
              <Lock className="login-input-icon" size={20} />
              <input
                type={mostrarContrasena ? "text" : "password"}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="login-input"
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                className="login-toggle-password"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
              >
                {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <motion.button 
            type="submit" 
            className="login-button"
            disabled={cargando}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {cargando ? (
              <div className="login-loading">
                <div className="login-spinner"></div>
                <span>Verificando...</span>
              </div>
            ) : (
              <>
                <LogIn size={20} />
                <span>Iniciar Sesión</span>
              </>
            )}
          </motion.button>
        </motion.form>

        <motion.div 
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p>Sistema de Pedidos</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
