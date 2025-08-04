import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Package, Filter, Eye, Calendar, User, DollarSign, Clock, ChevronRight, Search, RefreshCw, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { pedidosService } from '../services/api';
import PedidosDropdown from './PedidosDropdown';
import './PedidosView.css';

const PedidosView = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados disponibles para filtrar
  const estados = ['todos', 'pendiente', 'procesando', 'completado', 'cancelado', 'enviado', 'entregado'];

  // Opciones para el dropdown de estados
  const estadosOptions = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'procesando', label: 'Procesando' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'entregado', label: 'Entregado' },
    { value: 'completado', label: 'Completado' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  const cargarPedidos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pedidosService.getAll();
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setError('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      // Usamos updateEstado en lugar de update para enviar solo el estado
      // a la ruta correcta del backend
      await pedidosService.updateEstado(id, nuevoEstado);
      
      // Recargar pedidos después de actualizar
      cargarPedidos();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert('Error al actualizar el estado del pedido');
    }
  };

  const formatearMoneda = (cantidad) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(cantidad || 0);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'pendiente': { bg: '#FEF3C7', text: '#D97706', border: '#F59E0B' },
      'procesando': { bg: '#DBEAFE', text: '#2563EB', border: '#3B82F6' },
      'completado': { bg: '#D1FAE5', text: '#059669', border: '#10B981' },
      'cancelado': { bg: '#FEE2E2', text: '#DC2626', border: '#EF4444' },
      'enviado': { bg: '#EDE9FE', text: '#7C3AED', border: '#8B5CF6' },
      'entregado': { bg: '#DCFCE7', text: '#16A34A', border: '#22C55E' }
    };
    return colores[estado] || { bg: '#F3F4F6', text: '#6B7280', border: '#9CA3AF' };
  };

  const getEstadoIcon = (estado) => {
    const iconos = {
      'pendiente': Clock,
      'procesando': RefreshCw,
      'completado': Package,
      'cancelado': 'X',
      'enviado': ChevronRight,
      'entregado': Package
    };
    return iconos[estado] || Clock;
  };

  // Filtrar pedidos basado en búsqueda y estado
  const pedidosFiltrados = pedidos.filter(pedido => {
    const matchSearch = searchTerm === '' || 
      pedido.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.id.toString().includes(searchTerm) ||
      pedido.cliente_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchEstado = filtroEstado === 'todos' || pedido.estado === filtroEstado;
    
    return matchSearch && matchEstado;
  });

  if (loading) {
    return (
      <div className="pedidos-view">
        <div className="pedidos-loading-container">
          <div className="pedidos-loading-spinner"></div>
          <p className="pedidos-loading-text">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pedidos-view">
        <div className="pedidos-error-container">
          <p>{error}</p>
          <button className="pedidos-retry-button" onClick={cargarPedidos}>
            <RefreshCw size={16} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pedidos-view">
      {/* Header con estadísticas */}
      <div className="pedidos-header">
        <div className="pedidos-header-content">
          <div className="header-info">
            <div className="pedidos-title-section">
              <div className="pedidos-title-icon">
                {/* Icono de carrito de compras */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <div>
                <h1 className="pedidos-title">Gestión de Pedidos</h1>
                <p className="pedidos-subtitle">Total: {pedidosFiltrados.length} pedidos</p>
              </div>
            </div>
          </div>
          
          <button 
            className="pedidos-refresh-button"
            onClick={cargarPedidos}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'pedidos-spinning' : ''} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="pedidos-filters-section">
        <div className="pedidos-search-container">
          <Search size={20} className="pedidos-search-icon" />
          <input
            type="text"
            placeholder="Buscar por cliente, email o número de pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pedidos-search-input"
          />
        </div>
        
        <div className="pedidos-filter-container">
          <Filter size={16} className="pedidos-filter-icon" />
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="pedidos-filter-select"
          >
            {estados.map(estado => (
              <option key={estado} value={estado}>
                {estado === 'todos' ? 'Todos los estados' : estado.charAt(0).toUpperCase() + estado.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="pedidos-container">
        {pedidosFiltrados.length > 0 ? (
          <div className="pedidos-grid">
            {pedidosFiltrados.map((pedido, index) => {
              const estadoInfo = getEstadoColor(pedido.estado);
              const EstadoIcon = getEstadoIcon(pedido.estado);
              
              return (
                <motion.div
                  key={pedido.id}
                  className="pedidos-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  {/* Header del card */}
                  <div className="pedidos-card-header">
                    <div className="pedidos-number">
                      <Package size={16} />
                      <span>#{pedido.id}</span>
                    </div>
                    <div 
                      className="pedidos-estado-badge-new"
                      style={{ 
                        backgroundColor: estadoInfo.bg,
                        color: estadoInfo.text,
                        border: `1px solid ${estadoInfo.border}`
                      }}
                    >
                      {EstadoIcon !== 'X' && typeof EstadoIcon !== 'string' && (
                        <EstadoIcon size={12} />
                      )}
                      <span>{pedido.estado}</span>
                    </div>
                  </div>

                  {/* Información del cliente */}
                  <div className="pedidos-cliente-section">
                    <div className="pedidos-cliente-main">
                      <div className="pedidos-cliente-avatar">
                        <span className="pedidos-cliente-iniciales">
                          {(pedido.nombre_cliente || pedido.cliente_nombre || pedido.nombre) ? 
                          (pedido.nombre_cliente || pedido.cliente_nombre || pedido.nombre).charAt(0).toUpperCase() : 
                          'C'}
                        </span>
                      </div>
                      <div className="pedidos-cliente-details">
                        <h3 className="pedidos-cliente-nombre">{pedido.nombre_cliente || pedido.cliente_nombre || pedido.nombre || 'Cliente'}</h3>
                        <p className="pedidos-cliente-email">{pedido.cliente_email || pedido.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Información de fecha y total */}
                  <div className="pedidos-info">
                    <div className="pedidos-info-item">
                      <Calendar size={14} />
                      <span className="pedidos-info-text">{formatearFecha(pedido.fecha)}</span>
                    </div>
                    <div className="pedidos-info-item">
                      <DollarSign size={14} />
                      <span className="pedidos-info-amount">{formatearMoneda(pedido.total)}</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="pedidos-card-actions">
                    <PedidosDropdown
                      value={pedido.estado}
                      onChange={(nuevoEstado) => actualizarEstado(pedido.id, nuevoEstado)}
                      options={estadosOptions}
                      className="pedidos-estado-dropdown"
                    />
                    
                    <Link 
                      to={`/pedidos/${pedido.id}`} 
                      className="pedidos-view-button"
                    >
                      <Eye size={16} />
                      <span>Ver</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="pedidos-empty-state">
            <Package size={48} className="pedidos-empty-state-icon" />
            <h3>No se encontraron pedidos</h3>
            <p>
              {searchTerm || filtroEstado !== 'todos' 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Aún no hay pedidos registrados en el sistema'
              }
            </p>
            {(searchTerm || filtroEstado !== 'todos') && (
              <button 
                className="pedidos-clear-filters-button"
                onClick={() => {
                  setSearchTerm('');
                  setFiltroEstado('todos');
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidosView;
