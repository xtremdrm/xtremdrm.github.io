<?php
require 'AccesoBD.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['codigo'], $_POST['estado'])) {
    actualizarEstadoPedido((int)$_POST['codigo'], $_POST['estado']);
}
header('Location: admin_pedidos.php');
exit();
