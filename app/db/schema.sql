CREATE TABLE proveedor (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    direccion TEXT,
    telefono VARCHAR(50),
    dias_pago INT,
    estado INT DEFAULT 1
);

CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    dni VARCHAR(20) UNIQUE,
    direccion TEXT,
    tipo_cliente CHAR(1),
    limite_credito DECIMAL(12, 2),
    debe DECIMAL(12, 2) DEFAULT 0
);

CREATE TABLE empleado (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    dni VARCHAR(20) UNIQUE,
    genero CHAR(1),
    edad INT,
    estado_civil CHAR(1),
    fecha_inicio INT, -- Lo pusimos como INT para que coincida con tu parseInt()
    estado INT DEFAULT 1
);

CREATE TABLE producto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    descripcion TEXT,
    categoria VARCHAR(100),
    precio_compra DECIMAL(12, 2),
    precio_venta DECIMAL(12, 2),
    stock INT DEFAULT 0,
    unidad VARCHAR(50),
    estado INT DEFAULT 1
);

-- 2. Tablas con Relaciones
CREATE TABLE pedido (
    id SERIAL PRIMARY KEY,
    id_proveedor INT REFERENCES proveedor(id),
    fecha DATE DEFAULT CURRENT_DATE,
    total DECIMAL(12, 2),
    estado INT DEFAULT 1
);

CREATE TABLE factura (
    id SERIAL PRIMARY KEY,
    id_cliente INT REFERENCES cliente(id),
    id_empleado INT REFERENCES empleado(id),
    fecha DATE DEFAULT CURRENT_DATE,
    subtotal DECIMAL(12, 2),
    impuesto DECIMAL(12, 2),
    total DECIMAL(12, 2),
    estado INT DEFAULT 1
);

-- 3. Tablas de Detalle
CREATE TABLE detalle_pedido (
    id_pedido INT REFERENCES pedido(id) ON DELETE CASCADE,
    id_producto INT REFERENCES producto(id),
    cantidad INT,
    precio_unitario DECIMAL(12, 2),
    PRIMARY KEY (id_pedido, id_producto)
);

CREATE TABLE detalle_factura (
    id_factura INT REFERENCES factura(id) ON DELETE CASCADE,
    id_producto INT REFERENCES producto(id),
    cantidad INT,
    precio_unitario DECIMAL(12, 2),
    PRIMARY KEY (id_factura, id_producto)
);
