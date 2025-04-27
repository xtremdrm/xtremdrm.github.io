CREATE DATABASE daw
    DEFAULT CHARACTER SET = 'utf8mb4';

use daw;
CREATE TABLE productos (
    codigo INTEGER NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255) DEFAULT NULL,
    precio DECIMAL(10,2) DEFAULT 0,
    existencias INTEGER DEFAULT 0,
    imagen VARCHAR(255) DEFAULT NULL,
    kilometros INTEGER DEFAULT 0,
    marca INTEGER DEFAULT NULL,
    categoria INTEGER DEFAULT NULL,
    
    PRIMARY KEY (codigo),
    FOREIGN KEY (marca) REFERENCES marca(codigo),
    FOREIGN KEY (categoria) REFERENCES categoria(codigo)
);


CREATE TABLE usuarios(
    codigo INTEGER NOT NULL AUTO_INCREMENT,
    usuario VARCHAR(32) NOT NULL UNIQUE,
    contrasenya VARCHAR(40) DEFAULT '',
    activo INTEGER DEFAULT 1,
    admin INTEGER DEFAULT 0,
    nombre VARCHAR(64) DEFAULT NULL,
    apellidos VARCHAR(128) DEFAULT NULL,
    domicilio VARCHAR(128) DEFAULT NULL,
    ciudad VARCHAR(64) DEFAULT NULL,
    telefono CHAR(9) DEFAULT NULL,
    email VARCHAR(64) DEFAULT NULL,
    PRIMARY KEY(codigo));

CREATE TABLE estados(
    codigo INTEGER NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR(16) DEFAULT NULL,
    PRIMARY KEY(codigo));

CREATE TABLE marca(
    codigo INTEGER NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(16) DEFAULT NULL,
    PRIMARY KEY(codigo));

CREATE TABLE categoria(
    codigo INTEGER NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR(16) DEFAULT NULL,
    PRIMARY KEY(codigo));

CREATE TABLE pedidos(
    codigo INTEGER NOT NULL AUTO_INCREMENT,
    persona INTEGER NOT NULL,
    fecha DATE DEFAULT(CURRENT_DATE),
    importe DECIMAL(10,2) DEFAULT 0,
    estado INTEGER NOT NULL,
    codigo_producto INTEGER NOT NULL,
    cantidad INTEGER DEFAULT 1,
    PRIMARY KEY(codigo),
    FOREIGN KEY pedidopor(persona) REFERENCES usuarios(codigo),
    FOREIGN KEY enestado(estado) REFERENCES estados(codigo));
    FOREIGN KEY pedidoproducto(codigo_producto) REFERENCES productos(codigo);

INSERT INTO marca(nombre) VALUES 
('Mercedes'), ('BMW'), ('Audi');

INSERT INTO categoria(descripcion) VALUES 
('Luxury'), ('Mid'), ('Basic');

INSERT INTO productos (nombre, precio, existencias, imagen, kilometros, marca, categoria) VALUES
('Mercedes S-Class', 110000, 1, 'resources/s-class.png', 1000, 'Mercedes', 'Luxury'), -- Mercedes - Luxury
('BMW M4', 108000, 1, 'resources/m4.png', 800, 'BMW', 'Luxury'), -- BMW - Luxury
('BMW X5', 90000, 1, 'resources/x5.png', 1100, 'BMW', 'Luxury'), -- BMW - Luxury
('Audi RS6', 80000, 1, 'resources/rs6.avif', 1400, 'Audi', 'Luxury'), -- Audi - Luxury
('Audi Q7', 85000, 1, 'resources/q7.avif', 3125, 'Audi', 'Mid'), -- Audi - Mid
('Mercedes GLC', 70000, 1, 'resources/glc.png', 2500, 'Mercedes', 'Mid'), -- Mercedes - Mid
('BMW Series 5', 60000, 1, 'resources/5-series.png', 2345, 'BMW', 'Mid'), -- BMW - Mid
('BMW Series 3', 50000, 1, 'resources/3-series.png', 1800, 'BMW', 'Mid'), -- BMW - Mid
('Mercedes E-Class', 75000, 1, 'resources/e-class.png', 1780, 'Mercedes', 'Mid'), -- Mercedes - Mid
('Audi Q2', 40000, 1, 'resources/q2.png', 1200, 'Audi', 'Basic'), -- Audi - Basic
('Mercedes A-Class', 35000, 1, 'resources/a-class.png', 2200, 'Mercedes', 'Basic'), -- Mercedes - Basic
('Audi A3', 30000, 1, 'resources/a3.avif', 3000, 'Audi', 'Basic'); -- Audi - Basic


SELECT * FROM productos;

