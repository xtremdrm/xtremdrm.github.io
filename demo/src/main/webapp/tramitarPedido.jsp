<%@ page import="tienda.Usuario" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    Usuario usuario = (Usuario) session.getAttribute("usuario");
    if (usuario == null) {
        session.setAttribute("next", "tramitarPedido.jsp");
        response.sendRedirect("login.jsp");
        return;
    }
%>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tramitar Pedido</title>
    <link rel="stylesheet" href="styles/tramitarPedido.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="styles/navbar.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>

<body>

    <mi-cabecera></mi-cabecera>

    <h1 class="texto-carrito">Tramitar Pedido</h1>

    <div class="container formulario-pedido">
        <form id="miFormulario" action="ProcesarPedidoServlet" method="post">
            <label for="direccion">Dirección de Envío:</label>
            <input type="text" name="direccion" id="direccion" required>

            <label for="ciudad">Ciudad:</label>
            <input type="text" name="ciudad" id="ciudad" required>

            <label for="cp">Código Postal:</label>
            <input type="text" name="cp" id="cp" required pattern="[0-9]{5}" title="Introduce un código postal válido">

            <label for="pago">Método de Pago:</label>
            <select name="pago" id="pago" required>
                <option value="">Seleccione una opción</option>
                <option value="tarjeta">Tarjeta de crédito</option>
                <option value="paypal">PayPal</option>
                <option value="transferencia">Transferencia bancaria</option>
            </select>

            <label for="comentarios">Comentarios:</label>
            <input type="text" name="comentarios" id="comentarios" placeholder="Opcional">
            <button type="submit" class="btn-sec">Finalizar Compra</button>
            <div id="pago-extra"></div>

        </form>
    </div>

    <mi-footer></mi-footer>
    <script>
        document.addEventListener("DOMContentLoaded", function() {

            document.getElementById("miFormulario").addEventListener("submit", function(event) {
                event.preventDefault(); 

                const valores = {
                    direccion: document.getElementById("direccion").value,
                    ciudad: document.getElementById("ciudad").value,
                    cp: document.getElementById("cp").value,
                    pago: document.getElementById("pago").value,
                    comentarios: document.getElementById("comentarios").value
                };


                const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
                if (carrito.length === 0) {
                    alert("Tu carrito está vacío.");
                    return;
                }
                const datos = {
                    direccion: document.getElementById("direccion").value,
                    ciudad: document.getElementById("ciudad").value,
                    cp: document.getElementById("cp").value,
                    productos: carrito
                };

                EnviarCarrito("ProcesarPedidoServlet", datos);
            });

            function EnviarCarrito(url, datos) {
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify(datos)
                };

                fetch(url, options)
                    .then(response => response.text())
                    .then(data => {
                        localStorage.removeItem("carrito");
                        document.body.innerHTML = data;
                    })
                    .catch(error => console.error(error));
            }

            document.getElementById("pago").addEventListener("change", function () {
                const metodo = this.value;
                const contenedor = document.getElementById("pago-extra");
                contenedor.innerHTML = "";

                if (metodo === "tarjeta") {
                    contenedor.innerHTML = `
                        <label for="numTarjeta">Número de Tarjeta:</label>
                        <input type="text" id="numTarjeta" name="numTarjeta" required pattern="[0-9]{16}" title="Debe tener 16 dígitos">

                        <label for="caducidad">Fecha de Caducidad:</label>
                        <input type="month" id="caducidad" name="caducidad" required>

                        <label for="cvv">CVV:</label>
                        <input type="text" id="cvv" name="cvv" required pattern="[0-9]{3}" title="3 dígitos">
                    `;
                } else if (metodo === "paypal") {
                    contenedor.innerHTML = `
                        <label for="correoPaypal">Correo de PayPal:</label>
                        <input type="email" id="correoPaypal" name="correoPaypal" required>
                    `;
                } else if (metodo === "transferencia") {
                    contenedor.innerHTML = `
                        <p>Se mostrarán los datos bancarios al finalizar el pedido.</p>
                    `;
                }
            });
        });
    </script>
    <script src="scripts/carrito.js"></script>
    <script src="scripts/Cabecera.js"></script>
    <script src="scripts/Footer.js"></script>
    <script src="jsdlib.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
