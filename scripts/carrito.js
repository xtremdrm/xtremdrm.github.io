class Producto {
    constructor(nombre, precio, cantidad, foto) {
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.foto = foto;
    }
}

let carrito = [];

function anadirCarrito(nombre, precio, cantidad, foto) {
    let productoExistente = carrito.find(producto => producto.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad += cantidad;
        console.log(`Cantidad actualizada para ${nombre}. Nueva cantidad: ${productoExistente.cantidad}`);
    } else {
        let producto = new Producto(nombre, precio, cantidad, foto);
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
    let carrito = getCarrito();
    console.log("Carrito antes de eliminar:", carrito); // Ver qué productos hay antes

    carrito = carrito.filter(producto => producto.nombre !== nombre);

    console.log("Carrito después de eliminar:", carrito); // Ver si el producto se filtró correctamente

    localStorage.setItem("carrito", JSON.stringify(carrito));
    location.reload();
}



function setCantidad(producto) {
    alert("Cantidad modificada.");
    producto.cantidad = cantidad;
    guardarcarrito

}
function vaciarCarrito() {
    carrito = [];
    guardarcarrito();
    localStorage.removeItem("carrito");
    location.reload();
}
document.addEventListener("DOMContentLoaded", function () {
    let carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    cargarCarrito();
    console.log(carrito);
});

function montarProducto(nombre,precio,cantidad,foto){

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
                    <input type="number" id="cantidad" class="form-control text-center" value="${cantidad}" min="1" max="10"
                        onchange="actualizarTotal()">
                    <button class="btn btn-secondary btn-sm" onclick="actualizarCantidad('${nombre}',1)">+</button>
                </div>
                <button class="eliminar btn btn-danger btn-sm" onclick="eliminarArticulo('${nombre}')">
                    <i class="bi bi-trash"></i>
                </button>
            </div>



        </div> `;
}
function cargarCarrito() {
    let contenedor = document.getElementById("contenedor");
    let total = 0;
    let carritoHTML = ""; // Almacenamos los productos en una variable

    for (let producto of carrito) {
        carritoHTML += montarProducto(producto.nombre, producto.precio, producto.cantidad, producto.foto);
        total += producto.precio * producto.cantidad;
    }

    // Calcular el IVA (suponiendo que el 21% ya está incluido en el precio)
    let iva = total * 0.1736; // (21 / 121) para desglosar el IVA de un precio que ya lo incluye
    let subtotal = total - iva;

    // Crear el total antes de los botones
    let totalHTML = `
        <div class="total-info">
            <p>Subtotal: ${subtotal.toFixed(2)} €</p>
            <p>IVA (21%): ${iva.toFixed(2)} €</p>
            <p><strong>Total: ${total.toFixed(2)} €</strong></p>
        </div>
    `;

    // Crear los botones
    let botonesHTML = `
        <div class="botones">
            <button class="btn-sec btn-primary">Comprar</button>
            <button class="btn-sec btn-secondary" onclick="vaciarCarrito()">Vaciar Carrito</button>
        </div>
    `;

    // Insertamos los productos en el contenedor
    contenedor.innerHTML = carritoHTML + totalHTML + botonesHTML;
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
        productoExistente.cantidad += cantidad;
        
        if (productoExistente.cantidad <= 0) {
            eliminarArticulo(nombre);
        } else {
            console.log(`Cantidad de ${nombre} actualizada. Nueva cantidad: ${productoExistente.cantidad}`);
            guardarcarrito();
            location.reload();
            cargarCarrito();
            console.log('Carrito actualizado:', carrito);
        }
    } else {
        console.log(`El producto ${nombre} no está en el carrito.`);
    }
}
