const { query } = require('../config/database');

class ProductoModel {
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
            return await query(sql);
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
            return results[0] || null;
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
