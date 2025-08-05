const { query } = require('./config/database');
const bcrypt = require('bcryptjs');

async function testPasswords() {
    try {
        console.log('🧪 Probando contraseñas de usuarios...');
        
        // Obtener usuarios
        const usuarios = await query('SELECT * FROM usuarios LIMIT 3');
        
        // Contraseñas comunes para probar
        const passwordsToTry = [
            'admin123',
            'password',
            '123456',
            'admin',
            'test123',
            '12345678',
            'qwerty',
            'abc123'
        ];
        
        for (const usuario of usuarios) {
            console.log(`\n👤 Probando passwords para: ${usuario.email}`);
            
            for (const testPassword of passwordsToTry) {
                try {
                    const isMatch = await bcrypt.compare(testPassword, usuario.password);
                    if (isMatch) {
                        console.log(`✅ CONTRASEÑA ENCONTRADA: ${testPassword}`);
                        break;
                    }
                } catch (error) {
                    // Ignorar errores de bcrypt
                }
            }
        }
        
        console.log('\n🏁 Prueba de contraseñas completada');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

testPasswords();
