// administradores_db_mysql
// Manejo de la tabla administradores en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment"); // librería para formateo de fechas y horas
var terminalBridge = require("../terminal/terminal-bridge.js");

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


module.exports.getDescargaDelTerminal = function(callback) {
    // hay que obtener el númer del terminal lo primero
    terminalBridge.readTerminalNumber(function(err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        var descarga = {
            cabecera: {
                descargaId: 0,
                nterminal: result,
                fecha: moment().format('YYYY-MM-DD'),
                hora: moment().format('HH:mm:ss'),
                resultado: "CARGA SIMPLE TERMINAL [SIN PROCESO]"
            },
            lecturas: []
        };
        terminalBridge.getRecords(function(err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            if (result.length == 0){
                callback(null, null);
                return;
            }
            descarga.lecturas = result;
            guardaDescarga(descarga, function(err, result) {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, result);
                // lanzamos el borre de los registros procesados
                terminalBridge.deleteRecords(function(err, result) {
                    // no hacemos nada porque el callback lo hemos lanzado
                    // antes.
                });
            });
        });
    });
}

// guardaDescarga
// guarda la descarga en la base de datos
function guardaDescarga(descarga, callback) {
    var connection = getConnection();
    sql = "INSERT INTO descargas SET ?";
    sql = mysql.format(sql, descarga.cabecera);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        descarga.cabecera.descargaId = result.insertId;
        //
        var lecturas = descarga.lecturas;
        var primeraVez = true;
        // Ahora hay que dar de alta las diferentes líneas
        sql = "INSERT INTO descargas_lineas(descargaLineaId, descargaId, tag, fecha, hora) VALUES ";
        for (var i = 0; i < lecturas.length; i++) {
            var lectura = lecturas[i];
            if (!primeraVez) {
                sql += ",";
            }
            primeraVez = false;
            // demosntar la lectura para montar sql
            sql += "('0',"; // descargaLineaId (es autonumérica, ya cogerá el valor que corresponde)
            sql += "'" + descarga.cabecera.descargaId + "',"; // descargaId (desarga a la que pertenece)
            sql += "'" + lectura.tag + "',"; // tag (tag leido)
            sql += "'" + lectura.stamp.substr(0, 4) + "/" + lectura.stamp.substr(4, 2) + "/" + lectura.stamp.substr(6, 2) + "',"; // fecha (yyyy-mm-dd)
            sql += "'" + lectura.stamp.substr(8, 2) + ":" + lectura.stamp.substr(10, 2) + ":" + lectura.stamp.substr(12, 2) + "')"; // hora (hh:mm:ss)

        }
        connection.query(sql, function(err, result) {
            if (err) {
                callback(err);
                return;
            }
            connection.end();
            callback(null, descarga);
        });
    });
}
