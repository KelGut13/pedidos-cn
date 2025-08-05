const { query } = require('../config/database');

class ProductoModel {
    // URL base para imágenes del servidor de admin
    static getImageUrl(imagePath) {
        if (!imagePath) return null;
        
        // Si ya es una URL completa, reemplazar localhost:3001 con el servidor de admin
        if (imagePath.startsWith('http://localhost:3001')) {
            return imagePath.replace('http://localhost:3001', 'https://api.curiosidadesnancy.shop');
        }
        
        // Si es una URL completa de otro servidor, devolverla tal como está
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        // Si es un path relativo, construir la URL completa
        const baseUrl = 'https://api.curiosidadesnancy.shop';
        if (imagePath.startsWith('/')) {
            return `${baseUrl}${imagePath}`;
        }
        return `${baseUrl}/uploads/${imagePath}`;
    }

    // Obtener todos los productos con información relacionada
    static async getAllProductos() {
        try {
            const sql = `
                SELECT 
                    p.ID_producto,
                    p.nombre,
                    p.descripcion,
                    p.precio,
                    p.stock,
                    p.imagen,
                    p.activo,
                    m.nombre_marca,
                    mt.nombre_material,
                    g.nombre_genero,
                    c.nombre_categoria
                FROM productos p
                LEFT JOIN marcas m ON p.id_marca = m.ID_marca
                LEFT JOIN material mt ON p.id_material = mt.ID_material
                LEFT JOIN genero g ON p.id_genero = g.ID_genero
                LEFT JOIN categorias c ON p.id_categoria = c.ID_categoria
                WHERE p.activo = 1
                ORDER BY p.nombre
            `;
            const productos = await query(sql);
            
            // Procesar las imágenes para agregar URLs completas
            return productos.map(producto => {
                // Procesar el string completo de imágenes
                let imagenProcesada = producto.imagen;
                if (imagenProcesada) {
                    imagenProcesada = imagenProcesada.replace(/http:\/\/localhost:3001/g, 'https://api.curiosidadesnancy.shop');
                }
                
                return {
                    ...producto,
                    imagen: imagenProcesada,
                    imagenes: imagenProcesada ? 
                        imagenProcesada.split(',').map(img => img.trim()) :
                        []
                };
            });
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    // Obtener un producto por ID
    static async getProductoById(id) {
        try {
            const sql = `
                SELECT 
                    p.ID_producto,
                    p.nombre,
                    p.descripcion,
                    p.precio,
                    p.stock,
                    p.imagen,
                    p.activo,
                    p.id_marca,
                    p.id_material,
                    p.id_genero,
                    p.id_categoria,
                    m.nombre_marca,
                    mt.nombre_material,
                    g.nombre_genero,
                    c.nombre_categoria
                FROM productos p
                LEFT JOIN marcas m ON p.id_marca = m.ID_marca
                LEFT JOIN material mt ON p.id_material = mt.ID_material
                LEFT JOIN genero g ON p.id_genero = g.ID_genero
                LEFT JOIN categorias c ON p.id_categoria = c.ID_categoria
                WHERE p.ID_producto = ?
            `;
            const results = await query(sql, [id]);
            const producto = results[0] || null;
            
            if (producto) {
                // Procesar las imágenes para agregar URLs completas
                let imagenProcesada = producto.imagen;
                if (imagenProcesada) {
                    imagenProcesada = imagenProcesada.replace(/http:\/\/localhost:3001/g, 'https://api.curiosidadesnancy.shop');
                }
                
                return {
                    ...producto,
                    imagen: imagenProcesada,
                    imagenes: imagenProcesada ? 
                        imagenProcesada.split(',').map(img => img.trim()) :
                        []
                };
            }
            
            return null;
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            throw error;
        }
    }

    // Obtener productos por categoría
    static async getProductosByCategoria(idCategoria) {
        try {
            const sql = `
                SELECT 
                    p.ID_producto,
                    p.nombre,
                    p.descripcion,
                    p.precio,
                    p.stock,
                    p.imagen,
                    m.nombre_marca,
                    mt.nombre_material,
                    g.nombre_genero,
                    c.nombre_categoria
                FROM productos p
                LEFT JOIN marcas m ON p.id_marca = m.ID_marca
                LEFT JOIN material mt ON p.id_material = mt.ID_material
                LEFT JOIN genero g ON p.id_genero = g.ID_genero
                LEFT JOIN categorias c ON p.id_categoria = c.ID_categoria
                WHERE p.id_categoria = ? AND p.activo = 1
                ORDER BY p.nombre
            `;
            return await query(sql, [idCategoria]);
        } catch (error) {
            console.error('Error al obtener productos por categoría:', error);
            throw error;
        }
    }

    // Buscar productos por nombre
    static async searchProductos(termino) {
        try {
            const sql = `
                SELECT 
                    p.ID_producto,
                    p.nombre,
                    p.descripcion,
                    p.precio,
                    p.stock,
                    p.imagen,
                    m.nombre_marca,
                    mt.nombre_material,
                    g.nombre_genero,
                    c.nombre_categoria
                FROM productos p
                LEFT JOIN marcas m ON p.id_marca = m.ID_marca
                LEFT JOIN material mt ON p.id_material = mt.ID_material
                LEFT JOIN genero g ON p.id_genero = g.ID_genero
                LEFT JOIN categorias c ON p.id_categoria = c.ID_categoria
                WHERE (p.nombre LIKE ? OR p.descripcion LIKE ?) AND p.activo = 1
                ORDER BY p.nombre
            `;
            const searchTerm = `%${termino}%`;
            return await query(sql, [searchTerm, searchTerm]);
        } catch (error) {
            console.error('Error al buscar productos:', error);
            throw error;
        }
    }

    // Obtener productos con stock bajo
    static async getProductosStockBajo(limite = 10) {
        try {
            const sql = `
                SELECT 
                    p.ID_producto,
                    p.nombre,
                    p.stock,
                    p.precio,
                    c.nombre_categoria
                FROM productos p
                LEFT JOIN categorias c ON p.id_categoria = c.ID_categoria
                WHERE p.stock <= ? AND p.activo = 1
                ORDER BY p.stock ASC, p.nombre
            `;
            return await query(sql, [limite]);
        } catch (error) {
            console.error('Error al obtener productos con stock bajo:', error);
            throw error;
        }
    }
}

module.exports = ProductoModel;
