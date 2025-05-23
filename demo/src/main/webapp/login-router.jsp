<%@ page import="tienda.Usuario" %>
<%
    Usuario usuario = (Usuario) session.getAttribute("usuario");
    String next = request.getParameter("next");

    if (usuario != null) {
        if (next != null && !next.isEmpty()) {
            response.sendRedirect(next);
        } else {
            response.sendRedirect("usuario.jsp");
        }
    } else {
        if (next != null && !next.isEmpty()) {
            session.setAttribute("next", next);
        }
        response.sendRedirect("login.jsp");
    }
%>