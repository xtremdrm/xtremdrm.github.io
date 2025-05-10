package tienda;

import tienda.Producto;
import java.sql.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.ArrayList;
import java.util.List;

public final class AccesoBD {

    private static AccesoBD instanciaUnica = null;
    private Connection conexionBD = null;

    private static final String JDBC_DRIVER = "org.mariadb.jdbc.Driver";
    private static final String DB_URL = "jdbc:mariadb://localhost:3306/daw";
    private static final String USER = "root";
    private static final String PASS = "root";

    private static final Logger logger = Logger.getLogger(AccesoBD.class.getName());

    public static AccesoBD getInstance() {
        if (instanciaUnica == null) {
            instanciaUnica = new AccesoBD();
        }
        return instanciaUnica;
    }

    private AccesoBD() {
        abrirConexionBD();
    }
    public void abrirConexionBD() {
    try {
        if (conexionBD == null || conexionBD.isClosed()) {
            Class.forName(JDBC_DRIVER);
            conexionBD = DriverManager.getConnection(DB_URL, USER, PASS);
            logger.info("Conexión establecida correctamente.");
        }
    } catch (ClassNotFoundException | SQLException e) {
        logger.log(Level.SEVERE, "No se ha podido conectar a la base de datos", e);
    }
}

    public void cerrarConexionBD() {
        if (conexionBD != null) {
            try {
                conexionBD.close();
                conexionBD = null;
                logger.info("Conexión cerrada correctamente.");
            } catch (SQLException e) {
                logger.log(Level.SEVERE, "Error al cerrar la conexión", e);
            }
        }
    }

    public boolean comprobarAcceso() {
        abrirConexionBD();
        try {
            return (conexionBD != null && !conexionBD.isClosed());
        } catch (SQLException e) {
            logger.log(Level.SEVERE, "Error al comprobar el estado de la conexión", e);
            return false;
        }
    }

    public Connection getConexionBD() {
        abrirConexionBD();
        return conexionBD;
    }

