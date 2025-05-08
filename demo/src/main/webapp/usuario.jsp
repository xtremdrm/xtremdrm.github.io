<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="tienda.Usuario" %>
<%
    Usuario usuario = (Usuario) session.getAttribute("usuario");
    if (usuario == null) {
        response.sendRedirect("login.jsp");
        return;
    }
%>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Usuario</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="styles/usuario.css">
    <link rel="stylesheet" href="styles/navbar.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Radley:ital@0;1&display=swap" rel="stylesheet">
</head>
<body>
<mi-cabecera></mi-cabecera>
<h1>Perfil de Usuario</h1>
<div class="cont container py-5">
    <div class="row">
        <div class="col-12 bg-dark">
            <form action="ActualizarUsuarioServlet" method="post">
                <div class="card border-0 shadow-sm">
                    <div class="card-body p-0">
                        <div class="row g-0">
                            <div class="col-lg-9">
                                <div class="p-4">
                                    <div class="mb-4">
                                        <h5 class="mb-4">Datos de usuario</h5>
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <label class="form-label">Nombre de usuario</label>
                                                <input type="text" class="form-control" name="usuario" value="<%= usuario.getUsuario() %>" readonly style="pointer-events: none;">
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label">Nombre</label>
                                                <input type="text" class="form-control" name="nombre" value="<%= usuario.getNombre() %>">
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label">Apellidos</label>
                                                <input type="text" class="form-control" name="apellidos" value="<%= usuario.getApellidos() %>">
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label">Email</label>
                                                <input type="email" class="form-control" name="email" value="<%= usuario.getEmail() %>">
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label">Teléfono</label>
                                                <input type="tel" class="form-control" name="telefono" value="<%= usuario.getTelefono() %>">
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label">Dirección</label>
                                                <input type="text" class="form-control" name="domicilio" value="<%= usuario.getDomicilio() %>">
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label">Ciudad</label>
                                                <input type="text" class="form-control" name="ciudad" value="<%= usuario.getCiudad() %>">
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <input type="submit" class="actualizar mb-4" value="Actualizar información">
                                        <a href="LogoutServlet"><button type="button" class="mb-4 btn btn-danger">Cerrar Sesión</button></a>
                                    </div>

                                    <% if (request.getAttribute("error") != null) { %>
                                        <div class="alert alert-danger"><%= request.getAttribute("error") %></div>
                                    <% } %>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<mi-footer></mi-footer>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" defer></script>
<script src="scripts/Footer.js" defer></script>
<script src="scripts/Cabecera.js" defer></script>
</body>
</html>
