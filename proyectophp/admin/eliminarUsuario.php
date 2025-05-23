<?php
session_start();
if (!isset($_SESSION['userid'])) {
    header('Location: login.html');
    exit();
}

require 'AccesoBD.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['codigo'])) {
    $codigo = (int)$_POST['codigo'];
    $usuario = obtenerUsuarioPorCodigo($codigo);
    if ($usuario && !$usuario['admin']) {
        eliminarUsuario($codigo);
    }
}
header('Location: usuarios.php');
exit();
