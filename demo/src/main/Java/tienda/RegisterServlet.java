package tienda;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;

public class RegisterServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String usuario = request.getParameter("username");
        String contrasenya = request.getParameter("password");
        String nombre = request.getParameter("name");
        String apellidos = request.getParameter("surname");
        String email = request.getParameter("email");
        String domicilio = request.getParameter("domicilio");
        String ciudad = request.getParameter("ciudad");
        String telefono = request.getParameter("telefono");

        // Acceso a la base de datos
        AccesoBD accesoBD = AccesoBD.getInstance();

        // Comprobamos si ya existe un usuario con el mismo nombre, teléfono o email
        if (accesoBD.comprobarUsuarioExistente(usuario, telefono, email)) {
            // Enviar el mensaje de error al JSP
            request.setAttribute("errorMessage", "El nombre de usuario, correo electrónico o teléfono ya están en uso.");
            request.getRequestDispatcher("registerpage.jsp").forward(request, response);
            return;
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setUsuario(usuario);
        nuevoUsuario.setContrasenya(contrasenya);
        nuevoUsuario.setNombre(nombre);
        nuevoUsuario.setApellidos(apellidos);
        nuevoUsuario.setEmail(email);
        nuevoUsuario.setDomicilio(domicilio);
        nuevoUsuario.setCiudad(ciudad);
        nuevoUsuario.setTelefono(telefono);
        nuevoUsuario.setActivo(1);
        nuevoUsuario.setAdmin(0);

        boolean registrado = accesoBD.registrarUsuario(nuevoUsuario);

        if (registrado) {
            response.sendRedirect("login.jsp");
        } else {
            // Si ocurre un error al registrar, reenviar con el mensaje de error
            request.setAttribute("errorMessage", "Hubo un error al registrar el usuario.");
            request.getRequestDispatcher("register.jsp").forward(request, response);
        }
    }
}
