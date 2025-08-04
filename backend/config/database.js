const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+00:00',
    charset: 'utf8mb4'
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión exitosa a la base de datos MySQL');
        console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
        console.log(`🌐 Host: ${process.env.DB_HOST}`);
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error.message);
        return false;
    }
}

// Función para ejecutar consultas
async function query(sql, params = []) {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Error en la consulta:', error);
        throw error;
    }
}

// Función para cerrar la conexión
async function closeConnection() {
    try {
        await pool.end();
        console.log('Conexión a la base de datos cerrada');
    } catch (error) {
        console.error('Error al cerrar la conexión:', error);
    }
}

module.exports = {
    pool,
    query,
    testConnection,
    closeConnection
};