    public List<Producto> obtenerProductosBD() {
        abrirConexionBD();
        List<Producto> productos = new ArrayList<>();
        try {
            String query = "SELECT codigo, nombre, precio, existencias, imagen, categoria, kilometros FROM productos";
            PreparedStatement s = conexionBD.prepareStatement(query);
            ResultSet resultado = s.executeQuery();
            while (resultado.next()) {
                Producto producto = new Producto();
                producto.setCodigo(resultado.getInt("codigo"));
                producto.setNombre(resultado.getString("nombre"));
                producto.setPrecio(resultado.getFloat("precio"));
                producto.setExistencias(resultado.getInt("existencias"));
                producto.setImagen(resultado.getString("imagen"));
                producto.setCategoria(resultado.getString("categoria"));
                producto.setKilometros(resultado.getInt("kilometros"));
                productos.add(producto);
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error ejecutando la consulta de productos", e);
        }
        return productos;
    }

    public List<Producto> obtenerProductosBDCategoria(String categoria) {
        abrirConexionBD();
        List<Producto> productos = new ArrayList<>();
        try {
            String query = "SELECT * FROM productos WHERE categoria = ?";
            PreparedStatement s = conexionBD.prepareStatement(query);
            s.setString(1, categoria);
            ResultSet resultado = s.executeQuery();
            while (resultado.next()) {
                Producto producto = new Producto();
                producto.setCodigo(resultado.getInt("codigo"));
                producto.setNombre(resultado.getString("nombre"));
                producto.setPrecio(resultado.getFloat("precio"));
                producto.setExistencias(resultado.getInt("existencias"));
                producto.setImagen(resultado.getString("imagen"));
                producto.setCategoria(resultado.getString("categoria"));
                producto.setKilometros(resultado.getInt("kilometros"));
                productos.add(producto);
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error ejecutando consulta por categoría", e);
        }
        return productos;
    }

    public List<Producto> obtenerProductosBDMarca(String marca) {
        abrirConexionBD();
        List<Producto> productos = new ArrayList<>();
        try {
            String query = "SELECT * FROM productos WHERE marca = ?";
            PreparedStatement s = conexionBD.prepareStatement(query);
            s.setString(1, marca);
            ResultSet resultado = s.executeQuery();
            while (resultado.next()) {
                Producto producto = new Producto();
                producto.setCodigo(resultado.getInt("codigo"));
                producto.setNombre(resultado.getString("nombre"));
                producto.setPrecio(resultado.getFloat("precio"));
                producto.setExistencias(resultado.getInt("existencias"));
                producto.setImagen(resultado.getString("imagen"));
                producto.setCategoria(resultado.getString("categoria"));
                producto.setKilometros(resultado.getInt("kilometros"));
                producto.setMarca(resultado.getString("marca"));
                productos.add(producto);
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error ejecutando consulta por marca", e);
        }
        return productos;
    }

    public boolean registrarUsuario(Usuario usuario) {
        String query = "INSERT INTO usuarios (usuario, contrasenya, nombre, apellidos, email, domicilio, ciudad, telefono, activo, admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = getConexionBD();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, usuario.getUsuario());
            ps.setString(2, usuario.getContrasenya());
            ps.setString(3, usuario.getNombre());
            ps.setString(4, usuario.getApellidos());
            ps.setString(5, usuario.getEmail());
            ps.setString(6, usuario.getDomicilio());
            ps.setString(7, usuario.getCiudad());
            ps.setString(8, usuario.getTelefono());
            ps.setInt(9, usuario.getActivo());
            ps.setInt(10, usuario.getAdmin());
            int filas = ps.executeUpdate();
            return filas > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean comprobarUsuarioExistente(String usuario, String telefono, String email) {
    String query = "SELECT COUNT(*) FROM usuarios WHERE usuario = ? OR telefono = ? OR email = ?";
    try (Connection conn = getConexionBD(); 
         PreparedStatement ps = conn.prepareStatement(query)) {
        ps.setString(1, usuario);
        ps.setString(2, telefono);
        ps.setString(3, email);
        ResultSet rs = ps.executeQuery();
        if (rs.next() && rs.getInt(1) > 0) {
            return true;
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return false;
}


public boolean existeOtroUsuarioConEmailOTelefono(String email, String telefono, String usuarioActual) {
    String query = "SELECT COUNT(*) FROM usuarios WHERE (email = ? OR telefono = ?) AND usuario != ?";
    try (Connection conn = getConexionBD(); PreparedStatement ps = conn.prepareStatement(query)) {
        ps.setString(1, email);
        ps.setString(2, telefono);
        ps.setString(3, usuarioActual);
        ResultSet rs = ps.executeQuery();
        if (rs.next() && rs.getInt(1) > 0) {
            return true;
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return false;
}
public void actualizarUsuario(Usuario u) {
    String query = "UPDATE usuarios SET nombre = ?, apellidos = ?, email = ?, domicilio = ?, ciudad = ?, telefono = ? WHERE usuario = ?";
    try (Connection conn = getConexionBD(); PreparedStatement ps = conn.prepareStatement(query)) {
        ps.setString(1, u.getNombre());
        ps.setString(2, u.getApellidos());
        ps.setString(3, u.getEmail());
        ps.setString(4, u.getDomicilio());
        ps.setString(5, u.getCiudad());
        ps.setString(6, u.getTelefono());
        ps.setString(7, u.getUsuario());
        ps.executeUpdate();
    } catch (SQLException e) {
        e.printStackTrace();
    }
}
public boolean insertarPedido(Pedido pedido) {
    String sql = "INSERT INTO pedidos (persona, fecha, importe, estado) VALUES (?, ?, ?, ?)";
    try (Connection conn = getConexionBD();
         PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

        ps.setInt(1, pedido.getPersona()); 
        ps.setDate(2, new java.sql.Date(pedido.getFecha().getTime()));
        ps.setDouble(3, pedido.getImporte());
        ps.setString(4, pedido.getEstado());

        int filas = ps.executeUpdate();
        if (filas == 0) {
            return false;
        }
        try (ResultSet rs = ps.getGeneratedKeys()) {
            if (rs.next()) {
                pedido.setCodigo(rs.getInt(1)); 
                return true;
            }
        }
    } catch (SQLException e) {
        logger.log(Level.SEVERE, "Error al insertar pedido", e);
    }
    return false;
}

public boolean insertarLineasPedido(Pedido pedido) {
    String sql = "INSERT INTO linea_pedido (pedido_id, producto_id, cantidad) VALUES (?, ?, ?)";
    try (Connection conn = getConexionBD();
         PreparedStatement ps = conn.prepareStatement(sql)) {

        for (LineaPedido linea : pedido.getLineas()) {
            ps.setInt(1, pedido.getCodigo());  
            ps.setInt(2, linea.getProductoId());
            ps.setInt(3, linea.getCantidad());
            ps.addBatch();
        }
        ps.executeBatch();
        return true;
    } catch (SQLException e) {
        logger.log(Level.SEVERE, "Error al insertar líneas de pedido", e);
    }
    return false;
}


public Usuario obtenerUsuarioPorCredenciales(String usuario, String contrasenya) {
    String query = "SELECT * FROM usuarios WHERE usuario = ? AND contrasenya = ?";
    try (Connection conn = getConexionBD();
         PreparedStatement ps = conn.prepareStatement(query)) {
        ps.setString(1, usuario);
        ps.setString(2, contrasenya);
        try (ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                Usuario user = new Usuario();
                user.setCodigo(rs.getInt("codigo"));
                user.setUsuario(rs.getString("usuario"));
                user.setContrasenya(rs.getString("contrasenya"));
                user.setActivo(rs.getInt("activo"));
                user.setAdmin(rs.getInt("admin"));
                user.setNombre(rs.getString("nombre"));
                user.setApellidos(rs.getString("apellidos"));
                user.setEmail(rs.getString("email"));
                user.setDomicilio(rs.getString("domicilio"));
                user.setCiudad(rs.getString("ciudad"));
                user.setTelefono(rs.getString("telefono"));
                return user;
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return null;
}
public boolean actualizarStockProducto(int codigoProducto, int cantidadVendida) {
    String sql = "UPDATE productos SET existencias = existencias - ? WHERE codigo = ?";
    try (Connection conn = getConexionBD();
         PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setInt(1, cantidadVendida);
        ps.setInt(2, codigoProducto);
        int filas = ps.executeUpdate();
        return filas > 0;
    } catch (SQLException e) {
        logger.log(Level.SEVERE, "Error al actualizar stock", e);
    }
    return false;
}
public Producto obtenerProductoPorId(int codigo) {
    String query = "SELECT * FROM productos WHERE codigo = ?";
    try (Connection conn = getConexionBD();
         PreparedStatement ps = conn.prepareStatement(query)) {
        ps.setInt(1, codigo);
        try (ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                Producto producto = new Producto();
                producto.setCodigo(rs.getInt("codigo"));
                producto.setNombre(rs.getString("nombre"));
                producto.setPrecio(rs.getFloat("precio"));
                producto.setExistencias(rs.getInt("existencias"));
                producto.setImagen(rs.getString("imagen"));
                producto.setCategoria(rs.getString("categoria"));
                producto.setKilometros(rs.getInt("kilometros"));
                producto.setMarca(rs.getString("marca"));
                return producto;
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return null;
}
public List<Pedido> obtenerPedidosPorUsuario(int codigoUsuario) {
    List<Pedido> pedidos = new ArrayList<>();
    String query = "SELECT * FROM pedidos WHERE persona = ?"; 

    try (Connection conn = getConexionBD();
         PreparedStatement ps = conn.prepareStatement(query)) {

        ps.setInt(1, codigoUsuario);
        try (ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Pedido pedido = new Pedido();
                pedido.setCodigo(rs.getInt("codigo"));
                pedido.setPersona(rs.getInt("persona"));  
                pedido.setImporte(rs.getDouble("importe"));
                pedido.setFecha(rs.getDate("fecha"));
                pedido.setEstado(rs.getString("estado"));
                pedido.setDireccionEnvio(rs.getString("direccion_envio"));

                pedido.setLineas(obtenerLineasPedido(pedido.getCodigo()));

                pedidos.add(pedido);
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return pedidos;
}

private List<LineaPedido> obtenerLineasPedido(int pedidoCodigo) {
    List<LineaPedido> lineas = new ArrayList<>();
    String query = "SELECT * FROM linea_pedido WHERE pedido_id = ?";

    try (Connection conn = getConexionBD();
         PreparedStatement ps = conn.prepareStatement(query)) {

        ps.setInt(1, pedidoCodigo);
        try (ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                LineaPedido linea = new LineaPedido();
                linea.setCodigo(rs.getInt("codigo"));
                linea.setPedidoId(rs.getInt("pedido_id"));  
                linea.setProductoId(rs.getInt("producto_id")); 
                linea.setCantidad(rs.getInt("cantidad"));
                lineas.add(linea);
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return lineas;
}

public void eliminarPedidoPorId(int pedidoId) {
    String deleteLineasSQL = "DELETE FROM linea_pedido WHERE pedido_id = ?";
    String deletePedidoSQL = "DELETE FROM pedidos WHERE codigo = ?"; 

    try (Connection conn = getConexionBD();
         PreparedStatement stmtLineas = conn.prepareStatement(deleteLineasSQL);
         PreparedStatement stmtPedido = conn.prepareStatement(deletePedidoSQL)) {
        stmtLineas.setInt(1, pedidoId);
        stmtLineas.executeUpdate();
        stmtPedido.setInt(1, pedidoId);
        stmtPedido.executeUpdate();

    } catch (SQLException e) {
        logger.log(Level.SEVERE, "Error al eliminar pedido", e);
    }
}
public List<Producto> obtenerStockEliminado(int pedidoId) {
    List<Producto> productosEliminados = new ArrayList<>();
    String query = "SELECT p.codigo, p.nombre, lp.cantidad " +
                   "FROM productos p " +
                   "JOIN linea_pedido lp ON p.codigo = lp.producto_id " +
                   "WHERE lp.pedido_id = ?";
    try (Connection conn = getConexionBD(); 
         PreparedStatement ps = conn.prepareStatement(query)) {
        
        ps.setInt(1, pedidoId);
        try (ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Producto producto = new Producto();
                producto.setCodigo(rs.getInt("codigo"));
                producto.setNombre(rs.getString("nombre"));
                producto.setExistencias(rs.getInt("cantidad"));
                productosEliminados.add(producto);
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return productosEliminados;
}


}
