<?php
session_start();

if (!isset($_SESSION['userid'])) {
    header('Location: login.html');
    exit();
}

require 'AccesoBD.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_POST['usuario'] ?? '';
    $contrasenya = $_POST['contrasenya'] ?? '';
    $nombre = $_POST['nombre'] ?? '';
    $apellidos = $_POST['apellidos'] ?? '';
    $email = $_POST['email'] ?? '';
    $telefono = $_POST['telefono'] ?? '';
    $domicilio = $_POST['domicilio'] ?? '';
    $ciudad = $_POST['ciudad'] ?? '';
    $admin = isset($_POST['admin']) ? 1 : 0;

    // Validar duplicados antes de intentar insertar
    if (usuarioExistente($usuario)) {
        echo "Error: el nombre de usuario ya está en uso.";
    } elseif (!empty($email) && emailExistente($email)) {
        echo "Error: el correo electrónico ya está en uso.";
    } elseif (!empty($telefono) && telefonoExistente($telefono)) {
        echo "Error: el número de teléfono ya está en uso.";
    } elseif (agregarUsuario($usuario, $contrasenya, $admin, $nombre, $apellidos, $domicilio, $ciudad, $telefono, $email)) {
        header('Location: usuarios.php');
        exit();
    } else {
        echo "Error al agregar el usuario.";
    }
} else {
    header('Location: usuarios.php');
    exit();
}
?>
