exports.actualizarPerfil = async (req, res) => {
    const { nombre, email } = req.body;
    const usuarioId = req.usuario.id; 

    try {
        await db.query(
            'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
            [nombre, email, usuarioId]
        );
        res.json({ msg: "Perfil actualizado correctamente", nombre });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar el perfil" });
    }
};

exports.actualizarPerfil = async (req, res) => {
    const { nombre } = req.body;
    const usuarioId = req.user.id; 

    try {
        await db.query(
            'UPDATE usuarios SET nombre = ? WHERE id = ?',
            [nombre, usuarioId]
        );

        res.json({ msg: "Perfil actualizado con éxito", nombre });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar en la base de datos" });
    }
};