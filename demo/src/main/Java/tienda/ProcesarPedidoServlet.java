package tienda;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.*;
import com.google.gson.Gson;

@WebServlet("/ProcesarPedidoServlet")
public class ProcesarPedidoServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();
        Gson gson = new Gson();

        try {
            // Leer el JSON del cuerpo de la solicitud
            BufferedReader reader = request.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            String body = sb.toString();
            Map<String, Object> requestData = gson.fromJson(body, Map.class);

            // Extraer carrito de la solicitud
            List<Map<String, Object>> carrito = (List<Map<String, Object>>) requestData.get("carrito");

            if (carrito == null || carrito.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(Map.of("error", "Carrito vacío o no enviado")));
                return;
            }

            // Usuario logueado
            HttpSession sesion = request.getSession();
            Usuario usuario = (Usuario) sesion.getAttribute("usuario");
            if (usuario == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                out.print(gson.toJson(Map.of("error", "Usuario no autenticado")));
                return;
            }

            // Crear instancia de AccesoBD y obtener la conexión
            AccesoBD accesoBD = AccesoBD.getInstance();
            Connection con = accesoBD.getConexionBD(); // Llamada a la instancia para obtener la conexión

            // 1) Insertar pedido (cabecera)
            String sqlPedido = "INSERT INTO pedidos (persona, fecha, importe, estado) VALUES (?, CURRENT_DATE, 0, 'Pendiente')";
            PreparedStatement psPedido = con.prepareStatement(sqlPedido, Statement.RETURN_GENERATED_KEYS);
            psPedido.setInt(1, usuario.getCodigo());
            psPedido.executeUpdate();

            ResultSet rs = psPedido.getGeneratedKeys();
            int codPedido = 0;
            if (rs.next()) {
                codPedido = rs.getInt(1);
            }

            // 2) Insertar líneas en linea_pedido
            String sqlLinea = "INSERT INTO linea_pedido (pedido_id, producto_id, cantidad) VALUES (?, ?, ?)";
            PreparedStatement psLinea = con.prepareStatement(sqlLinea);

            double total = 0.0;

            for (Map<String, Object> prod : carrito) {
                int codProd = ((Double) prod.get("codigo")).intValue();  // Gson devuelve Double
                int cantidad = ((Double) prod.get("cantidad")).intValue();
                double precio = (Double) prod.get("precio");

                psLinea.setInt(1, codPedido);
                psLinea.setInt(2, codProd);
                psLinea.setInt(3, cantidad);
                psLinea.addBatch();

                total += precio * cantidad;

                // Actualizar existencias en productos (stock - cantidad)
                String sqlStock = "UPDATE productos SET existencias = existencias - ? WHERE codigo = ?";
                PreparedStatement psStock = con.prepareStatement(sqlStock);
                psStock.setInt(1, cantidad);
                psStock.setInt(2, codProd);
                psStock.executeUpdate();
            }
            psLinea.executeBatch();

            // 3) Actualizar importe total en pedidos
            String sqlUpdate = "UPDATE pedidos SET importe = ? WHERE codigo = ?";
            PreparedStatement psUpdate = con.prepareStatement(sqlUpdate);
            psUpdate.setDouble(1, total);
            psUpdate.setInt(2, codPedido);
            psUpdate.executeUpdate();

            // 4) Devolver recibo
            Map<String, Object> recibo = new LinkedHashMap<>();
            recibo.put("codPedido", codPedido);
            recibo.put("total", total);
            recibo.put("productos", carrito);

            out.print(gson.toJson(recibo));

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(Map.of("error", "Error inesperado: " + e.getMessage())));
            e.printStackTrace();
        }
    }
}
