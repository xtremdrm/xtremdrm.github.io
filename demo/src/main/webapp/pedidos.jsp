<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="tienda.Pedido" %>
<%@ page import="tienda.Usuario" %>
<%@ page import="tienda.AccesoBD" %>

<%
    Usuario usuario = (Usuario) session.getAttribute("usuario");
    if (usuario == null) {
        response.sendRedirect("login.jsp");
        return;
    }

    AccesoBD db = new AccesoBD();
    List<Pedido> pedidos = db.obtenerPedidosPorUsuario(usuario.getUsername());

    double total = 0;
    for (Pedido pedido : pedidos) {
        total += pedido.getImporte();
    }

    double iva = total * 0.1736;
    double subtotal = total - iva;
%>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mis Pedidos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="styles/carrito.css">
    <link rel="stylesheet" href="styles/navbar.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body>
<mi-cabecera></mi-cabecera>

<h1 class="texto-carrito">Mis Pedidos</h1>

<div class="container" id="contenedor">
    <%
        for (Pedido pedido : pedidos) {
            String nombre = pedido.getProducto().getNombre();
            String foto = pedido.getProducto().getFoto();
            double precio = pedido.getProducto().getPrecio();
            int cantidad = pedido.getCantidad();
            String estado = pedido.getEstado();
            String fecha = pedido.getFecha().toString();
    %>
        <div class="item row">
            <div class="col-md-3 d-flex justify-content-center align-items-center">
                <img src="<%= foto %>" alt="<%= nombre %>" style="width: 100%; max-width: 150px;">
            </div>
            <div class="col-md-4">
                <h3><%= nombre %></h3>
                <p>Precio unitario: <%= precio %> €</p>
                <p>Estado: <%= estado %></p>
                <p>Fecha: <%= fecha %></p>
            </div>
            <div class="buttongrupo col-md-5 d-flex align-items-center">
                <p class="ms-3">Cantidad: <%= cantidad %></p>
                <p class="ms-3">Importe: <%= pedido.getImporte() %> €</p>
            </div>
        </div>
    <%
        }
    %>

    <div class="total-info">
        <p>Subtotal: <%= String.format("%.2f", subtotal) %> €</p>
        <p>IVA (21%): <%= String.format("%.2f", iva) %> €</p>
        <p><strong>Total: <%= String.format("%.2f", total) %> €</strong></p>
    </div>
</div>

<mi-footer></mi-footer>

<script src="scripts/Cabecera.js"></script>
<script src="scripts/Footer.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
