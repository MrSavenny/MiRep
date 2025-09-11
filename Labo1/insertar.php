<?php
include 'conexion.php';

// Datos de prueba para insertar un producto
$nombre = "Auriculares";
$precio = 350.00;

// Usamos sentencia preparada para mayor seguridad
$stmt = $conexion->prepare("INSERT INTO productos (nombre, precio) VALUES (?, ?)");
$stmt->bind_param("sd", $nombre, $precio);

if ($stmt->execute()) {
    echo "Producto registrado correctamente.";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conexion->close();
?>
