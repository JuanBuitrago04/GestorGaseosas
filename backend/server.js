const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// 📌 Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MySQLJuan',
    database: 'registro_gaseosas'
});

// Conectar a la base de datos
db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a la base de datos MySQL');
});

// 📌 Registrar una gaseosa
app.post('/registro', (req, res) => {
    const { fechaVenta, sabor, cantidad, valorTotal, estado, modoPago, size } = req.body;

    if (!fechaVenta || !sabor || !cantidad || !valorTotal || !estado || !modoPago || !size) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const sql = `INSERT INTO gaseosas (fechaVenta, sabor, cantidad, valorTotal, estado, modoPago, size) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [fechaVenta, sabor, cantidad, valorTotal, estado, modoPago, size];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('❌ Error al registrar:', err);
            return res.status(500).json({ error: 'Error al registrar gaseosa' });
        }
        res.status(201).json({ id: result.insertId, fechaVenta, sabor, cantidad, valorTotal, estado, modoPago, size });
    });
});

// 📌 Consultar todas las gaseosas
app.get('/consultar', (req, res) => {
    db.query('SELECT * FROM gaseosas', (err, results) => {
        if (err) {
            console.error('❌ Error al consultar:', err);
            return res.status(500).json({ error: 'Error al obtener datos' });
        }
        res.json(results);
    });
});

// 📌 Eliminar una gaseosa
app.delete('/eliminar/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM gaseosas WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('❌ Error al eliminar:', err);
            return res.status(500).json({ error: 'Error al eliminar gaseosa' });
        }
        res.status(200).json({ message: 'Gaseosa eliminada correctamente' });
    });
});

// 📌 Actualizar una gaseosa
app.put('/actualizar/:id', (req, res) => {
    const id = req.params.id;
    const { sabor, cantidad, valorTotal, estado, modoPago, size } = req.body;

    const sql = `UPDATE gaseosas SET sabor = ?, cantidad = ?, valorTotal = ?, estado = ?, modoPago = ?, size = ? WHERE id = ?`;
    const values = [sabor, cantidad, valorTotal, estado, modoPago, size, id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('❌ Error al actualizar:', err);
            return res.status(500).json({ error: 'Error al actualizar gaseosa' });
        }
        res.json({ message: 'Gaseosa actualizada correctamente' });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});