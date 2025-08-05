const { query } = require('./config/database');

async function checkTableStructure() {
    try {
        console.log('🔍 Verificando estructura de la tabla usuarios...');
        
        // Obtener estructura de la tabla usuarios
        const structure = await query('DESCRIBE usuarios');
        console.log('📊 Estructura de usuarios:', structure);
        
        // Obtener estructura de la tabla roles
        const rolesStructure = await query('DESCRIBE roles');
        console.log('📊 Estructura de roles:', rolesStructure);
        
        // Intentar obtener algunos usuarios de ejemplo
        const users = await query('SELECT * FROM usuarios LIMIT 3');
        console.log('👥 Usuarios existentes:', users);
        
        // Intentar obtener roles
        const roles = await query('SELECT * FROM roles');
        console.log('🔐 Roles existentes:', roles);
        
    } catch (error) {
        console.error('❌ Error al verificar estructura:', error);
    }
    
    process.exit(0);
}

checkTableStructure();
