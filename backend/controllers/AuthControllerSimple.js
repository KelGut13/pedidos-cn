const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthControllerSimple {
    // Version simplificada para debugging
    static async login(req, res) {
        try {
            console.log('🔐 Login simple - Inicio');
            console.log('📦 Body recibido:', req.body);
            
            const { email, password } = req.body;

            // Validaciones básicas
            if (!email || !password) {
                console.log('❌ Faltan datos');
                return res.status(400).json({
                    success: false,
                    error: 'Email y contraseña son requeridos'
                });
            }

            // Respuesta de prueba sin conectar a BD
            console.log('✅ Login simple exitoso');
            res.json({
                success: true,
                message: 'Login de prueba exitoso',
                data: { email, timestamp: new Date() }
            });
            
        } catch (error) {
            console.error('💥 Error en login simple:', error);
            res.status(500).json({
                success: false,
                error: 'Error en login simple: ' + error.message
            });
        }
    }
}

module.exports = AuthControllerSimple;
