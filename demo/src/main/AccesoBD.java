package demo.src.main;

import java.sql.*;
import java.util.logging.Level;
import java.util.logging.Logger;

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
}
