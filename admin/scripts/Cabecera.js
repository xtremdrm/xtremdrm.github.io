class Cabecera extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
                            <a href="/" class="d-block p-3 link-dark text-decoration-none" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
                        <img src="resources/mb.png" height="150px" width="150px">
                    </a>
                    <ul class="nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mb-auto mx-auto text-center align-items-center">
                        <li class="nav-item">
                            <a href="index.html" class="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Home">
                                <i class="bi-house fs-1"></i>
                            </a>
                        </li>
                        <li>
                            <a href="productos.html" class="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Dashboard">
                                <i class="bi bi-bag fs-1"></i>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="pedidos.html" class="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="box">
                                <i class="bi bi-box-seam fs-1"></i>
                            </a>
                        </li>
                        <li>
                            <a href="usuarios.html" class="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Orders">
                                <i class="bi bi-person-circle fs-1"></i>
                            </a>
                        </li>
                        <li>
                            <a href="/login.html" class="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Customers">
                                <i class="bi bi-x-circle fs-1"></i>
                            </a>
                        </li>
                    </ul>
        `;
    }
}

window.customElements.define('mi-cabecera', Cabecera);


