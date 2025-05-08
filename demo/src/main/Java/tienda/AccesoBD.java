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
            return true; // Ya existe un usuario con ese nombre, teléfono o correo
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

}
