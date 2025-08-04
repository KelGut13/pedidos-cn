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
      <div className="pedido-details-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando detalles del pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="pedido-details-container">
        <div className="error-container">
          <div className="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p className="error-text">{error || 'Pedido no encontrado'}</p>
          <div className="error-actions">
            <button onClick={cargarPedido} className="btn-retry">Reintentar</button>
            <Link to="/pedidos" className="btn-back">Volver a pedidos</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pedido-details-container">
      {/* Header */}
      <div className="details-header">
        <div className="header-top">
          <Link to="/pedidos" className="btn-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Volver a pedidos
          </Link>
        </div>
        <div className="header-content">
          <div className="header-left">
            <h1 className="pedido-title">Pedido #{pedido.id}</h1>
            <div className="pedido-badge-container">
              <span 
                className={`status-badge ${pedido.estado}`}
              >
                {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
              </span>
            </div>
          </div>
          <div className="header-actions">
            <div className="estado-dropdown-wrapper">
              <select 
                value={pedido.estado}
                onChange={(e) => actualizarEstado(e.target.value)}
                disabled={actualizandoEstado}
                className="estado-select"
              >
                <option value="pendiente">Pendiente</option>
                <option value="procesando">Procesando</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
              {actualizandoEstado && <div className="estado-loading"></div>}
            </div>
          </div>
        </div>
      </div>

      <div className="details-content">
        <div className="details-grid">
          {/* Panel izquierdo - Información del pedido y cliente */}
          <div className="panel-left">
            {/* Información del pedido */}
            <div className="info-card">
              <div className="info-card-header">
                <h2 className="info-card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                    <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                  </svg>
                  Información del Pedido
                </h2>
              </div>
              <div className="info-card-content">
                <div className="info-row">
                  <div className="info-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Fecha del pedido
                  </div>
                  <div className="info-value">{formatearFecha(pedido.fecha)}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    Total
                  </div>
                  <div className="info-value total-amount">{formatearMoneda(pedido.total)}</div>
                </div>
              </div>
            </div>

            {/* Información del cliente */}
            <div className="info-card">
              <div className="info-card-header">
                <h2 className="info-card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Información del Cliente
                </h2>
              </div>
              <div className="info-card-content">
                <div className="cliente-card">
                  <div className="cliente-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div className="cliente-info">
                    <h3 className="cliente-nombre">{pedido.cliente_nombre}</h3>
                    <div className="cliente-contacto">
                      <div className="contacto-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        {pedido.cliente_email}
                      </div>
                      {pedido.cliente_telefono && (
                        <div className="contacto-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                          {pedido.cliente_telefono}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dirección de entrega */}
            {pedido.calle && (
              <div className="info-card">
                <div className="info-card-header">
                  <h2 className="info-card-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    Dirección de Entrega
                  </h2>
                </div>
                <div className="info-card-content">
                  <div className="direccion-card">
                    <div className="direccion-content">
                      {pedido.direccion_alias && <h4 className="direccion-alias">{pedido.direccion_alias}</h4>}
                      <div className="direccion-item">
                        {pedido.calle} {pedido.numero_exterior}
                        {pedido.numero_interior && ` Int. ${pedido.numero_interior}`}
                      </div>
                      <div className="direccion-item">
                        {pedido.colonia}, {pedido.ciudad}
                      </div>
                      <div className="direccion-item">
                        {pedido.direccion_estado} {pedido.codigo_postal}
                      </div>
                      <div className="direccion-item">
                        {pedido.pais}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Panel derecho - Productos */}
          <div className="panel-right">
            <div className="info-card productos-card">
              <div className="info-card-header">
                <h2 className="info-card-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  Productos ({pedido.detalles?.length || 0})
                </h2>
              </div>
              <div className="info-card-content">
                {pedido.detalles && pedido.detalles.length > 0 ? (
                  <div className="productos-list">
                    {pedido.detalles.map((item) => (
                      <div key={item.ID_detalle} className="producto-item">
                        <div className="producto-info">
                          <h4 className="producto-nombre">{item.producto_nombre}</h4>
                          <p className="producto-descripcion">{item.producto_descripcion}</p>
                          
                          <div className="producto-meta">
                            {item.nombre_marca && (
                              <div className="meta-tag">
                                <span className="meta-label">Marca:</span>
                                <span className="meta-value">{item.nombre_marca}</span>
                              </div>
                            )}
                            {item.nombre_material && (
                              <div className="meta-tag">
                                <span className="meta-label">Material:</span>
                                <span className="meta-value">{item.nombre_material}</span>
                              </div>
                            )}
                            {item.nombre_categoria && (
                              <div className="meta-tag">
                                <span className="meta-label">Categoría:</span>
                                <span className="meta-value">{item.nombre_categoria}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="producto-pricing">
                          <div className="precio-item cantidad">
                            <span className="precio-label">Cantidad:</span>
                            <span className="precio-value">{item.cantidad}</span>
                          </div>
                          <div className="precio-item precio-unitario">
                            <span className="precio-label">Precio unitario:</span>
                            <span className="precio-value">{formatearMoneda(item.precio_unitario)}</span>
                          </div>
                          <div className="precio-item subtotal">
                            <span className="precio-label">Subtotal:</span>
                            <span className="precio-value">{formatearMoneda(item.precio_unitario * item.cantidad)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
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
                  <div className="no-productos">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <p>No hay productos en este pedido</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoDetails;
