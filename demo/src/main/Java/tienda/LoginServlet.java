package tienda;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;

public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        try {
            String username = request.getParameter("username");
            String password = request.getParameter("password");

            AccesoBD accesoBD = AccesoBD.getInstance();
            Usuario usuario = accesoBD.obtenerUsuarioPorCredenciales(username, password);

            if (usuario != null && usuario.getActivo() == 1) {
                HttpSession session = request.getSession();
                session.setAttribute("usuario", usuario);

                // Redirección condicional si existe un destino guardado
                String next = (String) session.getAttribute("next");
                if (next != null && !next.isEmpty()) {
                    session.removeAttribute("next"); // Limpiar para evitar reuso accidental
                    response.sendRedirect(next);
                } else {
                    response.sendRedirect("usuario.jsp");
                }

            } else {
                // En login fallido usamos forward y mantenemos username
                request.setAttribute("loginError", "Nombre de usuario o contraseña incorrectos");
                request.setAttribute("lastUsername", username);
                request.getRequestDispatcher("login.jsp").forward(request, response);
            }

        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("error", "Error inesperado: " + e.getMessage());
            request.getRequestDispatcher("login.jsp").forward(request, response);
        }
    }
}
