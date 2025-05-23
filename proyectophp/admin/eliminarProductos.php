<?php
session_start();
if (!isset($_SESSION['userid'])) {
    header('Location: login.php');
    exit();
}

require 'AccesoBD.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $codigo = $_POST['codigo'] ?? 0;

    if (eliminarProducto($codigo)) {
        header('Location: productos.php');
        exit();
    } else {
        echo "Error al eliminar el producto.";
    }
} else {
    header('Location: productos.php');
    exit();
}
