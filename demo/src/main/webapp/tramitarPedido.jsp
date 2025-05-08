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
        <form id= "miFormulario" action="ProcesarPedidoServlet" method="post">
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
        </form>
    </div>

    <mi-footer></mi-footer>
    <script>
    document.getElementById("miFormulario").addEventListener("submit", function(event) {
        event.preventDefault();  // Evita el envío por defecto del formulario

        // Recoger los valores del formulario
        const valores = {
            direccion: document.getElementById("direccion").value,
            ciudad: document.getElementById("ciudad").value,
            cp: document.getElementById("cp").value,
            pago: document.getElementById("pago").value,
            comentarios: document.getElementById("comentarios").value
        };

        // Obtener el carrito desde el localStorage
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        if (carrito.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }

        // Incluir el carrito en los valores del formulario
        valores.carrito = carrito;

        // Llamar a la función para enviar el carrito
        EnviarCarrito("ProcesarPedidoServlet", valores);
    });

    function EnviarCarrito(url, datos) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos),
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                return response.json();  // Si la respuesta es JSON
            } else {
                throw new Error('Error en la solicitud: ' + response.status);
            }
        })
        .then(data => {
            console.log('Pedido procesado:', data);
            // Limpia carrito
            localStorage.removeItem("carrito");
            // Redirige al pedido finalizado
            window.location.href = "pedidoFinalizado.jsp?cod=" + data.codPedido;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    </script>
    <script src="scripts/carrito.js"></script>
    <script src="scripts/Cabecera.js"></script>
    <script src="scripts/Footer.js"></script>
    <script src="jsdlib.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
