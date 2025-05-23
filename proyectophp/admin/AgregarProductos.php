<?php
session_start();
if (!isset($_SESSION['userid'])) {
    header('Location: login.html');
    exit();
}

require 'AccesoBD.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'] ?? '';
    $precio = $_POST['precio'] ?? 0;
    $existencias = $_POST['existencias'] ?? 0;
    $imagen = $_POST['imagen'] ?? '';
    $kilometros = $_POST['kilometros'] ?? 0;
    $marca = $_POST['marca'] ?? '';
    $categoria = $_POST['categoria'] ?? '';

    if (agregarProducto($nombre, $precio, $existencias, $imagen, $kilometros, $marca, $categoria)) {
        header('Location: productos.php');
        exit();
    } else {
        echo "Error al agregar el producto.";
    }
} else {
    header('Location: productos.php');
    exit();
}
