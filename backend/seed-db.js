import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    // Lire le fichier SQL
    const sql = fs.readFileSync('./prisma/seed.sql', 'utf8');
    
    // Exécuter le script SQL
    const result = await pool.query(sql);
    
    console.log('✅ Base de données seedée avec succès!');
    console.log('Les données de test ont été insérées dans PostgreSQL');
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
