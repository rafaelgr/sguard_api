// rondas_realizadas__db_mysql
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

// comprobarRondaRealizada
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarRondaRealizada(rondaRealizada) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof rondaRealizada;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && rondaRealizada.hasOwnProperty("rondaRealizadaId"));
    comprobado = (comprobado && rondaRealizada.hasOwnProperty("rondaId"));
    comprobado = (comprobado && rondaRealizada.hasOwnProperty("vigilanteId"));
    comprobado = (comprobado && rondaRealizada.hasOwnProperty("resultado"));
    return comprobado;
}


// comprobarPuntoRondaRealizada
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarPuntoRondaRealizada(puntoRondaRealizada) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof puntoRondaRealizada;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && puntoRondaRealizada.hasOwnProperty("rondaRealizadaId"));
    comprobado = (comprobado && puntoRondaRealizada.hasOwnProperty("puntoId"));
    comprobado = (comprobado && puntoRondaRealizada.hasOwnProperty("resultado"));
    return comprobado;
}

// getrondasRealizadas
// lee todos los registros de la tabla rondas realizdas y
// los devuelve como una lista de objetos
module.exports.getRondasRealizadas = function(callback) {
    var connection = getConnection();
    var rondas = null;
    sql = "SELECT * FROM rondas_realizadas";
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


// getrondasRealizdasBuscar
// lee todos los registros de la tabla rondas cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getRondasRealizadasBuscar = function(nombre, callback) {
    var connection = getConnection();
    var rondas = null;
    sql = "SELECT rr.*, r.nombre AS rnombre, v.nombre AS vnombre";
    sql += " FROM rondas_realizadas AS rr";
    sql += " LEFT JOIN rondas AS r ON r.rondaId = rr.rondaId";
    sql += " LEFT JOIN vigilantes AS v ON v.vigilanteId = rr.vigilanteId";
    if (nombre !== "*") {
        sql += " WHERE rnombre LIKE ?";
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

// getRondaRealizada
// busca  el ronda con id pasado
module.exports.getRondaRealizada = function(id, callback) {
    var connection = getConnection();
    var rondas = null;
    sql = "SELECT rr.*, r.nombre AS rnombre, v.nombre AS vnombre";
    sql += " FROM rondas_realizadas AS rr";
    sql += " LEFT JOIN rondas AS r ON r.rondaId = rr.rondaId";
    sql += " LEFT JOIN vigilantes AS v ON v.vigilanteId = rr.vigilanteId";
    sql += " WHERE rr.rondaRealizadaId = ?";
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

// getRondaRealizadaDetalle
// busca la ronda con el id pasado y devuelve la ronda
// con el detalle de sus puntos
/* --
module.exports.getRondaRealizadaDetalle = function(id, callback) {
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
----*/


// postRondaRealizada
// crear en la base de datos el ronda pasado
module.exports.postRondaRealizada = function(rondaRealizada, callback) {
    if (!comprobarRondaRealizada(rondaRealizada)) {
        var err = new Error("La ronda pasada es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        callback(err);
        return;
    }
    var connection = getConnection();
    rondaRealizada.rondaRealizadaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO rondas_realizadas SET ?";
    sql = mysql.format(sql, rondaRealizada);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
        }
        rondaRealizada.rondaRealizadaId = result.insertId;
        callback(null, rondaRealizada);
    });
    closeConnectionCallback(connection, callback);
}

// postPuntoRonda
// crear en la base de datos el punto-ronda pasado
/* --
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
-- */

// putRondaRealizada
// Modifica el ronda según los datos del objeto pasao
module.exports.putRondaRealizada = function(id, rondaRealizada, callback) {
    if (!comprobarRondaRealizada(rondaRealizada)) {
        var err = new Error("La ronda pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        callback(err);
        return;
    }
    if (id != rondaRealizada.rondaRealizadaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        callback(err);
        return;
    }
    var connection = getConnection();
    sql = "UPDATE rondas_realizadas SET ? WHERE rondaRealizadaId = ?";
    sql = mysql.format(sql, [rondaRealizada, rondaRealizada.rondaRealizadaId]);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
        }
        callback(null, rondaRealizada);
    });
    closeConnectionCallback(connection, callback);
}

// deleteRondaRealizada
// Elimina el ronda con el id pasado
module.exports.deleteRondaRealizada = function(id, rondaRealizada, callback) {
    var connection = getConnection();
    sql = "DELETE from rondas_realizadas WHERE rondaRealizadaId = ?";
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
/* --
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
--*/
// Funciones de soporte

// fromDbtoJsRonda
// desde el registro de búsqueda referencial de una ronda
// devuelve un objeto montado con el detalle de sus puntos
/* --
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
            orden: registro.orden,
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
--*/
