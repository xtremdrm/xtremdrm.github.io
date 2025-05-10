<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles/register.css">
    <title>Registro</title>
    <script>

    window.onload = function () {
        const errorMessage = '<%= request.getAttribute("errorMessage") != null ? request.getAttribute("errorMessage") : "" %>';
        if (errorMessage && errorMessage.trim() !== "") {
            alert(errorMessage);  
        }
    };
</script>

</head>

<body>
    <img src="resources/register_background.avif" class="background-image" alt="fondo">
    <div class="register-form-container">
        <h1 class="register-title">Registrarse</h1>
        <form action="RegisterServlet" method="post" class="register-form">
            <label for="name">Nombre</label>
            <input type="text" id="name" name="name" required>

            <label for="surname">Apellido</label>
            <input type="text" id="surname" name="surname" required>

            <label for="username">Nombre de usuario</label>
            <input type="text" id="username" name="username" required>

            <label for="password">Contraseña</label>
            <input type="password" id="password" name="password" required>

            <label for="email">Correo electrónico</label>
            <input type="email" id="email" name="email" required>

            <label for="domicilio">Domicilio</label>
            <input type="text" id="domicilio" name="domicilio" required>

            <label for="ciudad">Ciudad</label>
            <input type="text" id="ciudad" name="ciudad" required>

            <label for="telefono">Teléfono</label>
            <input type="tel" id="telefono" name="telefono" required>

            <div class="login">
                <label class="acc">¿Ya tienes una cuenta? <a href="login.jsp">Iniciar sesión</a></label><br><br><br>
            </div>
            <input type="submit" value="Registrarse">
        </form>
    </div>
</body>

</html>

