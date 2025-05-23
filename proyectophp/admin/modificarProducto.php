<?php
session_start();

if (!isset($_SESSION['userid'])) {
    header('Location: login.html');
    exit();
}

require 'AccesoBD.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $codigo = $_POST['codigo'];
    $precio = $_POST['precio'];
    $existencias = $_POST['existencias'];
    $imagen = $_POST['imagen'];
    $kilometros = $_POST['kilometros'];
    $nombre = $_POST['nombre'];
    $marca = $_POST['marca'];
    $categoria = $_POST['categoria'];

    if (modificarProducto($codigo, $precio, $existencias, $imagen, $kilometros, $nombre, $marca, $categoria)) {
        header('Location: productos.php?mensaje=modificado');
        exit();
    } else {
        header('Location: productos.php?mensaje=error');
        exit();
    }
}
?>
