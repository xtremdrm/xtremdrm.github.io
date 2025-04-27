<%@ page contentType="text/html; charset=UTF-8" %>
    <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
        <%@ page import="tienda.AccesoBD" %>
            <%@ page import="tienda.Producto" %>
                <%@ page import="java.util.List" %>
                    <!DOCTYPE html>
                    <html lang="en">

                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Catalogo</title>

                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
                            rel="stylesheet">
                        <link rel="stylesheet" href="styles/catalogo.css">
                        <link rel="stylesheet" href="styles/navbar.css">
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Radley:ital@0;1&display=swap"
                            rel="stylesheet">
                        <link rel="stylesheet"
                            href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
                    </head>

                    <body>
                        <% AccesoBD con=AccesoBD.getInstance(); List<Producto> productos = con.obtenerProductosBD();
                            %>
                            <mi-cabecera></mi-cabecera>
                            <h1>NUESTRO <br> CATALOGO</h1>
                            <h3>Oferta de coches</h3>
                            <div class="container">
                                <div class="catalogo">
                                    <% for (Producto producto : productos) { %>
                                        <div class="item">
                                            <img src="<%= producto.getImagen() %>" alt="<%= producto.getNombre() %>">
                                            <p class="desc">
                                                <%= producto.getNombre() %> <i class="bi bi-arrow-right"></i>
                                            </p>
                                            <p class="precio">
                                                <%= producto.getPrecio() %>$
                                            </p>
                                            <p class="desc">
                                                <%= producto.getKilometros() %> km | <%= producto.getCategoria() %>
                                            </p>
                                            <% if (producto.getExistencias()> 0) { %>
                                                <button class="carrito"
                                                    onclick="anadirCarrito('<%= producto.getNombre() %>', <%= producto.getKilometros() %>, 1, '<%= producto.getImagen() %>')">Comprar</button>
                                                <% } else { %>
                                                    &nbsp;
                                                    <% } %>
                                        </div>
                                        <% } %>

                                </div>
                                <div id="popup-overlay" class="popup-overlay">
                                    <div id="popup" class="popup">
                                        <p id="popup-message">Producto añadido al carrito</p>
                                        <button onclick="cerrarPopup()">OK</button>
                                    </div>
                                </div>
                            </div>
                                <mi-footer></mi-footer>
                                <script src="scripts/carrito.js"></script>
                                <script src="scripts/Cabecera.js"></script>
                                <script src="scripts/Footer.js"></script>
                                <script
                                    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
                    </body>

                    </html>