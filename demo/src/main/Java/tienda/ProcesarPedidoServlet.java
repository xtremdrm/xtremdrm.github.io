package tienda;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import jakarta.json.*;

@WebServlet("/ProcesarPedidoServlet")
public class ProcesarPedidoServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        JsonReader jsonReader = Json.createReader(
                new InputStreamReader(
                        request.getInputStream(), "utf-8"));

        // Cambios mínimos para extraer dirección
        JsonValue rootValue = jsonReader.readValue();

        JsonArray jobj;
        String direccion = "";
        String ciudad = "";
        String cp = "";

        if (rootValue.getValueType() == JsonValue.ValueType.OBJECT) {
            JsonObject data = rootValue.asJsonObject();
            direccion = data.getString("direccion", "");
            ciudad = data.getString("ciudad", "");
            cp = data.getString("cp", "");
            jobj = data.getJsonArray("productos");
        } else {
            jobj = rootValue.asJsonArray(); // formato anterior, por compatibilidad
        }

        try {
            // Usuario logueado
            HttpSession sesion = request.getSession();
            Usuario usuario = (Usuario) sesion.getAttribute("usuario");
            if (usuario == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            // Conexión a BD
            AccesoBD accesoBD = AccesoBD.getInstance();
            Connection con = accesoBD.getConexionBD();

            // Insertar pedido (cabecera) - dirección concatenada como un solo string
            String direccionCompleta = direccion + ", " + ciudad + ", " + cp;
            String sqlPedido = "INSERT INTO pedidos (persona, fecha, importe, estado, direccion_envio) VALUES (?, CURRENT_DATE, 0, 'Pendiente', ?)";
            PreparedStatement psPedido = con.prepareStatement(sqlPedido, Statement.RETURN_GENERATED_KEYS);
            psPedido.setInt(1, usuario.getCodigo());
            psPedido.setString(2, direccionCompleta);  // Direccion concatenada
            psPedido.executeUpdate();

            ResultSet rs = psPedido.getGeneratedKeys();
            int codPedido = 0;
            if (rs.next()) {
                codPedido = rs.getInt(1);
            }

            // Insertar líneas del pedido
            String sqlLinea = "INSERT INTO linea_pedido (pedido_id, producto_id, cantidad) VALUES (?, ?, ?)";
            PreparedStatement psLinea = con.prepareStatement(sqlLinea);

            double total = 0.0;

            for (int i = 0; i < jobj.size(); i++) {
                JsonObject prod = jobj.getJsonObject(i); 
                String nomProd = prod.getString("nombre");
                
                String getCode = "SELECT codigo FROM productos WHERE nombre=?";
                PreparedStatement sub = con.prepareStatement(getCode);
                sub.setString(1, nomProd);
                ResultSet r = sub.executeQuery();
                
                r.next();
                int codProd = r.getInt("codigo");

                int cantidad = prod.getInt("existencias");
                float precio = Float.parseFloat(prod.get("precio").toString());

                psLinea.setInt(1, codPedido);
                psLinea.setInt(2, codProd);
                psLinea.setInt(3, cantidad);
                psLinea.addBatch();

                total += precio * cantidad;

                // Actualizar existencias
                String sqlStock = "UPDATE productos SET existencias = existencias - ? WHERE codigo = ?";
                PreparedStatement psStock = con.prepareStatement(sqlStock);
                psStock.setInt(1, cantidad);
                psStock.setInt(2, codProd);
                psStock.executeUpdate();
            }
            psLinea.executeBatch();

            // Actualizar importe total
            String sqlUpdate = "UPDATE pedidos SET importe = ? WHERE codigo = ?";
            PreparedStatement psUpdate = con.prepareStatement(sqlUpdate);
            psUpdate.setDouble(1, total);
            psUpdate.setInt(2, codPedido);
            psUpdate.executeUpdate();

            // Mensaje y redirección
            String new_pedido = " El pedido de ID: " + codPedido + " e importe total: " + total + " ha sido procesado correctamente";
            sesion.setAttribute("new_pedido", new_pedido);
            RequestDispatcher rd = request.getRequestDispatcher("/usuario.jsp");
            rd.forward(request, response);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            e.printStackTrace();
        }
    }
}
