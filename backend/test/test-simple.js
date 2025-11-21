const mysql = require('mysql2/promise');
require('dotenv').config();

async function testarConexao() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'sistema_delivery',
    });

    console.log('Conexão bem-sucedida!');
    await conn.end();
    
  } catch (error) {
    console.error('Erro:', error.message);
    process.exit(1);
  }
}

testarConexao();
