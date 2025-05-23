-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         11.8.1-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para daw
CREATE DATABASE IF NOT EXISTS `daw` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `daw`;

-- Volcando estructura para tabla daw.linea_pedido
CREATE TABLE IF NOT EXISTS `linea_pedido` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `pedido_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) DEFAULT 1,
  PRIMARY KEY (`codigo`),
  KEY `pedido_idx` (`pedido_id`),
  KEY `producto_idx` (`producto_id`),
  CONSTRAINT `fk_pedido` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`codigo`) ON DELETE CASCADE,
  CONSTRAINT `fk_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla daw.linea_pedido: ~2 rows (aproximadamente)
INSERT INTO `linea_pedido` (`codigo`, `pedido_id`, `producto_id`, `cantidad`) VALUES
	(10, 8, 2, 1),
	(11, 8, 4, 1);

-- Volcando estructura para tabla daw.pedidos
CREATE TABLE IF NOT EXISTS `pedidos` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `persona` int(11) NOT NULL,
  `fecha` date DEFAULT curdate(),
  `importe` decimal(10,2) DEFAULT 0.00,
  `estado` varchar(20) DEFAULT NULL,
  `direccion_envio` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`codigo`),
  KEY `pedidopor` (`persona`),
  CONSTRAINT `pedidopor` FOREIGN KEY (`persona`) REFERENCES `usuarios` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla daw.pedidos: ~1 rows (aproximadamente)
INSERT INTO `pedidos` (`codigo`, `persona`, `fecha`, `importe`, `estado`, `direccion_envio`) VALUES
	(8, 2, '2025-05-09', 188000.00, 'Pendiente', 'Calle Ave del paraiso 7, Mirador de Montepinar, 46980');

-- Volcando estructura para tabla daw.productos
CREATE TABLE IF NOT EXISTS `productos` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT 0.00,
  `existencias` int(11) DEFAULT 0,
  `imagen` varchar(255) DEFAULT NULL,
  `kilometros` int(11) DEFAULT 0,
  `marca` varchar(30) DEFAULT NULL,
  `categoria` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla daw.productos: ~12 rows (aproximadamente)
INSERT INTO `productos` (`codigo`, `nombre`, `precio`, `existencias`, `imagen`, `kilometros`, `marca`, `categoria`) VALUES
	(1, 'Mercedes S-Class', 110000.00, 2, 'resources/s-class.png', 1000, 'Mercedes', 'Luxury'),
	(2, 'BMW M4', 108000.00, 194, 'resources/m4.png', 800, 'BMW', 'Luxury'),
	(3, 'BMW X5', 90000.00, 197, 'resources/x5.png', 1100, 'BMW', 'Luxury'),
	(4, 'Audi RS6', 80000.00, 197, 'resources/rs6.avif', 1400, 'Audi', 'Luxury'),
	(5, 'Audi Q7', 85000.00, 200, 'resources/q7.avif', 3125, 'Audi', 'Mid'),
	(6, 'Mercedes GLC', 70000.00, 200, 'resources/glc.png', 2500, 'Mercedes', 'Mid'),
	(7, 'BMW Series 5', 60000.00, 200, 'resources/5-series.png', 2345, 'BMW', 'Mid'),
	(8, 'BMW Series 3', 50000.00, 200, 'resources/3-series.png', 1800, 'BMW', 'Mid'),
	(9, 'Mercedes E-Class', 75000.00, 200, 'resources/e-class.png', 1780, 'Mercedes', 'Mid'),
	(10, 'Audi Q2', 40000.00, 199, 'resources/q2.png', 1200, 'Audi', 'Basic'),
	(11, 'Mercedes A-Class', 35000.00, 199, 'resources/a-class.png', 2200, 'Mercedes', 'Basic'),
	(12, 'Audi A3', 30000.00, 200, 'resources/a3.avif', 3000, 'Audi', 'Basic');

-- Volcando estructura para tabla daw.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `contrasenya` varchar(100) NOT NULL,
  `activo` int(11) DEFAULT 1,
  `admin` int(11) DEFAULT 0,
  `nombre` varchar(100) DEFAULT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `domicilio` varchar(200) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`codigo`),
  UNIQUE KEY `usuario` (`usuario`),
  UNIQUE KEY `unique_telefono` (`telefono`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla daw.usuarios: ~3 rows (aproximadamente)
INSERT INTO `usuarios` (`codigo`, `usuario`, `contrasenya`, `activo`, `admin`, `nombre`, `apellidos`, `domicilio`, `ciudad`, `telefono`, `email`) VALUES
	(1, 'xtremdrm', '12345', 1, 0, 'David', 'Rubio Martin', 'calle pepino 13', 'Levante', '653625446', 'rubiodavidrubio@hotmail.com'),
	(2, 'Jamongus', '12345', 1, 0, 'Manuel', 'Jamongus', '13 Rue del Percebe', 'Real Sociedad', '697522117', 'jamongus@jamongus.com'),
	(6, 'Xx_El_m0riTO_xX', '12345', 1, 0, 'Carlos', 'Macian Gomez', '13 Rue del Percebe', 'Osasuna', '663255897', 'mariconchi@outlook.es');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
