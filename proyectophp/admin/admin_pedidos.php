<?php
session_start();

if (!isset($_SESSION['userid'])) {
    header('Location: login.html');
    exit();
}

require 'AccesoBD.php';

$usuarioFiltro = $_GET['usuario'] ?? '';
$productoFiltro = $_GET['producto'] ?? '';
$soloHoy = isset($_GET['hoy']);

$pedidos = obtenerPedidosFiltrados($usuarioFiltro, $productoFiltro, $soloHoy);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Gestión de Pedidos</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
    <style>
        body {
            background-color: black;
            color: white;
        }
        .producto-linea {
            font-size: 0.9em;
            margin-left: 1.5em;
        }
    </style>
</head>
<body>
<div class="container-fluid">
    <div class="row">
        <div class="col-sm-auto bg-dark sticky-top">
            <div class="d-flex flex-sm-column flex-row flex-nowrap bg-dark align-items-center sticky-top">
                <mi-cabecera></mi-cabecera>
            </div>
        </div>
        <div class="col-sm p-3 min-vh-100">
            <h1 class="display-4">Panel de Gestión de Pedidos</h1>
            <p class="lead">Aquí puedes gestionar los pedidos de los clientes.</p>

            <!-- Filtros -->
            <form class="row g-3 mb-4" method="GET">
                <div class="col-md-3">
                    <input type="text" class="form-control" name="usuario" placeholder="Filtrar por usuario" value="<?= htmlspecialchars($usuarioFiltro) ?>">
                </div>
                <div class="col-md-3">
                    <input type="text" class="form-control" name="producto" placeholder="Filtrar por producto" value="<?= htmlspecialchars($productoFiltro) ?>">
                </div>
                <div class="col-md-2">
                    <div class="form-check mt-2">
                        <input class="form-check-input" type="checkbox" name="hoy" id="hoy" <?= $soloHoy ? 'checked' : '' ?>>
                        <label class="form-check-label" for="hoy">Solo de hoy</label>
                    </div>
                </div>
                <div class="col-md-2">
                    <button type="submit" class="btn btn-primary">Filtrar</button>
                </div>
                <div class="col-md-2">
                    <a href="admin_pedidos.php" class="btn btn-secondary">Limpiar</a>
                </div>
            </form>

            <!-- Botón PDF -->
            <form method="POST" action="exportar_pedidos_pdf.php" class="mb-3">
                <input type="hidden" name="usuario" value="<?= htmlspecialchars($usuarioFiltro) ?>">
                <input type="hidden" name="producto" value="<?= htmlspecialchars($productoFiltro) ?>">
                <input type="hidden" name="hoy" value="<?= $soloHoy ? '1' : '0' ?>">
                <button type="submit" class="btn btn-danger"><i class="bi bi-file-earmark-pdf"></i> Exportar PDF</button>
            </form>

            <table class="table table-dark table-striped">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Persona</th>
                        <th>Fecha</th>
                        <th>Importe</th>
                        <th>Estado</th>
                        <th>Dirección</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($pedidos as $pedido): ?>
                        <tr>
                            <td><?= htmlspecialchars($pedido['codigo']) ?></td>
                            <td><?= htmlspecialchars($pedido['persona']) ?></td>
                            <td><?= htmlspecialchars($pedido['fecha']) ?></td>
                            <td><?= htmlspecialchars($pedido['importe']) ?></td>
                            <td>
                                <form action="actualizar_estado.php" method="POST" class="d-flex">
                                    <input type="hidden" name="codigo" value="<?= $pedido['codigo'] ?>">
                                    <select name="estado" class="form-select form-select-sm me-2">
                                        <option <?= $pedido['estado'] === 'Pendiente' ? 'selected' : '' ?>>Pendiente</option>
                                        <option <?= $pedido['estado'] === 'Enviado' ? 'selected' : '' ?>>Enviado</option>
                                        <option <?= $pedido['estado'] === 'Entregado' ? 'selected' : '' ?>>Entregado</option>
                                    </select>
                                    <button type="submit" class="btn btn-warning btn-sm">Actualizar</button>
                                </form>
                            </td>
                            <td><?= htmlspecialchars($pedido['direccion_envio']) ?></td>
                            <td>
                                <form action="eliminar_pedido.php" method="POST" onsubmit="return confirm('¿Eliminar pedido?');">
                                    <input type="hidden" name="codigo" value="<?= $pedido['codigo'] ?>">
                                    <button type="submit" class="btn btn-danger btn-sm">Eliminar</button>
                                </form>
                            </td>
                        </tr>
                        <?php 
                            $lineas = obtenerLineasPedido($pedido['codigo']);
                            foreach ($lineas as $linea):
                        ?>
                            <tr class="producto-linea text-light bg-secondary">
                                <td colspan="7">
                                    <i class="bi bi-box-seam"></i>
                                    <?= htmlspecialchars($linea['nombre']) ?> (x<?= $linea['cantidad'] ?>) - <?= number_format($linea['precio'], 2) ?> €
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script src="scripts/Cabecera.js"></script>
<script src="scripts/footer.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
