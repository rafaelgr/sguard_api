// rondas_db_mysql
// Manejo de la tabla rondas en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS

//  leer la configurción de MySQL
var config = require("../../configMySQL.json");
var sql = "";

// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection() {
    var connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    });
    connection.connect(function(err) {
        if (err) throw err;
    });
    return connection;
}

// closeConnection
// función auxiliar para cerrar una conexión
function closeConnection(connection) {
    connection.end(function(err) {
        if (err) {
            throw err;
        }
    });
}

function closeConnectionCallback(connection, callback) {
    connection.end(function(err) {
        if (err) callback(err);
    });
}

// comprobarRonda
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarRonda(ronda) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof ronda;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && ronda.hasOwnProperty("rondaId"));
    comprobado = (comprobado && ronda.hasOwnProperty("nombre"));
    return comprobado;
}


// comprobarPuntoRonda
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarPuntoRonda(puntoRonda) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof puntoRonda;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && puntoRonda.hasOwnProperty("orden"));
    comprobado = (comprobado && puntoRonda.hasOwnProperty("rondaId"));
    comprobado = (comprobado && puntoRonda.hasOwnProperty("puntoId"));
    return comprobado;
}

// getrondas
// lee todos los registros de la tabla rondas y
// los devuelve como una lista de objetos
module.exports.getRondas = function(callback) {
    var connection = getConnection();
    var rondas = null;
    sql = "SELECT * FROM rondas";
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        rondas = result;
        callback(null, rondas);
    });
    closeConnectionCallback(connection, callback);
}


// getrondasBuscar
// lee todos los registros de la tabla rondas cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getRondasBuscar = function(nombre, callback) {
    var connection = getConnection();
    var rondas = null;
    var sql = "SELECT * FROM rondas";
    if (nombre !== "*") {
        sql = "SELECT * FROM rondas WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        rondas = result;
        callback(null, rondas);
    });
    closeConnectionCallback(connection, callback);
}

// getRonda
// busca  el ronda con id pasado
module.exports.getRonda = function(id, callback) {
    var connection = getConnection();
    var rondas = null;
    sql = "SELECT * FROM rondas WHERE rondaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        if (result.length == 0) {
            callback(null, null);
            return;
        }
        callback(null, result[0]);
    });
    closeConnectionCallback(connection, callback);
}

// getRondaDetalle
// busca la ronda con el id pasado y devuelve la ronda
// con el detalle de sus puntos
module.exports.getRondaDetalle = function(id, callback) {
    var connection = getConnection();
    var rondas = null;
    sql = "SELECT r.rondaId, r.nombre AS rnombre, rp.rondaPuntoId, rp.orden, p.*";
    sql += " FROM rondas AS r";
    sql += " LEFT JOIN rondaspuntos AS rp ON rp.rondaId = r.rondaId";
    sql += " LEFT JOIN puntos AS p ON p.puntoId = rp.puntoId"
    sql += " WHERE r.rondaId = ?"
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, fromDbtoJsRonda(result));
    });
    closeConnectionCallback(connection, callback);
}


// postRonda
// crear en la base de datos el ronda pasado
module.exports.postRonda = function(ronda, callback) {
    if (!comprobarRonda(ronda)) {
        var err = new Error("La ronda pasada es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        callback(err);
        return;
    }
    var connection = getConnection();
    ronda.rondaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO rondas SET ?";
    sql = mysql.format(sql, ronda);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
        }
        ronda.rondaId = result.insertId;
        callback(null, ronda);
    });
    closeConnectionCallback(connection, callback);
}

// postPuntoRonda
// crear en la base de datos el punto-ronda pasado
module.exports.postPuntoRonda = function(puntoRonda, callback) {
    if (!comprobarPuntoRonda(puntoRonda)) {
        var err = new Error("La punto de ronda pasada es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        callback(err);
        return;
    }
    var connection = getConnection();
    puntoRonda.rondaPuntoId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO rondaspuntos SET ?";
    sql = mysql.format(sql, puntoRonda);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
        }
        puntoRonda.rondaPuntoId = result.insertId;
        callback(null, puntoRonda);
    });
    closeConnectionCallback(connection, callback);
}

// putRonda
// Modifica el ronda según los datos del objeto pasao
module.exports.putRonda = function(id, ronda, callback) {
    if (!comprobarRonda(ronda)) {
        var err = new Error("La ronda pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        callback(err);
        return;
    }
    if (id != ronda.rondaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
    var connection = getConnection();
    sql = "UPDATE rondas SET ? WHERE rondaId = ?";
    sql = mysql.format(sql, [ronda, ronda.rondaId]);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
        }
        callback(null, ronda);
    });
    closeConnectionCallback(connection, callback);
}

// deleteRonda
// Elimina el ronda con el id pasado
module.exports.deleteRonda = function(id, ronda, callback) {
    var connection = getConnection();
    sql = "DELETE from rondas WHERE rondaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        callback(null);
        closeConnectionCallback(connection, callback);
    });
}

// deletePuntoRonda
// Elimina el ronda con el id pasado
module.exports.deletePuntoRonda = function(id, callback) {
    var connection = getConnection();
    sql = "DELETE from rondaspuntos WHERE rondaPuntoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        callback(null);
        closeConnectionCallback(connection, callback);
    });
}

// Funciones de soporte

// fromDbtoJsRonda
// desde el registro de búsqueda referencial de una ronda
// devuelve un objeto montado con el detalle de sus puntos
function fromDbtoJsRonda(registros) {
    var ronda = {};
    var puntos = [];
    // si no hay registros, devovemos objeto nulo
    if (registros.length == 0) return null;
    // rellenamos los datos de la ronda
    ronda.rondaId = registros[0].rondaId;
    ronda.nombre = registros[0].rnombre;
    // montaje de los puntos relacionados
    for (var i = 0; i < registros.length; i++) {
        registro = registros[i];
        if (!registro.rondaPuntoId || !registro.puntoId) {
            continue;
        }
        var punto = {
            rondaPuntoId: registro.rondaPuntoId,
            puntoId: registro.puntoId,
            nombre: registro.nombre,
            tag: registro.tag,
            bloque: registro.bloque,
            edificio: registro.edificio,
            cota: registro.cota,
            observaciones: registro.observaciones
        };
        puntos.push(punto);
    }
    ronda.puntos = puntos;
    return ronda;
}
