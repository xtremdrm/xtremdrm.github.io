<?php
session_start();
if (!isset($_SESSION['userid'])) {
    header('Location: login.html');
    exit();
}

require 'AccesoBD.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['codigo'], $_POST['admin'])) {
    $codigo = (int)$_POST['codigo'];
    $admin = (int)$_POST['admin'];
    actualizarRolUsuario($codigo, $admin);
}
header('Location: usuarios.php');
exit();
