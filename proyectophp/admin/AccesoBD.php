<?php

$servername = "localhost";
$username = "root";
$password = "root"; 
$dbname = "daw";         

// Crear la conexión
function conectar() {
    global $servername, $username, $password, $dbname;
    $bbdd = mysqli_connect($servername, $username, $password, $dbname);

    if (!$bbdd) {
        die("Conexión fallida: " . mysqli_connect_error());
    }

    return $bbdd;
}

// Desconectar la base de datos
function desconectar($bbdd) {
    mysqli_close($bbdd);
}

// ─────────────────────────────────────────────────────────────
// FUNCIONES DE PRODUCTOS

function obtenerProductos() {
    $bbdd = conectar();
    $sql = "SELECT * FROM productos";
    
    if ($stmt = mysqli_prepare($bbdd, $sql)) {
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $productos = [];
        while ($producto = mysqli_fetch_assoc($result)) {
            $productos[] = $producto;
        }
        mysqli_stmt_close($stmt);
        desconectar($bbdd);
        return $productos;
    } else {
        desconectar($bbdd);
        return null;
    }
}

function agregarProducto($nombre, $precio, $existencias, $imagen, $kilometros, $marca, $categoria) {
    $bbdd = conectar();
    $sql = "INSERT INTO productos (nombre, precio, existencias, imagen, kilometros, marca, categoria) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    if ($stmt = mysqli_prepare($bbdd, $sql)) {
        mysqli_stmt_bind_param($stmt, "sdissss", $nombre, $precio, $existencias, $imagen, $kilometros, $marca, $categoria);
        $result = mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
        desconectar($bbdd);
        return $result;
    } else {
        desconectar($bbdd);
        return false;
    }
}


function eliminarProducto($codigo) {
    $bbdd = conectar();
    $sql = "DELETE FROM productos WHERE codigo = ?";
    
    if ($stmt = mysqli_prepare($bbdd, $sql)) {
        mysqli_stmt_bind_param($stmt, "i", $codigo);
        $result = mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
        desconectar($bbdd);
        return $result;
    } else {
        desconectar($bbdd);
        return false;
    }
}

function modificarProducto($codigo, $precio, $existencias, $imagen, $kilometros, $nombre, $marca, $categoria) {
    $conn = conectar();
    $sql = "UPDATE productos SET precio=?, existencias=?, imagen=?, kilometros=?, nombre=?, marca=?, categoria=? WHERE codigo=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("disssssi", $precio, $existencias, $imagen, $kilometros, $nombre, $marca, $categoria, $codigo);
    $resultado = $stmt->execute();
    $stmt->close();
    $conn->close();
    return $resultado;
}


// ─────────────────────────────────────────────────────────────
// FUNCIÓN DE USUARIO PARA LOGIN
function obtenerUsuario($usuario, $contrasenya) {
    $bbdd = conectar();
    $sql = "SELECT * FROM usuarios WHERE usuario = ? AND contrasenya = ?";

    if ($stmt = mysqli_prepare($bbdd, $sql)) {
        mysqli_stmt_bind_param($stmt, "ss", $usuario, $contrasenya);
        mysqli_stmt_execute($stmt);
        $resultado = mysqli_stmt_get_result($stmt);
        $usuario = mysqli_fetch_assoc($resultado);

        mysqli_stmt_close($stmt);
        desconectar($bbdd);
        return $usuario;
    } else {
        desconectar($bbdd);
        return null;
    }
}
function obtenerPedidos() {
    $bbdd = conectar();
    $sql = "SELECT * FROM pedidos ORDER BY fecha DESC";
    $result = mysqli_query($bbdd, $sql);
    $pedidos = [];
    if ($result) {
        while ($fila = mysqli_fetch_assoc($result)) {
            $pedidos[] = $fila;
        }
    }
    desconectar($bbdd);
    return $pedidos;
}

function eliminarPedido($codigo) {
    $bbdd = conectar();
    $sql = "DELETE FROM pedidos WHERE codigo = ?";
    $stmt = mysqli_prepare($bbdd, $sql);
    mysqli_stmt_bind_param($stmt, "i", $codigo);
    $res = mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
    desconectar($bbdd);
    return $res;
}

