class Cabecera extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <a href="index.html" class="logo-link">
            <img src="resources/mb.png" alt="Logo" class="logo-image">
        </a>
        <nav>
            <div class="navleft"></div>
            <ul class="menu">
                <li><a href="info.html">¿Quiénes somos?</a></li>
                <li class="submenu">
                    <a href="">Nuestras Gamas</a>
                    <ul class="dropdown">
                        <li><a href="basic.html">Basic</a></li>
                        <li><a href="mid.html">Mid</a></li>
                        <li><a href="luxury.html">Luxury</a></li>
                    </ul>
                </li>
                <li class="submenu">
                    <a href="#">Nuestras Marcas</a>
                    <ul class="dropdown">
                        <li><a href="mercedes.html">Mercedes</a></li>
                        <li><a href="audi.html">Audi</a></li>
                        <li><a href="bmw.html">BMW</a></li>
                    </ul>
                </li>
                <li><a href="contacto.html">Contacto</a></li>
            </ul> 
                <button class="menu-toggle" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
        ☰
    </button>
            <div class="navright">
                <button class="cart" onclick="window.location.href='carrito.html'">
                <i class="bi bi-cart-dash"></i>
                </button>
                <button class="login" onclick="window.location.href='login.html'">
                <i class="bi bi-person"></i>
                </button>
            </div> 
        </nav>
            <div class="offcanvas offcanvas-start bg-dark" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasExampleLabel">Menú</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
    <div class="accordion" id="offcanvasMenu">
        <ul class="nav flex-column">
            <li class="nav-item">
                <a class="nav-link" href="info.html">¿Quiénes somos?</a>
            </li>
            
            <li class="nav-item">
                <a class="nav-link" data-bs-toggle="collapse" href="#gamasCollapse" role="button" aria-expanded="false" aria-controls="gamasCollapse">
                    Nuestras Gamas
                </a>
                <div class="collapse" id="gamasCollapse" data-bs-parent="#offcanvasMenu">
                    <ul class="list-group">
                        <li class="list-group-item"><a href="basic.html">Basic</a></li>
                        <li class="list-group-item"><a href="mid.html">Mid</a></li>
                        <li class="list-group-item"><a href="luxury.html">Luxury</a></li>
                    </ul>
                </div>
            </li>

            <li class="nav-item">
                <a class="nav-link" data-bs-toggle="collapse" href="#marcasCollapse" role="button" aria-expanded="false" aria-controls="marcasCollapse">
                    Nuestras Marcas
                </a>
                <div class="collapse" id="marcasCollapse" data-bs-parent="#offcanvasMenu">
                    <ul class="list-group">
                        <li class="list-group-item"><a href="mercedes.html">Mercedes</a></li>
                        <li class="list-group-item"><a href="audi.html">Audi</a></li>
                        <li class="list-group-item"><a href="bmw.html">BMW</a></li>
                    </ul>
                </div>
            </li>

            <li class="nav-item">
                <a class="nav-link" href="contacto.html">Contacto</a>
            </li>
        </ul>
    </div>
</div>


        `;
    }
}
document.addEventListener("DOMContentLoaded", function () {
    var offcanvasElement = document.getElementById("offcanvasExample");
    if (offcanvasElement) {
        var offcanvasInstance = new bootstrap.Offcanvas(offcanvasElement);
    }
});

window.customElements.define('mi-cabecera', Cabecera);


