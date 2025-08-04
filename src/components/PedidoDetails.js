import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pedidosService } from '../services/api';
import './PedidoDetails.css';

const PedidoDetails = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actualizandoEstado, setActualizandoEstado] = useState(false);

  const cargarPedido = useCallback(async () => {
    try {
      setLoading(true);
      const response = await pedidosService.getById(id);
      setPedido(response.data);
    } catch (err) {
      setError('Error al cargar el pedido');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    cargarPedido();
  }, [cargarPedido]);

  const actualizarEstado = async (nuevoEstado) => {
    try {
      setActualizandoEstado(true);
      await pedidosService.updateEstado(id, nuevoEstado);
      
      // Actualizar el estado local
      setPedido(prev => ({
        ...prev,
        estado: nuevoEstado
      }));
      
      // Opcional: recargar el pedido completo
      // await cargarPedido();
      
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert('Error al actualizar el estado del pedido');
    } finally {
      setActualizandoEstado(false);
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  const calcularSubtotal = () => {
    if (!pedido?.detalles) return 0;
    return pedido.detalles.reduce((sum, item) => {
      return sum + (parseFloat(item.precio_unitario) * item.cantidad);
    }, 0);
  };

  if (loading) {
    return (
      <div className="pedido-details">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando detalles del pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="pedido-details">
        <div className="error">
          <p>{error || 'Pedido no encontrado'}</p>
          <div className="error-actions">
            <button onClick={cargarPedido}>Reintentar</button>
            <Link to="/pedidos" className="btn-back">Volver a pedidos</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pedido-details">
      {/* Header */}
      <div className="details-header">
        <div className="header-left">
          <Link to="/pedidos" className="btn-back">← Volver a pedidos</Link>
          <h1>Pedido #{pedido.id}</h1>
          <span 
            className="status-badge large" 
            style={{ backgroundColor: getEstadoColor(pedido.estado) }}
          >
            {pedido.estado}
          </span>
        </div>
        <div className="header-actions">
          <select 
            value={pedido.estado}
            onChange={(e) => actualizarEstado(e.target.value)}
            disabled={actualizandoEstado}
            className="estado-select"
          >
            <option value="pendiente">Pendiente</option>
            <option value="enviado">Enviado</option>
            <option value="entregado">Entregado</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="details-content">
        {/* Información del pedido */}
        <div className="info-section">
          <h2>Información del Pedido</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Fecha del pedido:</label>
              <span>{formatearFecha(pedido.fecha)}</span>
            </div>
            <div className="info-item">
              <label>Total:</label>
              <span className="total-amount">{formatearMoneda(pedido.total)}</span>
            </div>
          </div>
        </div>

        {/* Información del cliente */}
        <div className="info-section">
          <h2>Información del Cliente</h2>
          <div className="cliente-card">
            <div className="cliente-avatar">👤</div>
            <div className="cliente-info">
              <h3>{pedido.cliente_nombre}</h3>
              <p>📧 {pedido.cliente_email}</p>
              {pedido.cliente_telefono && <p>📱 {pedido.cliente_telefono}</p>}
            </div>
          </div>
        </div>

        {/* Dirección de entrega */}
        {pedido.calle && (
          <div className="info-section">
            <h2>Dirección de Entrega</h2>
            <div className="direccion-card">
              <div className="direccion-icon">📍</div>
              <div className="direccion-info">
                {pedido.direccion_alias && <h4>{pedido.direccion_alias}</h4>}
                <p>
                  {pedido.calle} {pedido.numero_exterior}
                  {pedido.numero_interior && ` Int. ${pedido.numero_interior}`}
                </p>
                <p>{pedido.colonia}, {pedido.ciudad}</p>
                <p>{pedido.direccion_estado} {pedido.codigo_postal}</p>
                <p>{pedido.pais}</p>
              </div>
            </div>
          </div>
        )}

        {/* Productos del pedido */}
        <div className="info-section">
          <h2>Productos ({pedido.detalles?.length || 0})</h2>
          {pedido.detalles && pedido.detalles.length > 0 ? (
            <div className="productos-list">
              {pedido.detalles.map((item) => (
                <div key={item.ID_detalle} className="producto-item">
                  <div className="producto-info">
                    <h4>{item.producto_nombre}</h4>
                    <p className="producto-descripcion">{item.producto_descripcion}</p>
                    <div className="producto-meta">
                      {item.nombre_marca && <span className="meta-item">🏷️ {item.nombre_marca}</span>}
                      {item.nombre_material && <span className="meta-item">⚡ {item.nombre_material}</span>}
                      {item.nombre_categoria && <span className="meta-item">📂 {item.nombre_categoria}</span>}
                      {item.nombre_genero && <span className="meta-item">👥 {item.nombre_genero}</span>}
                    </div>
                  </div>
                  <div className="producto-pricing">
                    <div className="cantidad">Cantidad: {item.cantidad}</div>
                    <div className="precio-unitario">
                      {formatearMoneda(item.precio_unitario)} c/u
                    </div>
                    <div className="subtotal">
                      {formatearMoneda(item.precio_unitario * item.cantidad)}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Resumen de precios */}
              <div className="pricing-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{formatearMoneda(calcularSubtotal())}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>{formatearMoneda(pedido.total)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="no-productos">No hay productos en este pedido</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PedidoDetails;
