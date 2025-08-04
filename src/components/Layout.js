import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="admin-info">
              <div className="admin-avatar">
                AS
              </div>
              <div className="admin-details">
                <h3>Admin Store</h3>
                <p>Sistema Administrador</p>
              </div>
            </div>
          </div>
          
          <div className="header-title">
            <h1>
              <span className="icon">💎</span>
              Panel de Administración - Joyería CN
            </h1>
            <p>Gestión de Pedidos y Productos</p>
          </div>
          
          <button className="logout-btn">
            <span>👤</span>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="main-content">
        <nav className="navigation">
          <Link 
            to="/" 
            className={`nav-item ${isActive('/') ? 'active' : ''}`}
          >
            <span>�</span>
            Dashboard
          </Link>
          <Link 
            to="/pedidos" 
            className={`nav-item ${isActive('/pedidos') ? 'active' : ''}`}
          >
            <span>📦</span>
            Pedidos
          </Link>
          <Link 
            to="/productos" 
            className={`nav-item ${isActive('/productos') ? 'active' : ''}`}
          >
            <span>💍</span>
            Productos
          </Link>
          <Link 
            to="/clientes" 
            className={`nav-item ${isActive('/clientes') ? 'active' : ''}`}
          >
            <span>👥</span>
            Clientes
          </Link>
          <Link 
            to="/reportes" 
            className={`nav-item ${isActive('/reportes') ? 'active' : ''}`}
          >
            <span>📈</span>
            Reportes
          </Link>
        </nav>

        <div className="status-indicators">
          <div className="status-indicator active">
            <div className="status-dot"></div>
            Sistema Activo
          </div>
          <div className="status-indicator">
            <span>🔗</span>
            Conectado a BD
          </div>
          <div className="status-indicator">
            <span>⚡</span>
            API Online
          </div>
        </div>

        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
