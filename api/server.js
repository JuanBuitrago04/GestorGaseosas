// server.js (Servidor Express con CRUD para Gaseosas)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(cors()); // Ensure CORS is enabled
app.use(bodyParser.json());

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

// Registrar gaseosa
app.post('/registro', async (req, res) => {
    let { fechaVenta, sabor, cantidad, valorTotal, estado, modoPago, size, personaNombre } = req.body;

    if (!sabor || !cantidad || !valorTotal || !estado || !modoPago || !size) {
        console.error('❌ Faltan campos obligatorios:', req.body);
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Validar fecha
    if (!fechaVenta) {
        fechaVenta = new Date().toISOString();
    }

    try {
        let personaId = null;
        if (personaNombre) {
            const personaResult = await pool.query(
                `INSERT INTO personas (nombre) VALUES ($1) ON CONFLICT (nombre) DO NOTHING RETURNING id`,
                [personaNombre]
            );
            if (personaResult.rows.length > 0) {
                personaId = personaResult.rows[0].id;
            } else {
                const existingPersona = await pool.query(
                    `SELECT id FROM personas WHERE nombre = $1`,
                    [personaNombre]
                );
                personaId = existingPersona.rows[0].id;
            }
        }

        const result = await pool.query(
            `INSERT INTO gaseosas (fechaVenta, sabor, cantidad, valorTotal, estado, modoPago, size, persona_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [fechaVenta, sabor, cantidad, valorTotal, estado, modoPago, size, personaId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('❌ Error al registrar:', err);
        res.status(500).json({ error: 'Error al registrar gaseosa' });
    }
});

// Consultar todas las gaseosas
app.get('/consultar', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT g.*, p.nombre as personaNombre 
            FROM gaseosas g 
            LEFT JOIN personas p ON g.persona_id = p.id
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Error al consultar:', err);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

// Eliminar una gaseosa
app.delete('/eliminar/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query('DELETE FROM gaseosas WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Gaseosa no encontrada' });
        }
        res.json({ message: 'Gaseosa eliminada correctamente' });
    } catch (err) {
        console.error('❌ Error al eliminar:', err);
        res.status(500).json({ error: 'Error al eliminar gaseosa' });
    }
});

// Actualizar una gaseosa
app.put('/actualizar/:id', async (req, res) => {
    const id = req.params.id;
    const { sabor, cantidad, valorTotal, estado, modoPago, size, personaNombre } = req.body;
    try {
        let personaId = null;
        if (personaNombre) {
            const personaResult = await pool.query(
                `INSERT INTO personas (nombre) VALUES ($1) ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre RETURNING id`,
                [personaNombre]
            );
            personaId = personaResult.rows[0].id;
        }

        const result = await pool.query(
            `UPDATE gaseosas SET sabor = $1, cantidad = $2, valorTotal = $3, estado = $4, modoPago = $5, size = $6, persona_id = $7 
       WHERE id = $8 RETURNING *`,
            [sabor, cantidad, valorTotal, estado, modoPago, size, personaId, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Gaseosa no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('❌ Error al actualizar:', err.message);
        res.status(500).json({ error: 'Error al actualizar gaseosa', details: err.message });
    }
});

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