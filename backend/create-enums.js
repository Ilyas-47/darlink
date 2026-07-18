const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function createEnums() {
  try {
    const sql = fs.readFileSync('./prisma/create-enums.sql', 'utf-8');
    console.log('Exécution du script SQL...');
    await pool.query(sql);
    console.log('✅ Enums créés avec succès!');
  } catch (error) {
    console.error('Erreur:', error.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

createEnums();
