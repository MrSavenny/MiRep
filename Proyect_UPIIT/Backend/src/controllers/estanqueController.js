const db = require('../models/db');

exports.crearEstanque = async (req, res) => {
    const { nombre_estanque, especie, cantidad_peces, fecha_siembra, capacidad_litros } = req.body;
    try {
        await db.query(
            'INSERT INTO estanques (usuario_id, nombre_estanque, especie, cantidad_peces, fecha_siembra, capacidad_litros, observaciones_salud) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [req.user.id, nombre_estanque, especie, cantidad_peces, fecha_siembra, capacidad_litros || 1000, "Sin novedades"]
        );
        res.status(201).json({ msg: "Estanque creado" });
    } catch (e) { 
        console.error(e);
        res.status(500).json({ msg: "Error al insertar" }); 
    }
};

exports.obtenerEstanques = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM estanques WHERE usuario_id = ?', [req.user.id]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener datos" });
    }
};

exports.actualizarEstanque = async (req, res) => {
    const { id } = req.params;
    const { nombre_estanque, cantidad_peces, capacidad_litros, observaciones_salud } = req.body;
    try {
        await db.query(
            'UPDATE estanques SET nombre_estanque = ?, cantidad_peces = ?, capacidad_litros = ?, observaciones_salud = ? WHERE id = ? AND usuario_id = ?', 
            [nombre_estanque, cantidad_peces, capacidad_litros, observaciones_salud, id, req.user.id]
        );
        res.json({ msg: "Actualizado correctamente" });
    } catch (e) { 
        console.error(e);
        res.status(500).json({ msg: "Error al actualizar" }); 
    }
};

exports.eliminarEstanque = async (req, res) => {
    try {
        await db.query('DELETE FROM estanques WHERE id = ? AND usuario_id = ?', [req.params.id, req.user.id]);
        res.json({ msg: "Eliminado" });
    } catch (e) { res.status(500).json({ msg: "Error" }); }
};

exports.registrarMonitoreo = async (req, res) => {
    const { estanque_id, ph_nivel, temperatura } = req.body;
    try {
        await db.query('INSERT INTO monitoreo (estanque_id, ph_nivel, temperatura) VALUES (?, ?, ?)', [estanque_id, ph_nivel, temperatura]);
        res.json({ msg: "Datos guardados" });
    } catch (e) { res.status(500).json({ msg: "Error" }); }
};

exports.registrarClimaManual = async (req, res) => {
    const { temp_ambiente } = req.body;
    try {
        await db.query('INSERT INTO historial_clima (temp_ambiente) VALUES (?)', [temp_ambiente]);
        res.json({ msg: "Clima registrado" });
    } catch (e) { res.status(500).json({ msg: "Error" }); }
};

exports.obtenerGrafica = async (req, res) => {
  const { id } = req.params;
  try {
    const [estanque] = await db.query(
      `SELECT DATE_FORMAT(fecha_hora, '%H:%i') AS hora, ph_nivel AS ph, temperatura AS temp 
       FROM monitoreo WHERE estanque_id = ? ORDER BY fecha_hora ASC`, [id]
    );
    const [clima] = await db.query(
      `SELECT DATE_FORMAT(fecha_hora, '%H:%i') AS hora, temp_ambiente AS tempAmb 
       FROM historial_clima ORDER BY fecha_hora ASC`
    );
    res.json({ estanque, clima });
  } catch (e) { res.status(500).json({ msg: "Error en gráfica" }); }
};