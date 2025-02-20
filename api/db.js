const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://neondb_owner:npg_zhMygD27bnNP@ep-dark-mouse-a5xpuzqd-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
});

pool.connect()
  .then(() => console.log("Conectado a PostgreSQL en Vercel"))
  .catch(err => console.error("Error de conexión", err));

module.exports = pool;