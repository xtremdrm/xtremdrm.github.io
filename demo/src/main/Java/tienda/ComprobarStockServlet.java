package tienda;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.json.*;

import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import java.sql.SQLException;
@WebServlet("/ComprobarStockServlet")
public class ComprobarStockServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");

        try (JsonReader jsonReader = Json.createReader(new InputStreamReader(request.getInputStream(), "utf-8"))) {
            JsonObject data = jsonReader.readObject();
            JsonArray productos = data.getJsonArray("productos");

            JsonArrayBuilder errores = Json.createArrayBuilder();

            AccesoBD accesoBD = AccesoBD.getInstance();
            Connection con = accesoBD.getConexionBD();
            String consulta = "SELECT existencias FROM productos WHERE nombre = ?";

            for (JsonObject prod : productos.getValuesAs(JsonObject.class)) {
                String nombre = prod.getString("nombre");
                int cantidadSolicitada = prod.getInt("existencias");

                try (PreparedStatement ps = con.prepareStatement(consulta)) {
                    ps.setString(1, nombre);
                    try (ResultSet rs = ps.executeQuery()) {
                        if (rs.next()) {
                            int existenciasBD = rs.getInt("existencias");
                            if (cantidadSolicitada > existenciasBD) {
                                errores.add(Json.createObjectBuilder()
                                    .add("producto", nombre)
                                    .add("stock", existenciasBD)
                                    .add("solicitado", cantidadSolicitada));
                            }
                        } else {
                            errores.add(Json.createObjectBuilder()
                                .add("producto", nombre)
                                .add("error", "Producto no encontrado"));
                        }
                    }
                }
            }

            JsonObject respuesta = Json.createObjectBuilder()
                .add("ok", errores.build().isEmpty())
                .add("errores", errores)
                .build();

            response.getWriter().write(respuesta.toString());

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JsonObject error = Json.createObjectBuilder()
                .add("ok", false)
                .add("error", "Error en el servidor al comprobar stock")
                .build();
            response.getWriter().write(error.toString());
        }
    }
}
