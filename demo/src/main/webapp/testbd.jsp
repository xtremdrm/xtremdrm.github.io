<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="demo.src.main.AccesoBD" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Página de comprobación</title>
</head>
<body>
<%
    AccesoBD con = AccesoBD.getInstance();
    boolean res = con.comprobarAcceso();
%>
    <h1>Resultado de conexión: <%= res ? "Éxito" : "Error" %></h1>
</body>
</html>
