require('dotenv').config();

const { getConnection } = require('./db');

async function main() {
  let connection;

  try {
    connection = await getConnection();
    console.log('Borrando tablas existentes');
    await connection.query('DROP TABLE IF EXISTS votes');
    await connection.query('DROP TABLE IF EXISTS recommendations');
    await connection.query('DROP TABLE IF EXISTS users');

    console.log('creando tablas');

    await connection.query(`
        CREATE TABLE users  (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            username VARCHAR(100) UNIQUE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await connection.query(`
            CREATE TABLE recommendations(
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                user_id INTEGER NOT NULL,
                title VARCHAR(100) NOT NULL,
                category VARCHAR(100) NOT NULL,
                place VARCHAR(100) NOT NULL,
                leadin VARCHAR(280) NOT NULL, 
                text VARCHAR(500) NOT NULL,
                image VARCHAR(100),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
    `);

    await connection.query(`
            CREATE TABLE votes(
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                value BOOLEAN DEFAULT true,  
                user_id INTEGER NOT NULL,
                recommendation_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (recommendation_id) REFERENCES recommendations(id) ON DELETE CASCADE
            ); 
            
    `);
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

main();