function actualizarEstadoPedido($codigo, $estado) {
    $bbdd = conectar();
    $sql = "UPDATE pedidos SET estado = ? WHERE codigo = ?";
    $stmt = mysqli_prepare($bbdd, $sql);
    mysqli_stmt_bind_param($stmt, "si", $estado, $codigo);
    $res = mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
    desconectar($bbdd);
    return $res;
}
function obtenerPedidosFiltrados($usuario = '', $producto = '', $soloHoy = false) {
    $bbdd = conectar();

    $query = "SELECT p.* FROM pedidos p 
              JOIN linea_pedido lp ON p.codigo = lp.pedido_id 
              JOIN productos pr ON lp.producto_id = pr.codigo 
              WHERE 1=1";

    $tipos = "";
    $params = [];

    if (!empty($usuario)) {
        $query .= " AND p.persona LIKE ?";
        $tipos .= "s";
        $params[] = "%$usuario%";
    }

    if (!empty($producto)) {
        $query .= " AND pr.nombre LIKE ?";
        $tipos .= "s";
        $params[] = "%$producto%";
    }

    if ($soloHoy) {
        $query .= " AND DATE(p.fecha) = CURDATE()";
    }

    $query .= " GROUP BY p.codigo ORDER BY p.fecha DESC";

    if ($stmt = mysqli_prepare($bbdd, $query)) {
        if (!empty($tipos)) {
            mysqli_stmt_bind_param($stmt, $tipos, ...$params);
        }
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $pedidos = [];
        while ($pedido = mysqli_fetch_assoc($result)) {
            $pedidos[] = $pedido;
        }
        mysqli_stmt_close($stmt);
        desconectar($bbdd);
        return $pedidos;
    } else {
        desconectar($bbdd);
        return null;
    }
}

function obtenerLineasPedido($pedidoId) {
    $bbdd = conectar();
    $sql = "SELECT lp.*, pr.nombre, pr.precio FROM linea_pedido lp 
            JOIN productos pr ON lp.producto_id = pr.codigo 
            WHERE lp.pedido_id = ?";
    if ($stmt = mysqli_prepare($bbdd, $sql)) {
        mysqli_stmt_bind_param($stmt, "i", $pedidoId);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $lineas = [];
        while ($linea = mysqli_fetch_assoc($result)) {
            $lineas[] = $linea;
        }
        mysqli_stmt_close($stmt);
        desconectar($bbdd);
        return $lineas;
    } else {
        desconectar($bbdd);
        return null;
    }
}

// ─────────────────────────────────────────────────────────────
// FUNCIONES DE GESTIÓN DE USUARIOS

function obtenerUsuarios() {
    $bbdd = conectar();
    $sql = "SELECT * FROM usuarios ORDER BY usuario ASC";
    $result = mysqli_query($bbdd, $sql);
    $usuarios = [];
    if ($result) {
        while ($fila = mysqli_fetch_assoc($result)) {
            $usuarios[] = $fila;
        }
    }
    desconectar($bbdd);
    return $usuarios;
}

function agregarUsuario($usuario, $contrasenya, $admin = 0, $nombre = null, $apellidos = null, $domicilio = null, $ciudad = null, $telefono = null, $email = null) {
    $bbdd = conectar();
    $sql = "INSERT INTO usuarios (usuario, contrasenya, admin, nombre, apellidos, domicilio, ciudad, telefono, email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    if ($stmt = mysqli_prepare($bbdd, $sql)) {
        mysqli_stmt_bind_param($stmt, "ssissssss", $usuario, $contrasenya, $admin, $nombre, $apellidos, $domicilio, $ciudad, $telefono, $email);
        $res = mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
        desconectar($bbdd);
        return $res;
    } else {
        desconectar($bbdd);
        return false;
    }
}


function usuarioExistente($usuario) {
    $bbdd = conectar();
    $stmt = mysqli_prepare($bbdd, "SELECT codigo FROM usuarios WHERE usuario = ?");
    mysqli_stmt_bind_param($stmt, "s", $usuario);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);
    $existe = mysqli_stmt_num_rows($stmt) > 0;
    mysqli_stmt_close($stmt);
    desconectar($bbdd);
    return $existe;
}

