import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Package, Filter, Eye, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { pedidosService } from '../services/api';
import './PedidosView.css';

const PedidosView = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  // Estados disponibles para filtrar
  const estados = ['todos', 'pendiente', 'procesando', 'completado', 'cancelado'];

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
      const pedidoActual = pedidos.find(p => p.id === id);
      await pedidosService.update(id, { 
        estado: nuevoEstado, 
        total: pedidoActual.total 
      });
      
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
      'pendiente': '#f59e0b',
      'completado': '#10b981',
      'cancelado': '#ef4444',
      'enviado': '#3b82f6',
      'entregado': '#22c55e'
    };
    return colores[estado] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="pedidos-view">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pedidos-view">
        <div className="error">
          <p>{error}</p>
          <button onClick={cargarPedidos}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pedidos-view">
      <div className="view-header">
        <div className="header-info">
          <h2>Gestión de Pedidos</h2>
          <p>Total: {pedidos.length} pedidos</p>
        </div>
        
        <div className="filters">
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="filter-select"
          >
            {estados.map(estado => (
              <option key={estado} value={estado}>
                {estado === 'todos' ? 'Todos los estados' : estado.charAt(0).toUpperCase() + estado.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pedidos-table-container">
        {pedidos.length > 0 ? (
          <table className="pedidos-table">
            <thead>
              <tr>
                <th>Pedido #</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>
                    <Link to={`/pedidos/${pedido.id}`} className="pedido-link">
                      #{pedido.id}
                    </Link>
                  </td>
                  <td>
                    <div className="cliente-info">
                      <strong>{pedido.cliente_nombre}</strong>
                      <div className="cliente-email">{pedido.cliente_email}</div>
                    </div>
                  </td>
                  <td>{formatearFecha(pedido.fecha)}</td>
                  <td className="total-amount">{formatearMoneda(pedido.total)}</td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getEstadoColor(pedido.estado) }}
                    >
                      {pedido.estado}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <select 
                        value={pedido.estado}
                        onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                        className="estado-select"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregado">Entregado</option>
                        <option value="completado">Completado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                      <Link to={`/pedidos/${pedido.id}`} className="btn-view">
                        Ver
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-pedidos">
            <p>No se encontraron pedidos</p>
            {filtroEstado !== 'todos' && (
              <button onClick={() => setFiltroEstado('todos')}>
                Ver todos los pedidos
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidosView;
