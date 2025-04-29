package tienda;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
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

        AccesoBD accesoBD = AccesoBD.getInstance();

        boolean registrado = accesoBD.registrarUsuario(nuevoUsuario);

        if (registrado) {
            response.sendRedirect("login.jsp");
        } else {
            response.sendRedirect("register.jsp?error=true");
        }
    }
}
