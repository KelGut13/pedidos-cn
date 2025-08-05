const { query } = require('../config/database');

/**
 * Inicializar datos básicos en la base de datos
 * Este script debe ser ejecutado al arrancar el servidor
 */
class DatabaseInitializer {
    // Inicializar roles si no existen
    static async initializeRoles() {
        try {
            const defaultRoles = [
                { id: 1, nombre: 'Administrador' },
                { id: 2, nombre: 'Cliente' }
            ];
            
            // Verificar si ya existen roles
            const existingRoles = await query('SELECT * FROM roles');
            
            if (existingRoles.length === 0) {
                console.log('🔄 Inicializando roles...');
                
                // Insertar roles predeterminados
                for (const role of defaultRoles) {
                    await query(
                        'INSERT INTO roles (ID_rol, nombre_rol) VALUES (?, ?)',
                        [role.id, role.nombre]
                    );
                }
                
                console.log('✅ Roles inicializados correctamente');
            } else {
                console.log('✅ Roles ya existentes, omitiendo inicialización');
            }
            
            return true;
        } catch (error) {
            console.error('❌ Error al inicializar roles:', error.message);
            return false;
        }
    }
    
    // Crear un usuario administrador si no existe
    static async createAdminUser() {
        try {
            // En esta base de datos ya existen usuarios, solo verificamos que haya al menos uno
            const usuarios = await query('SELECT COUNT(*) as total FROM usuarios');
            
            if (usuarios[0].total > 0) {
                console.log('✅ Ya existen usuarios en la base de datos:', usuarios[0].total);
                console.log('   Los usuarios existentes pueden iniciar sesión como administradores');
                return true;
            } else {
                console.log('⚠️ No hay usuarios en la base de datos');
                return false;
            }
        } catch (error) {
            console.error('❌ Error al verificar usuarios:', error.message);
            return false;
        }
    }
    
    // Inicializar toda la base de datos
    static async initialize() {
        try {
            console.log('🔄 Iniciando inicialización de la base de datos...');
            
            // Inicializar roles
            await this.initializeRoles();
            
            // Crear usuario admin
            await this.createAdminUser();
            
            console.log('✅ Base de datos inicializada correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error al inicializar la base de datos:', error.message);
            return false;
        }
    }
}

module.exports = DatabaseInitializer;
