package tienda;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;

public class ActualizarUsuarioServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession sesion = request.getSession();
        Usuario usuario = (Usuario) sesion.getAttribute("usuario");

        if (usuario == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        String nuevoEmail = request.getParameter("email");
        String nuevoTelefono = request.getParameter("telefono");

        AccesoBD bd = AccesoBD.getInstance();
        if (bd.existeOtroUsuarioConEmailOTelefono(nuevoEmail, nuevoTelefono, usuario.getUsuario())) {
            request.setAttribute("error", "El email o teléfono ya están en uso por otro usuario.");
            request.getRequestDispatcher("usuario.jsp").forward(request, response);
            return;
        }

        usuario.setNombre(request.getParameter("nombre"));
        usuario.setApellidos(request.getParameter("apellidos"));
        usuario.setEmail(nuevoEmail);
        usuario.setTelefono(nuevoTelefono);
        usuario.setDomicilio(request.getParameter("domicilio"));
        usuario.setCiudad(request.getParameter("ciudad"));

        bd.actualizarUsuario(usuario);

        sesion.setAttribute("usuario", usuario);
        response.sendRedirect("usuario.jsp");
    }
}
