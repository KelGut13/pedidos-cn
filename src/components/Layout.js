import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, LogOut, Sparkles } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Add logout logic here if needed
    console.log('Logout clicked');
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
