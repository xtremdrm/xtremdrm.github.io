class Producto {
    constructor(nombre, precio, existencias, foto) {
        this.nombre = nombre;
        this.precio = precio;
        this.existencias = existencias;
        this.foto = foto;
    }
}

let carrito = [];

function anadirCarrito(nombre, precio, existencias, foto) {
    let productoExistente = carrito.find(producto => producto.nombre === nombre);

    if (productoExistente) {
        productoExistente.existencias += existencias;
        console.log(`Existencias actualizadas para ${nombre}. Nuevas existencias: ${productoExistente.existencias}`);
    } else {
        let producto = new Producto(nombre, precio, existencias, foto);
        carrito.push(producto);
        console.log('Producto añadido al carrito:', nombre);
    }

    mostrarPopup();
    guardarcarrito();
    console.log('Carrito actualizado:', carrito);
}

function guardarcarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function getCarrito(){
    return JSON.parse(localStorage.getItem("carrito"));
}

function eliminarArticulo(nombre) {
    carrito = getCarrito();
    console.log("Carrito antes de eliminar:", carrito); 
    carrito = carrito.filter(producto => producto.nombre !== nombre);
    console.log("Carrito después de eliminar:", carrito); 
    guardarcarrito();
    cargarCarrito();
}

function setCantidad(producto) {
    let cantidad = document.getElementById("cantidad").value;
    alert("Cantidad modificada.");
    producto.existencias = cantidad;
    guardarcarrito();
}

function vaciarCarrito() {
    carrito = [];
    guardarcarrito();
    localStorage.removeItem("carrito");
    cargarCarrito();
}

document.addEventListener("DOMContentLoaded", function () {
    let carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    cargarCarrito();
    console.log(carrito);
});

function montarProducto(nombre,precio,existencias,foto){
    return `<div class="item row">
            <div class="col-md-3 d-flex justify-content-center align-items-center">
                <img src="${foto}" alt="${nombre}" style="width: 100%; max-width: 150px;">
            </div>

            <div class="col-md-4">
                <h3>${nombre}</h3>
                <p>Precio: ${precio} €</p>
            </div>

            <div class=" buttongrupo col-md-5 d-flex align-items-center">
                <div class="d-flex ms-3">
                    <button class="btn btn-secondary btn-sm" onclick="actualizarCantidad('${nombre}',-1)">-</button>
                    <input type="number" id="cantidad" class="form-control text-center" value="${existencias}" min="1" max="10"
                        onchange="actualizarTotal()">
                    <button class="btn btn-secondary btn-sm" onclick="actualizarCantidad('${nombre}',1)">+</button>
                </div>
                <button class="eliminar btn btn-danger btn-sm" onclick="eliminarArticulo('${nombre}')">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>`;
}

function cargarCarrito() {
    let contenedor = document.getElementById("contenedor");
    
    if (!contenedor) {
        console.error("Elemento contenedor no encontrado.");
        return;
    }

    let total = 0;
    let carritoHTML = "";


    for (let producto of carrito) {
        carritoHTML += montarProducto(producto.nombre, producto.precio, producto.existencias, producto.foto);
        total += producto.precio * producto.existencias;
    }

    let iva = total * 0.1736;
    let subtotal = total - iva;

    let totalHTML = `
        <div class="total-info">
            <p>Subtotal: ${subtotal.toFixed(2)} €</p>
            <p>IVA (21%): ${iva.toFixed(2)} €</p>
            <p><strong>Total: ${total.toFixed(2)} €</strong></p>
        </div>
    `;

    let botonesHTML = `
    <div class="botones">
        <button class="btn-sec btn-primary" onclick="tramitarPedido()">Comprar</button>
        <button class="btn-sec btn-secondary" onclick="vaciarCarrito()">Vaciar Carrito</button>
    </div>`;

    contenedor.innerHTML = carritoHTML + totalHTML + botonesHTML;
}


function tramitarPedido() {
    window.location.href = "login-router.jsp?next=tramitarPedido.jsp";
}

function mostrarPopup(mensaje = "Producto añadido al carrito") {
    let popupOverlay = document.getElementById("popup-overlay");
    let popupMessage = document.getElementById("popup-message");

    popupMessage.innerText = mensaje; 
    popupOverlay.classList.add("show");
}

function cerrarPopup() {
    let popupOverlay = document.getElementById("popup-overlay");
    popupOverlay.classList.remove("show");
}

function actualizarCantidad(nombre, cantidad) {
    let productoExistente = carrito.find(producto => producto.nombre === nombre);

    if (productoExistente) {
        productoExistente.existencias += cantidad;

        if (productoExistente.existencias <= 0) {
            eliminarArticulo(nombre);
        } else if (productoExistente.existencias === 69){
            window.location.href = "/resources/imagenes.html";
        } else {
            console.log(`Existencias de ${nombre} actualizadas. Nuevas existencias: ${productoExistente.existencias}`);
            guardarcarrito();
            cargarCarrito();
            console.log('Carrito actualizado:', carrito);
        }
    } else {
        console.log(`El producto ${nombre} no está en el carrito.`);
    }

    function prepararCarritoParaEnviar() {
        let carritoLocal = getCarrito();
        let carritoConvertido = carritoLocal.map((p, index) => ({
            codigo: index + 1, 
            nombre: p.nombre,
            precio: p.precio
        }));
    
        return carritoConvertido;
    }

    function enviarPedido() {
        let carritoParaEnviar = prepararCarritoParaEnviar();

        if (!carritoParaEnviar || carritoParaEnviar.length === 0) {
            alert("El carrito está vacío");
            return;
        }

        fetch('ProcesarPedidoServlet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                direccion: 'Calle Falsa 123',
                ciudad: 'Springfield',
                cp: '12345',
                pago: 'Tarjeta',
                comentarios: 'Entrega rápida',
                carrito: JSON.stringify(carritoParaEnviar),
                usuario: 'usuario1'  
            }),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Error: " + data.error);
            } else {
                console.log("Pedido procesado:", data);
                alert(`Gracias por tu compra, ${data.usuario}! Total: ${data.total}€`);
                vaciarCarrito();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error al procesar pedido");
        });
    }
}
