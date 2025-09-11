<?php
include 'conexion.php';

$sql = "SELECT * FROM productos";
$resultado = $conexion->query($sql);
?>
<!doctype html>
<html>
<head><meta charset="utf-8"><title>Práctica 1 - Tienda</title></head>
<body>
<h1>Productos</h1>
<?php
if ($resultado && $resultado->num_rows > 0) {
   while ($fila = $resultado->fetch_assoc()) {
      echo "ID: " . $fila["id"] . 
           " - Nombre: " . $fila["nombre"] . 
           " - Precio: $" . $fila["precio"] . "<br>";
   }
} else {
   echo "No hay productos registrados.";
}
$conexion->close();
?>
</body>
</html>
