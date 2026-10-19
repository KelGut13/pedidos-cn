const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Middleware para verificar que el usuario esté autenticado y sea administrador
exports.authenticateAdmin = async (req, res, next) => {
    try {
        // Obtener token del header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                error: 'Acceso no autorizado - Token no proporcionado' 
            });
        }

        // Extraer token
        const token = authHeader.split(' ')[1];
        
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verificar que el usuario existe en la base de datos
        const query = 'SELECT * FROM usuarios WHERE ID_usuario = ?';
        const [users] = await pool.execute(query, [decoded.userId]);
        
        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                error: 'Usuario no encontrado' 
            });
        }
        
        const usuario = users[0];
        
        if (Number(usuario.ID_rol) !== 1) {
            return res.status(403).json({ success: false, error: 'Se requiere rol de administrador' });
        }

        // Añadir datos de usuario al request
        req.user = {
            userId: usuario.ID_usuario,
            email: usuario.email,
            rol: usuario.ID_rol,
            nombre: usuario.nombre
        };
        
        next();
    } catch (error) {
        console.error('Error de autenticación de administrador:', error);
        return res.status(401).json({ 
            success: false, 
            error: 'Token inválido' 
        });
    }
};
