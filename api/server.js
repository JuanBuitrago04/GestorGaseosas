require('dotenv').config(); // Cargar variables de entorno

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');
const controllers = require('./controllers/controller'); // Actualizado a controller.js

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Ensure CORS is enabled
app.use(bodyParser.json());
app.use('/api', controllers);

// Crear la tabla si no existe
async function crearTabla() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS personas (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL UNIQUE
            );
            CREATE TABLE IF NOT EXISTS gaseosas (
                id SERIAL PRIMARY KEY,
                fechaVenta TIMESTAMP DEFAULT NOW(),
                sabor VARCHAR(100) NOT NULL,
                cantidad INT NOT NULL CHECK (cantidad > 0),
                valorTotal DECIMAL(10,2) NOT NULL CHECK (valorTotal >= 0),
                estado VARCHAR(50) NOT NULL,
                modoPago VARCHAR(50) NOT NULL,
                size VARCHAR(50) NOT NULL,
                persona_id INT REFERENCES personas(id)
            );
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_nombre') THEN
                    ALTER TABLE personas ADD CONSTRAINT unique_nombre UNIQUE (nombre);
                END IF;
            END
            $$;
            ALTER TABLE gaseosas ADD COLUMN IF NOT EXISTS persona_id INT REFERENCES personas(id);
        `);
        console.log("✅ Tablas 'gaseosas' y 'personas' aseguradas");
    } catch (err) {
        console.error("❌ Error al crear las tablas", err);
    }
}
crearTabla();

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Test the database connection
async function testDB() {
    try {
        const res = await pool.query("SELECT NOW()");
        console.log("Hora actual en la BD:", res.rows[0]);
    } catch (err) {
        console.error("Error en la consulta", err);
    }
}

testDB();