function emailExistente($email) {
    $bbdd = conectar();
    $stmt = mysqli_prepare($bbdd, "SELECT codigo FROM usuarios WHERE email = ?");
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);
    $existe = mysqli_stmt_num_rows($stmt) > 0;
    mysqli_stmt_close($stmt);
    desconectar($bbdd);
    return $existe;
}

function telefonoExistente($telefono) {
    $bbdd = conectar();
    $stmt = mysqli_prepare($bbdd, "SELECT codigo FROM usuarios WHERE telefono = ?");
    mysqli_stmt_bind_param($stmt, "s", $telefono);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);
    $existe = mysqli_stmt_num_rows($stmt) > 0;
    mysqli_stmt_close($stmt);
    desconectar($bbdd);
    return $existe;
}

function actualizarRolUsuario($codigo, $admin) {
    $bbdd = conectar();
    $sql = "UPDATE usuarios SET admin = ? WHERE codigo = ?";
    $stmt = mysqli_prepare($bbdd, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $admin, $codigo);
    $res = mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
    desconectar($bbdd);
    return $res;
}

function eliminarUsuario($codigo) {
    $bbdd = conectar();
    
    $sqlCheck = "SELECT admin FROM usuarios WHERE codigo = ?";
    $stmtCheck = mysqli_prepare($bbdd, $sqlCheck);
    mysqli_stmt_bind_param($stmtCheck, "i", $codigo);
    mysqli_stmt_execute($stmtCheck);
    mysqli_stmt_bind_result($stmtCheck, $esAdmin);
    mysqli_stmt_fetch($stmtCheck);
    mysqli_stmt_close($stmtCheck);

    if ($esAdmin == 1) {
        desconectar($bbdd);
        return false; // No se puede eliminar si es admin
    }
    $sql = "DELETE FROM usuarios WHERE codigo = ?";
    $stmt = mysqli_prepare($bbdd, $sql);
    mysqli_stmt_bind_param($stmt, "i", $codigo);
    $res = mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
    desconectar($bbdd);
    return $res;
}
function contarUsuarios() {
    $bbdd = conectar();
    $sql = "SELECT COUNT(*) as total FROM usuarios";
    $result = mysqli_query($bbdd, $sql);
    $fila = mysqli_fetch_assoc($result);
    desconectar($bbdd);
    return $fila['total'];
}
function obtenerUsuariosPaginados($offset, $limite) {
    $bbdd = conectar();
    $sql = "SELECT * FROM usuarios ORDER BY usuario ASC LIMIT ?, ?";
    $stmt = mysqli_prepare($bbdd, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $offset, $limite);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $usuarios = [];
    while ($fila = mysqli_fetch_assoc($result)) {
        $usuarios[] = $fila;
    }
    mysqli_stmt_close($stmt);
    desconectar($bbdd);
    return $usuarios;
}
function obtenerUsuarioPorCodigo($codigo) {
    $bbdd = conectar();
    $sql = "SELECT * FROM usuarios WHERE codigo = ?";
    $stmt = mysqli_prepare($bbdd, $sql);
    mysqli_stmt_bind_param($stmt, "i", $codigo);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $usuario = mysqli_fetch_assoc($result);
    mysqli_stmt_close($stmt);
    desconectar($bbdd);
    return $usuario;
}
function obtenerUsuariosFiltrados($filtro = '') {
    $bbdd = conectar();
    if ($filtro) {
        $sql = "SELECT * FROM usuarios WHERE usuario LIKE ?";
        $stmt = mysqli_prepare($bbdd, $sql);
        $param = "%" . $filtro . "%";
        mysqli_stmt_bind_param($stmt, "s", $param);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
    } else {
        $sql = "SELECT * FROM usuarios";
        $result = mysqli_query($bbdd, $sql);
    }

    $usuarios = [];
    if ($result) {
        while ($fila = mysqli_fetch_assoc($result)) {
            $usuarios[] = $fila;
        }
    }
    if (isset($stmt)) {
        mysqli_stmt_close($stmt);
    }
    desconectar($bbdd);
    return $usuarios;
}
function actualizarEstadoActivo($codigo, $activo) {
    $bbdd = conectar();
    $sql = "UPDATE usuarios SET activo = ? WHERE codigo = ?";
    $stmt = mysqli_prepare($bbdd, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $activo, $codigo);
    $res = mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);
    desconectar($bbdd);
    return $res;
}

?>
