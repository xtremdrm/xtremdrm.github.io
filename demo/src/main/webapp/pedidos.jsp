<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="tienda.Pedido" %>
<%@ page import="tienda.LineaPedido" %>
<%@ page import="tienda.Producto" %>
<%@ page import="tienda.Usuario" %>
<%@ page import="tienda.AccesoBD" %>

<%
    Usuario usuario = (Usuario) session.getAttribute("usuario");
    if (usuario == null) {
        response.sendRedirect("login.jsp");
        return;
    }

    AccesoBD db = AccesoBD.getInstance(); 
    List<Pedido> pedidos = db.obtenerPedidosPorUsuario(usuario.getCodigo()); 

    double total = 0;
    for (Pedido pedido : pedidos) {
        total += pedido.getImporte();
    }

    double iva = total * 0.21;
    double subtotal = total - iva;
%>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mis Pedidos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="styles/pedidos.css">
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
    %>
<h3>
    Pedido Nº <%= pedido.getCodigo() %> - Estado: <%= pedido.getEstado() %> - Fecha: <%= pedido.getFecha() %>
    <% if (!pedido.getEstado().equalsIgnoreCase("Enviado") && !pedido.getEstado().equalsIgnoreCase("Recibido")) { %>
        <form action="EliminarPedido" method="post" style="display:inline;" onsubmit="return confirm('¿Estás seguro de que deseas eliminar este pedido?');">
                <input type="hidden" name="idPedido" value="<%= pedido.getCodigo() %>">
                <button type="submit" class="btn btn-sm btn-outline-danger ms-3" title="Eliminar pedido">
                     <i class="bi bi-trash"></i>
                </button>
            </form>
    <% } %>
</h3>

        <div class="row mb-4">
            <%
                for (LineaPedido linea : pedido.getLineas()) {
                    Producto producto = db.obtenerProductoPorId(linea.getProductoId());
                    if (producto != null) {
            %>
                <div class="item row">
                    <div class="col-md-3 d-flex justify-content-center align-items-center">
                        <img src="<%= producto.getImagen() %>" alt="<%= producto.getNombre() %>" style="width: 100%; max-width: 150px;">
                    </div>
                    <div class="col-md-4">
                        <h4><%= producto.getNombre() %></h4>
                        <p>Precio unitario: <%= producto.getPrecio() %> €</p>
                        <p>Categoría: <%= producto.getCategoria() %></p>
                    </div>
                    <div class="buttongrupo col-md-5 d-flex align-items-center">
                        <p class="ms-3">Cantidad: <%= linea.getCantidad() %></p>
                        <p class="ms-3">Importe: <%= producto.getPrecio() * linea.getCantidad() %> €</p>
                    </div>
                </div>
            <%
                    }
                }
            %>
            <p class="mt-2"><strong>Importe total del pedido: <%= pedido.getImporte() %> €</strong></p>
        </div>
    <%
        }
    %>

    <div class="total-info mt-4">
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
