const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkPersonalTable() {
    let connection;
    try {
        console.log('🔍 Verificando si existe la tabla personal...');
        
        // Crear conexión
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'srv1009.hstgr.io',
            user: process.env.DB_USER || 'u465901502_joyeria',
            password: process.env.DB_PASSWORD || 'Nancyjoyas24*',
            database: process.env.DB_NAME || 'u465901502_joyeria'
        });
        
        // Verificar si la tabla personal existe
        const [tables] = await connection.execute("SHOW TABLES LIKE 'personal'");
        console.log('📊 Tabla personal existe:', tables.length > 0);
        
        if (tables.length > 0) {
            // Mostrar estructura de la tabla personal
            const [structure] = await connection.execute('DESCRIBE personal');
            console.log('📊 Estructura de personal:', structure);
            
            // Mostrar datos de personal
            const [personal] = await connection.execute('SELECT * FROM personal');
            console.log('👥 Personal existente:', personal);
        } else {
            console.log('❌ La tabla personal no existe en la base de datos');
            
            // Mostrar todas las tablas disponibles
            const [allTables] = await connection.execute('SHOW TABLES');
            console.log('📋 Tablas disponibles:', allTables);
        }
        
    } catch (error) {
        console.error('💥 Error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
        process.exit(0);
    }
}

checkPersonalTable();
