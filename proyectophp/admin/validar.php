<?php
session_start();

if (isset($_REQUEST['usuario']) && isset($_REQUEST['clave'])) {
    $usuario = $_REQUEST['usuario'];
    $clave = $_REQUEST['clave'];

    $bbdd = mysqli_connect("localhost", "root", "root", "daw");

    if (mysqli_connect_error()) {
        printf("Error conectando a la base de datos: %s\n", mysqli_connect_error());
        exit();
    }

    if ($consulta = mysqli_prepare($bbdd, "SELECT codigo FROM usuarios WHERE usuario=? AND contrasenya=? AND admin=1")) {
        mysqli_stmt_bind_param($consulta, "ss", $usuario, $clave);
        mysqli_stmt_execute($consulta);
        mysqli_stmt_bind_result($consulta, $codigo);
        if (mysqli_stmt_fetch($consulta)) {
            $_SESSION['userid'] = $codigo;
            header('Location: ./index.php');
        } else {
            header('Location: ./login.html');
        }
        mysqli_stmt_close($consulta);
    } else {
        echo "Error preparando la consulta.";
    }

    mysqli_close($bbdd);
} else {
    // Acceso directo sin formulario → redirigir a login
    header('Location: ./login.html');
}
?>
