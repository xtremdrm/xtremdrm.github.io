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
                <li><a href="#">¿Quiénes somos?</a></li>
                <li class="submenu">
                    <a href="#">Nuestras Gamas</a>
                    <ul class="dropdown">
                        <li><a href="#">Basic</a></li>
                        <li><a href="#">Mid</a></li>
                        <li><a href="#">Luxury</a></li>
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
    
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasExampleLabel">Menú</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <ul class="menu">
                <li><a href="#">¿Quiénes somos?</a></li>
                <li class="submenu">
                    <a href="#">Nuestras Gamas</a>
                    <ul class="dropdown">
                        <li><a href="#">Basic</a></li>
                        <li><a href="#">Mid</a></li>
                        <li><a href="#">Luxury</a></li>
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
        </div>
    </div>
            <div class="navright">
                <button class="cart" onclick="window.location.href='carrito.html'">
                <i class="bi bi-cart-dash"></i>
                </button>
                <button class="login" onclick="window.location.href='login.html'">
                <i class="bi bi-person"></i>
                </button>
            </div> 
        </nav>
        `;
    }
}
window.customElements.define('mi-cabecera', Cabecera);


