import { createPool, Pool, PoolConfig, PoolConnection } from 'mysql';

// Creamos la conexión a la Base de Datos MySQL
const connection = async () => {
  // Configuración de la conexión a MySQL
  const poolConfig: PoolConfig = {
    connectionLimit: 10,
    debug: true,
    host: process.env.DB_MYSQL_HOST || 'localhost',
    port: parseInt(process.env.DB_MYSQL_PORT as string, 10) || 3306,
    database: process.env.DB_MYSQL_NAME || 'test',
    user: process.env.DB_MYSQL_USER || 'root',
    password: process.env.DB_MYSQL_PASSWORD || ''
  };
  // Creamos el pool de conexión
  const pool: Pool = createPool(poolConfig);

  // Retornamos la conexión al pool de la base de datos
  const promiseConnection = await new Promise<PoolConnection>((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        console.log('Error en la conexión a MySQL:', error);
        return reject(error);
      }
      console.log('Conectado correctamente a MySQL 🚀');
      return resolve(connection);
    });
  });
  return promiseConnection;
};

export default connection;
