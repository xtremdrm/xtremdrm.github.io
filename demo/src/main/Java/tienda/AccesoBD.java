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
        if (conexionBD == null) {
            try {
                Class.forName(JDBC_DRIVER);
                conexionBD = DriverManager.getConnection(DB_URL, USER, PASS);
                logger.info("Conexión establecida correctamente.");
            } catch (ClassNotFoundException e) {
                logger.log(Level.SEVERE, "No se encuentra el driver JDBC", e);
            } catch (SQLException e) {
                logger.log(Level.SEVERE, "No se ha podido conectar a la base de datos", e);
            }
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
		while(resultado.next()){
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
	} catch(Exception e) {
		System.err.println("Error ejecutando la consulta a la base de datos");
		System.err.println(e.getMessage());
	}
	return productos;
}


public List<Producto> obtenerProductosBDFiltro(String categoria) {
	abrirConexionBD();
    List<Producto> productos = new ArrayList<>();
	try {
		String query = "SELECT codigo, nombre, precio, existencias, imagen, categoria, kilometros FROM productos WHERE categoria = ?;";
        PreparedStatement s = conexionBD.prepareStatement(query);
        s.setString(1, categoria);

		ResultSet resultado = s.executeQuery();
		while(resultado.next()){
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
	} catch(Exception e) {
		System.err.println("Error ejecutando la consulta a la base de datos");
		System.err.println(e.getMessage());
	}
	return productos;
}
}
