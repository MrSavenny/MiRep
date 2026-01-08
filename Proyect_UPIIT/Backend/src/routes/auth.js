const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db'); 
const auth = require('../middleware/auth'); 

router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        await db.query(
            'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)',
            [nombre, email, password_hash]
        );
        res.status(201).json({ msg: "Usuario registrado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al registrar usuario" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (usuarios.length === 0) return res.status(400).json({ msg: "Usuario no encontrado" });

        const usuario = usuarios[0];
        const esValida = await bcrypt.compare(password, usuario.password_hash);
        if (!esValida) return res.status(400).json({ msg: "Contraseña incorrecta" });

        const token = jwt.sign(
            { usuario: { id: usuario.id, nombre: usuario.nombre } },
            process.env.JWT_SECRET || 'palabrasecreta',
            { expiresIn: '8h' }
        );

        res.json({
            token,
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al iniciar sesión" });
    }
});

router.put('/perfil', auth, async (req, res) => {
    const { nombre } = req.body;
    const usuarioId = req.user.id; 
    try {
        await db.query('UPDATE usuarios SET nombre = ? WHERE id = ?', [nombre, usuarioId]);
        res.json({ msg: "Perfil actualizado", nuevoNombre: nombre });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar perfil" });
    }
});

module.exports = router;