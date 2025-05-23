<?php
require 'AccesoBD.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['codigo'])) {
    eliminarPedido((int)$_POST['codigo']);
}
header('Location: admin_pedidos.php');
exit();
