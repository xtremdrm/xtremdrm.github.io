<!DOCTYPE html>
<html lang="es">

<head>
    <title>Login</title>
    <link rel="stylesheet" href="styles/login.css">
</head>

<body>
    <div class="login">
    <%
    String error = (String) request.getAttribute("error");
    if (error != null) {
    %>
    <p style="color:red;"><%= error %></p>
    <%
    }
    %>

        <img src="resources/background.avif" alt="logo" class="login__img">
        <form action="LoginServlet" method="post" class="login__form">
            <div class="login__block">
                <div class="login__input">
                    <h1 class="login__title">Log in</h1>
                    <table>
                        <tr>
                            <td>
                                <label for="username" class="login__userlabel">Nombre de usuario:</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type="text" placeholder="Inserte nombre de usuario" name="username" id="username"
                                    required class="login__inputusername"><br>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="password" class="login__passwordlabel">Contraseña:</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type="password" placeholder="Inserte contrasenya" name="password"
                                    class="login__inputpassword" id="password" required><br>
                            </td>
                        </tr>
                    </table>
                    <div class="login__checkbox">
                        <input type="checkbox" class="remembercheckbox" name="remember" id="remember">
                        <label for="remember" class="rememberlabel">Recuérdame</label>
                    </div>
                    <input type="submit" value="Iniciar sesión" id="botonlg" class="login__submit">
                </div>
            </div>
            <div class="registerpanel">
                <label>No tienes una cuenta?</label>
                <a href="register.jsp">Regístrate</a>
            </div>
        </form>
    </div>
</body>

</html>