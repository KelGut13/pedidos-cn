import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
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
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener estadísticas de pedidos
      const pedidosResponse = await fetch('http://localhost:5002/api/pedidos');
      const pedidos = await pedidosResponse.json();

      // Calcular estadísticas
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const pedidosHoy = pedidos.filter(pedido => 
        new Date(pedido.fecha_pedido) >= startOfDay
      ).length;

      const pedidosMes = pedidos.filter(pedido => 
        new Date(pedido.fecha_pedido) >= startOfMonth
      );

      const ingresosMes = pedidosMes.reduce((total, pedido) => 
        total + parseFloat(pedido.total || 0), 0
      );

      // Clientes únicos este mes
      const clientesUnicos = new Set(pedidosMes.map(pedido => pedido.usuario_id));

      setStats({
        totalPedidos: pedidos.length,
        pedidosHoy: pedidosHoy,
        ingresosMes: ingresosMes,
        clientesActivos: clientesUnicos.size
      });

      // Obtener pedidos recientes (últimos 5)
      const pedidosRecientes = pedidos
        .sort((a, b) => new Date(b.fecha_pedido) - new Date(a.fecha_pedido))
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
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendiente': return 'pendiente';
      case 'procesando': return 'procesando';
      case 'completado': return 'completado';
      case 'cancelado': return 'cancelado';
      default: return 'pendiente';
    }
  };

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
      <h2 className="dashboard-title">Dashboard - Resumen General</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{stats.totalPedidos}</div>
          <div className="stat-label">Total Pedidos</div>
          <div className="stat-trend positive">
            ↗ Todos los tiempos
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{stats.pedidosHoy}</div>
          <div className="stat-label">Pedidos Hoy</div>
          <div className="stat-trend positive">
            📅 {new Date().toLocaleDateString('es-CO')}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">{formatCurrency(stats.ingresosMes)}</div>
          <div className="stat-label">Ingresos Este Mes</div>
          <div className="stat-trend positive">
            📈 Mes actual
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.clientesActivos}</div>
          <div className="stat-label">Clientes Activos</div>
          <div className="stat-trend positive">
            🗓️ Este mes
          </div>
        </div>
      </div>

      <div className="recent-orders">
        <h3>Pedidos Recientes</h3>
        {recentOrders.length > 0 ? (
          <div className="orders-list">
            {recentOrders.map(order => (
              <div key={order.id} className="order-item">
                <div className="order-info">
                  <div className="order-icon">📋</div>
                  <div className="order-details">
                    <h4>Pedido #{order.id}</h4>
                    <p>Cliente ID: {order.usuario_id} • {formatDate(order.fecha_pedido)}</p>
                  </div>
                </div>
                <div className={`order-status ${getStatusColor(order.estado)}`}>
                  {order.estado || 'Pendiente'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-state-icon">📋</span>
            <h3>No hay pedidos recientes</h3>
            <p>Los nuevos pedidos aparecerán aquí</p>
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div className="actions-grid">
          <Link to="/pedidos" className="action-card">
            <div className="action-icon">📦</div>
            <div className="action-content">
              <h4>Ver Todos los Pedidos</h4>
              <p>Gestionar y revisar pedidos</p>
            </div>
          </Link>

          <Link to="/productos" className="action-card">
            <div className="action-icon">💍</div>
            <div className="action-content">
              <h4>Administrar Productos</h4>
              <p>Catálogo de joyería</p>
            </div>
          </Link>

          <Link to="/clientes" className="action-card">
            <div className="action-icon">👥</div>
            <div className="action-content">
              <h4>Gestionar Clientes</h4>
              <p>Base de datos de clientes</p>
            </div>
          </Link>

          <Link to="/reportes" className="action-card">
            <div className="action-icon">📈</div>
            <div className="action-content">
              <h4>Ver Reportes</h4>
              <p>Análisis y estadísticas</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
