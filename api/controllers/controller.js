const express = require('express');
const router = express.Router();
const pool = require('../db');

// Endpoint para registrar una nueva gaseosa
router.post('/registro', async (req, res) => {
    const { sabor, cantidad, valorTotal, estado, modoPago, size, personaNombre } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO gaseosas (sabor, cantidad, valorTotal, estado, modoPago, size, persona_id)
             VALUES ($1, $2, $3, $4, $5, $6, (SELECT id FROM personas WHERE nombre = $7))
             RETURNING *`,
            [sabor, cantidad, valorTotal, estado, modoPago, size, personaNombre]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar gaseosa' });
    }
});

// Endpoint para actualizar una gaseosa existente
router.put('/actualizar/:id', async (req, res) => {
    const { id } = req.params;
    const { sabor, cantidad, valorTotal, estado, modoPago, size, personaNombre } = req.body;
    try {
        const result = await pool.query(
            `UPDATE gaseosas
            SET sabor = $1, 
            cantidad = $2,
            valorTotal = $3, 
            estado = $4, 
            modoPago = $5, 
            size = $6, 
            persona_id = (SELECT id FROM personas WHERE nombre = $7)
             WHERE id = $8
             RETURNING *`,
            [sabor, cantidad, valorTotal, estado, modoPago, size, personaNombre, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar gaseosa' });
    }
});

// Endpoint para consultar todas las gaseosas
router.get('/consultar', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM gaseosas');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al consultar gaseosas' });
    }
});

// Endpoint para eliminar una gaseosa
router.delete('/eliminar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM gaseosas WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar gaseosa' });
    }
});

module.exports = router;
