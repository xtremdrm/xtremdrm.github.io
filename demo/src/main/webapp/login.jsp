<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="es">

<head>
    <title>Login</title>
    <link rel="stylesheet" href="styles/login.css">
    <style>
        /* Popup */
        #popupError {
            display: none;
            position: fixed;
            left: 50%;
            top: 20%;
            transform: translate(-50%, -50%);
            background-color: #f44336;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.5);
            z-index: 1000;
            font-size: 16px;
            text-align: center;
        }

        #closeBtn {
            background: none;
            border: none;
            color: white;
            font-weight: bold;
            float: right;
            cursor: pointer;
            font-size: 18px;
        }
    </style>
</head>

<body>
    <div id="popupError">
        <button id="closeBtn">X</button>
        <span><%= request.getAttribute("loginError") != null ? request.getAttribute("loginError") : "" %></span>
    </div>

    <div class="login">
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
                                    required class="login__inputusername"
                                    value="<%= request.getAttribute("lastUsername") != null ? request.getAttribute("lastUsername") : "" %>"><br>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label for="password" class="login__passwordlabel">Contraseña:</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type="password" placeholder="Inserte contraseña" name="password"
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
                <label>¿No tienes una cuenta?</label>
                <a href="registerpage.jsp">Regístrate</a>
            </div>
        </form>
    </div>

    <script>
        // Mostrar popup si hay error
        <% if (request.getAttribute("loginError") != null) { %>
            document.addEventListener('DOMContentLoaded', function() {
                document.getElementById('popupError').style.display = 'block';
                // Auto-cerrar después de 3 segundos
                setTimeout(function() {
                    document.getElementById('popupError').style.display = 'none';
                }, 3000);
            });
        <% } %>

        // Botón cerrar
        document.getElementById('closeBtn').addEventListener('click', function () {
            document.getElementById('popupError').style.display = 'none';
        });
    </script>
</body>

</html>
