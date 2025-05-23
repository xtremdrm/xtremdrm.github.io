<?php
session_start();
if (!isset($_SESSION['userid'])) {
    header('Location: login.html');
    exit();
}

require 'AccesoBD.php';

$filtro = isset($_GET['filtro']) ? trim($_GET['filtro']) : '';
$result = obtenerUsuariosFiltrados($filtro);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Panel de Gestión de Usuarios</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
    <style>
        body {
            background-color: black;
            color: white;
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
            <h1 class="display-4">Panel de Gestión de Usuarios</h1>
            <p class="lead">Aquí puedes gestionar los usuarios de la web.</p>

            <!-- Buscador -->
            <form method="GET" class="mb-3">
                <div class="input-group">
                    <input type="text" name="filtro" class="form-control" placeholder="Buscar por usuario" value="<?= htmlspecialchars($filtro) ?>">
                    <button type="submit" class="btn btn-primary">Buscar</button>
                </div>
            </form>

            <!-- Tabla de usuarios -->
            <table class="table table-striped table-dark">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Usuario</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Admin</th>
                        <th>Activo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    if ($result && count($result) > 0) {
                        foreach ($result as $row) {
                            echo "<tr>";
                            echo "<td>" . htmlspecialchars($row['codigo']) . "</td>";
                            echo "<td>" . htmlspecialchars($row['usuario']) . "</td>";
                            echo "<td>" . htmlspecialchars($row['nombre'] . ' ' . $row['apellidos']) . "</td>";
                            echo "<td>" . htmlspecialchars($row['email']) . "</td>";
                            echo "<td>" . htmlspecialchars($row['telefono']) . "</td>";
                            echo "<td>" . ($row['admin'] ? 'Sí' : 'No') . "</td>";
                            echo "<td>" . ($row['activo'] ? 'Sí' : 'No') . "</td>";
                            echo "<td class='d-flex gap-2 flex-wrap'>";
                            
                            // Cambiar rol admin
                            echo "<form method='POST' action='actualizarRol.php'>
                                    <input type='hidden' name='codigo' value='" . $row['codigo'] . "' />
                                    <input type='hidden' name='admin' value='" . ($row['admin'] ? 0 : 1) . "' />
                                    <button type='submit' class='btn btn-warning btn-sm'>" . ($row['admin'] ? 'Quitar Admin' : 'Hacer Admin') . "</button>
                                  </form>";

                            // Activar / desactivar usuario
                            echo "<form method='POST' action='actualizarActivo.php'>
                                    <input type='hidden' name='codigo' value='" . $row['codigo'] . "' />
                                    <input type='hidden' name='activo' value='" . ($row['activo'] ? 0 : 1) . "' />
                                    <button type='submit' class='btn btn-secondary btn-sm'>" . ($row['activo'] ? 'Desactivar' : 'Activar') . "</button>
                                  </form>";

                            // Eliminar (si no es admin)
                            if (!$row['admin']) {
                                echo "<form method='POST' action='eliminarUsuario.php' onsubmit='return confirm(\"¿Seguro que deseas eliminar este usuario?\");'>
                                        <input type='hidden' name='codigo' value='" . $row['codigo'] . "' />
                                        <button type='submit' class='btn btn-danger btn-sm'>Eliminar</button>
                                      </form>";
                            }

                            echo "</td></tr>";
                        }
                    } else {
                        echo "<tr><td colspan='8'>No se encontraron usuarios.</td></tr>";
                    }
                    ?>
                </tbody>
            </table>

            <!-- Formulario para agregar un nuevo usuario -->
            <h3 class="mt-5">Agregar un nuevo usuario</h3>
            <form action="agregarUsuario.php" method="POST">
                <div class="mb-3"><label for="usuario" class="form-label">Usuario</label><input type="text" class="form-control" id="usuario" name="usuario" required /></div>
                <div class="mb-3"><label for="contrasenya" class="form-label">Contraseña</label><input type="password" class="form-control" id="contrasenya" name="contrasenya" required /></div>
                <div class="mb-3"><label for="nombre" class="form-label">Nombre</label><input type="text" class="form-control" id="nombre" name="nombre" /></div>
                <div class="mb-3"><label for="apellidos" class="form-label">Apellidos</label><input type="text" class="form-control" id="apellidos" name="apellidos" /></div>
                <div class="mb-3"><label for="domicilio" class="form-label">Domicilio</label><input type="text" class="form-control" id="domicilio" name="domicilio" /></div>
                <div class="mb-3"><label for="ciudad" class="form-label">Ciudad</label><input type="text" class="form-control" id="ciudad" name="ciudad" /></div>
                <div class="mb-3"><label for="telefono" class="form-label">Teléfono</label><input type="text" class="form-control" id="telefono" name="telefono" /></div>
                <div class="mb-3"><label for="email" class="form-label">Correo electrónico</label><input type="email" class="form-control" id="email" name="email" /></div>
                <div class="form-check mb-3"><input class="form-check-input" type="checkbox" id="admin" name="admin" /><label class="form-check-label" for="admin">¿Es administrador?</label></div>
                <button type="submit" class="btn btn-primary">Agregar Usuario</button>
            </form>
        </div>
    </div>
</div>

<script src="scripts/Cabecera.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
