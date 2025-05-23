<?php
session_start();
if (!isset($_SESSION['userid'])) {
    header('Location: login.html');
    exit();
}

require 'AccesoBD.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['codigo'], $_POST['activo'])) {
    $codigo = (int)$_POST['codigo'];
    $activo = (int)$_POST['activo'];
    actualizarEstadoActivo($codigo, $activo);
}

header('Location: usuarios.php');
exit();
