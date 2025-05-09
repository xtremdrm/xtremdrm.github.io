package tienda;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/EliminarPedido")
public class EliminarPedido extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String idParam = request.getParameter("idPedido");

        if (idParam != null) {
            try {
                int pedidoId = Integer.parseInt(idParam);
                AccesoBD bd = AccesoBD.getInstance();
                List<Producto> productosEliminados = bd.obtenerStockEliminado(pedidoId);
                

                bd.eliminarPedidoPorId(pedidoId);
                for (Producto producto : productosEliminados) {

                    bd.actualizarStockProducto(producto.getCodigo(), -producto.getExistencias());
                }

            } catch (NumberFormatException e) {
                e.printStackTrace(); 
            }
        }
        response.sendRedirect("pedidos.jsp");
    }
}
