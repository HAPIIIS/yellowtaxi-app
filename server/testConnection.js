const pool = require('./db'); 

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()'); 
    console.log('Database connected:', result.rows);
  } catch (err) {
    console.error('Database connection error:', err);
  }
}

testConnection(); 
