import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, DollarSign, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { pedidosService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    totalPedidos: 0,
    pedidosHoy: 0,
    ingresosMes: 0,
    clientesActivos: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Solo cargar datos si el usuario está autenticado y no está cargando la auth
    if (isAuthenticated && !authLoading) {
      fetchDashboardData();
    }
  }, [isAuthenticated, authLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Usar el servicio de API que tiene configurado el token automáticamente
      const pedidosData = await pedidosService.getAll();
      
      // Extraer el array de pedidos de la respuesta
      const pedidos = pedidosData.success ? pedidosData.data : [];

      // Verificar que pedidos sea un array
      if (!Array.isArray(pedidos)) {
        throw new Error('Los datos de pedidos no son válidos');
      }

      // Calcular estadísticas
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const pedidosHoy = pedidos.filter(pedido => 
        new Date(pedido.fecha) >= startOfDay
      ).length;

      const pedidosMes = pedidos.filter(pedido => 
        new Date(pedido.fecha) >= startOfMonth
      );

      const ingresosMes = pedidosMes.reduce((total, pedido) => 
        total + parseFloat(pedido.total || 0), 0
      );

      // Clientes únicos este mes (usando email como identificador)
      const clientesUnicos = new Set(pedidosMes.map(pedido => pedido.email));

      setStats({
        totalPedidos: pedidos.length,
        pedidosHoy: pedidosHoy,
        ingresosMes: ingresosMes,
        clientesActivos: clientesUnicos.size
      });

      // Obtener pedidos recientes (últimos 5)
      const pedidosRecientes = pedidos
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5);

      setRecentOrders(pedidosRecientes);

    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusClass = (estado) => {
    switch (estado.toLowerCase()) {
      case 'entregado': return 'entregado';
      case 'enviado': return 'enviado';
      case 'procesando': return 'procesando';
      case 'completado': return 'completado';
      case 'cancelado': return 'cancelado';
      default: return 'pendiente';
    }
  };

  // Si está cargando la autenticación, mostrar pantalla de carga
  if (authLoading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (el router debería redirigir)
  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchDashboardData}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <motion.h2 
        className="dashboard-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard
      </motion.h2>
      
      <motion.div 
        className="stats-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalPedidos}</div>
            <div className="stat-label">Total Pedidos</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon today">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.pedidosHoy}</div>
            <div className="stat-label">Pedidos Hoy</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.ingresosMes)}</div>
            <div className="stat-label">Ingresos Mes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.clientesActivos}</div>
            <div className="stat-label">Clientes Activos</div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="recent-orders"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="section-header">
          <h3>Pedidos Recientes</h3>
          <Link to="/pedidos" className="view-all-btn">
            <Eye size={16} />
            <span>Ver todos</span>
          </Link>
        </div>
        {recentOrders.length > 0 ? (
          <div className="orders-list">
            {recentOrders.map((order, index) => (
              <motion.div 
                key={order.id} 
                className="order-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="order-info">
                  <div className="order-icon">
                    <Package size={20} />
                  </div>
                  <div className="order-details">
                    <h4>Pedido #{order.id}</h4>
                    <p>{order.nombre_cliente} • {formatDate(order.fecha)}</p>
                  </div>
                </div>
                <div className={`order-status ${getStatusClass(order.estado)}`}>
                  {order.estado || 'Pendiente'}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Package size={32} className="empty-state-icon" />
            <h3>No hay pedidos recientes</h3>
            <p>Los nuevos pedidos aparecerán aquí</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
