const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  try {
    const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'colivings' ORDER BY ordinal_position");
    console.log('Colivings table structure:');
    res.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
})();
