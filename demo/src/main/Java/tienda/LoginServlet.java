package tienda;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;

public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String username = request.getParameter("username");
        String password = request.getParameter("password");

        AccesoBD accesoBD = AccesoBD.getInstance();
        Usuario usuario = accesoBD.obtenerUsuarioPorCredenciales(username, password);

        if (usuario != null && usuario.getActivo() == 1) {
            HttpSession session = request.getSession();
            session.setAttribute("usuario", usuario);
            response.sendRedirect("usuario.jsp");
        } else {
            request.setAttribute("error", "Nombre de usuario o contraseña incorrectos");
            RequestDispatcher rd = request.getRequestDispatcher("login.jsp");
            rd.forward(request, response);
        }
    }
}
