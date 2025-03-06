class Footer extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <footer style="
    margin-top: 100px; 
    width: 100%; 
    display: flex; 
    flex-direction: row; 
    align-items: center; 
    justify-content: left;
    bottom: 0;
    background-color: rgb(59, 59, 59); 
    border-top: 3px solid white; 
">
    <img src="resources/mb.png" width="100px" height="100px" style="margin-right: 15px;">
    <p style="
        font-size: 14px; 
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        color: white;
        text-align: center;
    ">
        <strong>MB MOTORS | Tu concesionario de confianza</strong> <br> 
        © 2025 MB MOTORS. Todos los derechos reservados.
    </p>
    <style>
    @media (max-width: 768px) {
        footer {
            justify-content: center ;
            flex-direction: column !important;
            text-align: center !important;
            margin-top: 250px !important;
        }
        footer img {
            width:80px;
            height: 80px;
        }
    }
</style>
</footer>

        `;
    }
}
window.customElements.define('mi-footer', Footer);


