<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="tienda.Usuario" %>
<%
    Usuario usuario = (Usuario) session.getAttribute("usuario");
%>

<a href="index.jsp" class="logo-link">
    <img src="resources/mb.png" alt="Logo" class="logo-image">
</a>
<nav>
    <ul class="menu">
        <li><a href="info.html">¿Quiénes somos?</a></li>
        <li class="submenu">
            <a href="#">Nuestras Gamas</a>
            <ul class="dropdown">
                <li><a href="basic.jsp">Basic</a></li>
                <li><a href="mid.jsp">Mid</a></li>
                <li><a href="luxury.jsp">Luxury</a></li>
            </ul>
        </li>
        <li class="submenu">
            <a href="#">Nuestras Marcas</a>
            <ul class="dropdown">
                <li><a href="mercedes.jsp">Mercedes</a></li>
                <li><a href="audi.jsp">Audi</a></li>
                <li><a href="bmw.jsp">BMW</a></li>
            </ul>
        </li>
        <li><a href="contacto.html">Contacto</a></li>
    </ul>
    <div class="navright">
        <button class="cart" onclick="window.location.href='carrito.jsp'">
            <i class="bi bi-cart-dash"></i>
        </button>

        <% if (usuario != null) { %>
            <button class="login" onclick="window.location.href='usuario.jsp'">
                <i class="bi bi-person-fill-check"></i>
            </button>
        <% } else { %>
            <button class="login" onclick="window.location.href='login.jsp'">
                <i class="bi bi-person"></i>
            </button>
        <% } %>
    </div>
</nav>
