import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, LogOut, Sparkles, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          {/* Brand */}
          <div className="brand">
            <div className="brand-icon">
              <Sparkles />
            </div>
            <div className="brand-text">
              <h1>Pedidos CN</h1>
              <p>Sistema de Gestión</p>
            </div>
          </div>
          
          {/* User info */}
          {currentUser && (
            <div className="user-info">
              <div className="user-avatar">
                <User size={18} />
              </div>
              <div className="user-details">
                <span className="user-name">{currentUser.nombre}</span>
                <span className="user-role">{currentUser.nombre_rol}</span>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Navigation */}
        <nav className="navigation">
          <div className="nav-container">
            <Link 
              to="/" 
              className={`nav-item ${isActive('/') ? 'active' : ''}`}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/pedidos" 
              className={`nav-item ${isActive('/pedidos') ? 'active' : ''}`}
            >
              <Package size={20} />
              <span>Pedidos</span>
            </Link>
          </div>
        </nav>

        {/* Content Area */}
        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
