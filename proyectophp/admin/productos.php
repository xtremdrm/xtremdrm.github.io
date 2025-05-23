<?php
session_start();

if (!isset($_SESSION['userid'])) {
    header('Location: login.html');
    exit();
}

require 'AccesoBD.php';
$result = obtenerProductos();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Panel de Gestión de Productos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
</head>
<body>
<div class="container-fluid">
    <div class="row">
        <div class="col-sm-auto bg-dark sticky-top">
            <div class="d-flex flex-sm-column flex-row flex-nowrap bg-dark align-items-center sticky-top">
                <mi-cabecera></mi-cabecera>
            </div>
        </div>
        <!-- Aquí se añade bg-dark y text-white para fondo y texto oscuro -->
        <div class="col-sm p-3 min-vh-100 bg-dark text-white">
            <h1 class="display-4">Panel de Gestión de Productos</h1>
            <p class="lead">Gestiona los productos disponibles en la tienda.</p>

            <?php if (isset($_GET['mensaje']) && $_GET['mensaje'] === 'modificado'): ?>
                <div class="alert alert-success">Producto modificado correctamente.</div>
            <?php elseif (isset($_GET['mensaje']) && $_GET['mensaje'] === 'error'): ?>
                <div class="alert alert-danger">Error al modificar el producto.</div>
            <?php endif; ?>

            <table class="table table-striped table-dark">
                <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Existencias</th>
                    <th>Imagen</th>
                    <th>Kilómetros</th>
                    <th>Marca</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <?php
                if ($result && count($result) > 0) {
                    foreach ($result as $row) {
                        echo "<tr>";

                        // Celda código (no editable)
                        echo "<td>" . htmlspecialchars($row['codigo']) . "</td>";

                        // Celda nombre (no editable)
                        echo "<td>" . htmlspecialchars($row['nombre']) . "</td>";

                        // Celda precio editable dentro de formulario
                        echo "<form action='modificarProducto.php' method='POST'>";
                        echo "<input type='hidden' name='codigo' value='" . htmlspecialchars($row['codigo']) . "' />";
                        echo "<td><input type='number' class='form-control' name='precio' step='0.01' value='" . htmlspecialchars($row['precio']) . "' required /></td>";
                        echo "<td><input type='number' class='form-control' name='existencias' value='" . htmlspecialchars($row['existencias']) . "' required /></td>";
                        echo "<td><input type='text' class='form-control' name='imagen' value='" . htmlspecialchars($row['imagen']) . "' required /></td>";
                        echo "<td><input type='number' class='form-control' name='kilometros' value='" . htmlspecialchars($row['kilometros']) . "' required /></td>";

                        // Marca y categoría no editables
                        echo "<td>" . htmlspecialchars($row['marca']) . "</td>";
                        echo "<td>" . htmlspecialchars($row['categoria']) . "</td>";

                        // Botón guardar dentro del mismo formulario
                        echo "<td><button type='submit' class='btn btn-success btn-sm'>Guardar</button></td>";
                        echo "</form>";

                        // Celda para botón eliminar, formulario independiente
                        echo "<td>";
                        echo "<form action='eliminarProductos.php' method='POST' onsubmit='return confirm(\"¿Seguro que deseas eliminar este producto?\");'>";
                        echo "<input type='hidden' name='codigo' value='" . htmlspecialchars($row['codigo']) . "' />";
                        echo "<button type='submit' class='btn btn-danger btn-sm'>Eliminar</button>";
                        echo "</form>";
                        echo "</td>";

                        echo "</tr>";

                    }
                } else {
                    echo "<tr><td colspan='10'>No se encontraron productos.</td></tr>";
                }
                ?>
                </tbody>
            </table>

            <h3>Agregar un nuevo producto</h3>
            <form action="AgregarProductos.php" method="POST" enctype="multipart/form-data">
                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre</label>
                    <input type="text" class="form-control" id="nombre" name="nombre" required />
                </div>
                <div class="mb-3">
                    <label for="precio" class="form-label">Precio</label>
                    <input type="number" class="form-control" id="precio" name="precio" step="0.01" required />
                </div>
                <div class="mb-3">
                    <label for="existencias" class="form-label">Existencias</label>
                    <input type="number" class="form-control" id="existencias" name="existencias" required />
                </div>
                <div class="mb-3">
                    <label for="imagen" class="form-label">Imagen URL</label>
                    <input type="text" class="form-control" id="imagen" name="imagen" required />
                </div>
                <div class="mb-3">
                    <label for="kilometros" class="form-label">Kilómetros</label>
                    <input type="number" class="form-control" id="kilometros" name="kilometros" required />
                </div>
                <div class="mb-3">
                    <label for="marca" class="form-label">Marca</label>
                    <input type="text" class="form-control" id="marca" name="marca" required />
                </div>
                <div class="mb-3">
                    <label for="categoria" class="form-label">Categoría</label>
                    <input type="text" class="form-control" id="categoria" name="categoria" required />
                </div>
                <button type="submit" class="btn btn-primary">Agregar Producto</button>
            </form>
        </div>
    </div>
</div>

<script src="scripts/Cabecera.js"></script>
<script src="scripts/footer.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
