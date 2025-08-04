const { pool } = require('../config/database');
const connection = pool;

class PedidoModel {
  
  // Obtener todos los pedidos con información del usuario y dirección
  static async obtenerTodos() {
    try {
      const query = `
        SELECT 
          p.ID_pedido as id,
          p.fecha,
          p.total,
          p.estado,
          CONCAT(u.nombre, ' ', u.primer_apellido, ' ', COALESCE(u.segundo_apellido, '')) as nombre_cliente,
          u.email,
          u.telefono,
          CONCAT(d.calle, ' ', d.numero_exterior, 
                 CASE WHEN d.numero_interior != '' THEN CONCAT(' Int. ', d.numero_interior) ELSE '' END,
                 ', ', d.colonia, ', ', d.ciudad, ', ', d.estado, ' CP ', d.codigo_postal) as direccion_completa
        FROM pedidos p
        INNER JOIN usuarios u ON p.ID_usuario = u.ID_usuario
        INNER JOIN direcciones d ON p.ID_direccion = d.ID_direccion
        ORDER BY p.fecha DESC
      `;
      
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  }

      // Obtener un pedido por ID con todos los detalles
  static async obtenerPorId(id) {
    try {
      // Obtener información básica del pedido
      const queryPedido = `
        SELECT 
          p.ID_pedido as id,
          p.fecha,
          p.total,
          p.estado,
          CONCAT(u.nombre, ' ', u.primer_apellido, ' ', COALESCE(u.segundo_apellido, '')) as nombre_cliente,
          u.email,
          u.telefono,
          d.calle,
          d.numero_exterior,
          d.numero_interior,
          d.colonia,
          d.ciudad,
          d.estado as estado_direccion,
          d.codigo_postal,
          d.pais
        FROM pedidos p
        INNER JOIN usuarios u ON p.ID_usuario = u.ID_usuario
        INNER JOIN direcciones d ON p.ID_direccion = d.ID_direccion
        WHERE p.ID_pedido = ?
      `;
      
      const [pedidoRows] = await connection.execute(queryPedido, [id]);
      
      if (pedidoRows.length === 0) {
        return null;
      }
      
      const pedido = pedidoRows[0];
      
      // Obtener los productos del pedido
      const queryProductos = `
        SELECT 
          dp.cantidad,
          dp.precio_unitario,
          p.ID_producto,
          p.nombre,
          p.descripcion,
          p.imagen,
          m.nombre_marca,
          mt.nombre_material,
          c.nombre_categoria,
          g.nombre_genero,
          (dp.cantidad * dp.precio_unitario) as subtotal
        FROM detalle_pedido dp
        INNER JOIN productos p ON dp.ID_producto = p.ID_producto
        LEFT JOIN marcas m ON p.id_marca = m.ID_marca
        LEFT JOIN material mt ON p.id_material = mt.ID_material
        LEFT JOIN categorias c ON p.id_categoria = c.ID_categoria
        LEFT JOIN genero g ON p.id_genero = g.ID_genero
        WHERE dp.ID_pedido = ?
        ORDER BY p.nombre
      `;
      
      const [productosRows] = await connection.execute(queryProductos, [id]);
      
      // Construir el objeto pedido completo
      const pedidoCompleto = {
        ...pedido,
        direccion_completa: `${pedido.calle} ${pedido.numero_exterior}${pedido.numero_interior ? ' Int. ' + pedido.numero_interior : ''}, ${pedido.colonia}, ${pedido.ciudad}, ${pedido.estado_direccion} CP ${pedido.codigo_postal}`,
        productos: productosRows.map(producto => ({
          ...producto,
          imagen: producto.imagen ? producto.imagen.split(',')[0] : null // Tomar solo la primera imagen
        }))
      };
      
      return pedidoCompleto;
    } catch (error) {
      console.error('Error al obtener pedido por ID:', error);
      throw error;
    }
  }

  // Actualizar estado de un pedido
  static async actualizarEstado(id, nuevoEstado) {
    try {
      const query = `
        UPDATE pedidos 
        SET estado = ?
        WHERE ID_pedido = ?
      `;
      
      const [result] = await connection.execute(query, [nuevoEstado, id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Pedido no encontrado');
      }
      
      return true;
    } catch (error) {
      console.error('Error al actualizar estado del pedido:', error);
      throw error;
    }
  }

  // Obtener estadísticas de pedidos
  static async obtenerEstadisticas() {
    try {
      const queries = {
        total: 'SELECT COUNT(*) as count FROM pedidos',
        pendientes: 'SELECT COUNT(*) as count FROM pedidos WHERE estado = "pendiente"',
        procesando: 'SELECT COUNT(*) as count FROM pedidos WHERE estado = "procesando"',
        enviados: 'SELECT COUNT(*) as count FROM pedidos WHERE estado = "enviado"',
        entregados: 'SELECT COUNT(*) as count FROM pedidos WHERE estado = "entregado"',
        ventas_hoy: `
          SELECT COALESCE(SUM(total), 0) as total 
          FROM pedidos 
          WHERE DATE(fecha) = CURDATE() AND estado != 'cancelado'
        `,
        ventas_mes: `
          SELECT COALESCE(SUM(total), 0) as total 
          FROM pedidos 
          WHERE MONTH(fecha) = MONTH(CURDATE()) 
          AND YEAR(fecha) = YEAR(CURDATE()) 
          AND estado != 'cancelado'
        `
      };

      const stats = {};
      
      for (const [key, query] of Object.entries(queries)) {
        const [rows] = await connection.execute(query);
        stats[key] = rows[0].count !== undefined ? rows[0].count : rows[0].total;
      }
      
      return stats;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  // Obtener pedidos por estado
  static async obtenerPorEstado(estado) {
    try {
      const query = `
        SELECT 
          p.ID_pedido as id,
          p.fecha,
          p.total,
          p.estado,
          CONCAT(u.nombre, ' ', u.primer_apellido, ' ', COALESCE(u.segundo_apellido, '')) as nombre_cliente,
          u.email,
          u.telefono
        FROM pedidos p
        INNER JOIN usuarios u ON p.ID_usuario = u.ID_usuario
        WHERE p.estado = ?
        ORDER BY p.fecha DESC
      `;
      
      const [rows] = await connection.execute(query, [estado]);
      return rows;
    } catch (error) {
      console.error('Error al obtener pedidos por estado:', error);
      throw error;
    }
  }

  // Buscar pedidos por término de búsqueda
  static async buscar(termino) {
    try {
      const query = `
        SELECT 
          p.ID_pedido as id,
          p.fecha,
          p.total,
          p.estado,
          CONCAT(u.nombre, ' ', u.primer_apellido, ' ', COALESCE(u.segundo_apellido, '')) as nombre_cliente,
          u.email,
          u.telefono
        FROM pedidos p
        INNER JOIN usuarios u ON p.ID_usuario = u.ID_usuario
        WHERE u.nombre LIKE ? 
           OR u.primer_apellido LIKE ? 
           OR u.segundo_apellido LIKE ?
           OR u.email LIKE ?
           OR p.ID_pedido LIKE ?
        ORDER BY p.fecha DESC
      `;
      
      const searchTerm = `%${termino}%`;
      const [rows] = await connection.execute(query, [
        searchTerm, searchTerm, searchTerm, searchTerm, searchTerm
      ]);
      
      return rows;
    } catch (error) {
      console.error('Error al buscar pedidos:', error);
      throw error;
    }
  }

  // Método para verificar que la tabla existe (requerido por server.js)
  static async initializeTable() {
    try {
      // Solo verificar que la tabla existe
      const [rows] = await connection.execute('DESCRIBE pedidos');
      console.log('✅ Tabla "pedidos" verificada exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error: la tabla "pedidos" no existe en la base de datos');
      throw error;
    }
  }
}

module.exports = PedidoModel;

