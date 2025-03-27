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
    let producto = new Producto(nombre, precio, cantidad, foto);
    alert("Producto añadido al carrito");
    console.log('Carrito añadido');
    console.log(nombre, precio, cantidad, foto);
    carrito.push(producto);
    guardarcarrito();
    console.log(carrito);
}

function guardarcarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
function getCarrito(){
    return JSON.parse(localStorage.getItem("carrito"));
}
function eliminarArticulo() {
    carrito = getCarrito();
    carrito.filter(producto => producto.nombre !== nombre);
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
            <div class="col-md-3">
                <img src="${foto}" alt="${nombre}" style="width: 100%; max-width: 150px;">
            </div>

            <div class="col-md-4">
                <h3>${nombre}</h3>
                <p>Precio: ${precio} €</p>
            </div>

            <div class=" buttongrupo col-md-5 d-flex align-items-center">
                <div class="d-flex ms-3">
                    <button class="btn btn-secondary btn-sm" onclick="actualizarCantidad(-1)">-</button>
                    <input type="number" id="cantidad" class="form-control text-center" value="1" min="1" max="10"
                        onchange="actualizarTotal()">
                    <button class="btn btn-secondary btn-sm" onclick="actualizarCantidad(1)">+</button>
                </div>
                <button class="eliminar btn btn-danger btn-sm" onclick="eliminarArticulo()">
                    <i class="bi bi-trash"></i>
                </button>
            </div>



        </div> `;
}
function cargarCarrito() {
    let contenedor = document.getElementById("contenedor");
    let total = 0;
    for (let producto of carrito) {
        contenedor.innerHTML += montarProducto(producto.nombre, producto.precio, producto.cantidad, producto.foto);
        total += producto.precio * producto.cantidad;
    }
    document.getElementById("totalPrecio").innerText = total + " €";
}