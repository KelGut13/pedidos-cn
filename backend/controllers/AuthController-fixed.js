const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

class AuthController {
    // Login de usuario
    static async login(req, res) {
        try {
            console.log('🔐 Intento de login:', { email: req.body.email });
            
            const { email, password } = req.body;

            // Validaciones básicas
            if (!email || !password) {
                console.log('❌ Faltan datos:', { email: !!email, password: !!password });
                return res.status(400).json({
                    success: false,
                    error: 'Email y contraseña son requeridos'
                });
            }

            // Buscar usuario por email (volvemos a usuarios temporalmente)
            console.log('📧 Buscando usuario con email:', email);
            const query = 'SELECT * FROM usuarios WHERE email = ?';
            const [users] = await pool.execute(query, [email]);
            
            console.log('👥 Usuarios encontrados:', users.length);
            
            if (users.length === 0) {
                console.log('❌ Usuario no encontrado');
                return res.status(401).json({
                    success: false,
                    error: 'Credenciales inválidas'
                });
            }
            
            const usuario = users[0];
            console.log('👤 Usuario encontrado:', {
                id: usuario.ID_usuario,
                email: usuario.email,
                nombre: usuario.nombre
            });
            
            // Verificar contraseña
            console.log('🔐 Verificando contraseña...');
            let passwordValida = false;
            
            try {
                passwordValida = await bcrypt.compare(password, usuario.password);
                console.log('✅ Verificación bcrypt exitosa:', passwordValida);
            } catch (bcryptError) {
                console.log('⚠️ Bcrypt falló, verificando contraseña en texto plano:', bcryptError.message);
                passwordValida = (password === usuario.password);
                console.log('📝 Verificación texto plano:', passwordValida);
            }
            
            if (!passwordValida) {
                console.log('❌ Contraseña incorrecta');
                return res.status(401).json({
                    success: false,
                    error: 'Credenciales inválidas'
                });
            }

            console.log('✅ Login exitoso, generando token...');

            // Generar token JWT
            const token = jwt.sign(
                { 
                    userId: usuario.ID_usuario,
                    email: usuario.email,
                    rol: 2 // Asumimos que todos son administradores
                },
                process.env.JWT_SECRET || 'secreto_predeterminado',
                { expiresIn: '12h' }
            );

            // Preparar respuesta sin password
            const usuarioRespuesta = {
                ID_usuario: usuario.ID_usuario,
                nombre: usuario.nombre,
                primer_apellido: usuario.primer_apellido,
                segundo_apellido: usuario.segundo_apellido,
                email: usuario.email,
                telefono: usuario.telefono,
                ID_rol: 2,
                nombre_rol: "Administrador"
            };

            console.log('🎉 Login completado exitosamente para:', email);
            
            res.json({
                success: true,
                message: 'Login exitoso',
                usuario: usuarioRespuesta,
                token
            });
        } catch (error) {
            console.error('💥 Error en login:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor en autenticación'
            });
        }
    }

    // Validar token
    static async validarToken(req, res) {
        try {
            const { token } = req.body;
            
            if (!token) {
                return res.status(400).json({
                    success: false,
                    error: 'Token requerido'
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_predeterminado');
            
            res.json({
                success: true,
                decoded
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                error: 'Token inválido'
            });
        }
    }
}

module.exports = AuthController;
