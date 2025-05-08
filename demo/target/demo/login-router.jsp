<%@ page import="tienda.Usuario" %>
<%
    Usuario usuario = (Usuario) session.getAttribute("usuario");
    if (usuario != null) {
        response.sendRedirect("usuario.jsp");
    } else {
        response.sendRedirect("login.jsp");
    }
%>
