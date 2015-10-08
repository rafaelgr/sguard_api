// administradores_db_mysql
// Manejo de la tabla administradores en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment"); // librería para formateo de fechas y horas
var terminalBridge = require("../terminal/terminal-bridge.js");
// 
var vigilanteDb = require("../vigilantes/vigilantes_db_mysql");
var rondaDb = require("../rondas/rondas_db_mysql");
var puntoDb = require("../puntos/puntos_db_mysql");
var rondaRealizadaDb = require("../rondas_realizadas/rondas_realizadas_db_mysql")

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
            if (result.length == 0) {
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

var fnGetDescargaDetalle = function(descargaId, callback) {
    var connection = getConnection();
    var descarga = {
        cabecera: null,
        lecturas: []
    };
    var sql = "SELECT d.descargaId, d.nterminal, d.fecha, d.hora, d.resultado, dl.descargaLineaId, dl.tag, dl.fecha AS lfecha, dl.hora AS lhora, dl.tipo, dl.tipoId";
    sql += " FROM descargas AS d";
    sql += " LEFT JOIN descargas_lineas AS dl ON dl.descargaId = d.descargaId";
    sql += " WHERE d.descargaId = ?";
    sql = mysql.format(sql, descargaId);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, fromDbToJsDescarga(descarga, result));
    });
}
module.exports.getDescargaDetalle = fnGetDescargaDetalle;


var fnProcesarDescargas = function(descargaId, callback) {
    fnGetDescargaDetalle(descargaId, function(err, res) {
        if (err) {
            callback(err);
            return;
        }
        var descarga = res;
        var lecturas = descarga.lecturas;
        var vigilanteId = null;
        var rondaRealizada = null;
        var resultadoRonda = "CORRECTO";
        var resultadoLinea = "CORRECTO";
        var logMens = "-- PROCESAMIENTO DE LECTURA NUMERO:" + descargaId + "<br>";
        // procesamos una a una las lecturas y actuamos en consecuencia
        async.eachSeries(lecturas,
            function(lectura, callback2) {
                var tipo = lectura.tipo;
                var tipoId = lectura.tipoId;
                // si no reconocemos el tipo pasando
                if (!tipo) {
                    logMens += "DESCONOCIDO TAG:" + lectura.tag + " Fecha: " + lectura.fecha + " Hora: " + lectura.hora + "<br/>";
                    callback2();
                    return;
                }
                // actuamos según el tipo
                switch (tipo) {
                    case "VIGILANTE":
                        logMens += "VIGILANTE TAG:" + lectura.tag + " Fecha: " + lectura.fecha + " Hora: " + lectura.hora + " ID: " + tipoId + "<br/>";
                        break;
                    case "RONDA":
                        logMens += "RONDA TAG:" + lectura.tag + " Fecha: " + lectura.fecha + " Hora: " + lectura.hora + " ID: " + tipoId + "<br/>";
                        break;
                    case "PUNTO":
                        logMens += "PUNTO TAG:" + lectura.tag + " Fecha: " + lectura.fecha + " Hora: " + lectura.hora + " ID: " + tipoId + "<br/>";
                        break;
                    default:
                        logMens += "DESCONOCIDO TAG:" + lectura.tag + " Fecha: " + lectura.fecha + " Hora: " + lectura.hora + "<br/>";
                        break;
                }
                // a por la siguiente lectura
                callback2();
            },
            function(err) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, logMens)
            });
    });

};
module.exports.procesarDescargas = fnProcesarDescargas;


var fnProcesarDescargasTest = function(descargaId, callback) {
    fnGetDescargaDetalle(descargaId, function(err, res) {
        if (err) {
            callback(err);
            return;
        }
        var descarga = res;
        var lecturas = descarga.lecturas;
        var vigilanteId = null;
        var rondaRealizada = null;
        var resultadoRonda = "CORRECTO";
        var resultadoLinea = "CORRECTO";
        var logMens = "-- PROCESAMIENTO DE LECTURA NUMERO:" + descargaId + "<br>";
        var ordenEnRonda = 0;
        // procesamos una a una las lecturas y actuamos en consecuencia
        async.eachSeries(lecturas,
            function(lectura, callback2) {
                var tipo = lectura.tipo;
                var tipoId = lectura.tipoId;
                // si no reconocemos el tipo pasando
                if (!tipo) {
                    logMens += "DESCONOCIDO TAG:" + lectura.tag + " Fecha: " + lectura.fecha + " Hora: " + lectura.hora + "<br/>";
                    callback2();
                    return;
                }
                // actuamos según el tipo
                switch (tipo) {
                    case "VIGILANTE":
                        logMens += "VIGILANTE TAG:" + lectura.tag + " Fecha: " + lectura.fecha + " Hora: " + lectura.hora + " ID: " + tipoId + "<br/>";
                        // ahora el vigilante ya no es nulo, simplemente eso
                        vigilanteId = tipoId;
                        break;
                    case "RONDA":
                        logMens += "RONDA TAG:" + lectura.tag + " Fecha: " + lectura.fecha + " Hora: " + lectura.hora + " ID: " + tipoId + "<br/>";
                        if (rondaRealizada) {
                            // si había una ronda previa hay que actualizarla
                            var rr = {
                                resultado: resultadoRonda
                            }
                            rondaRealizadaDb.putRondaRealizadaCarga(rondaRealizada.rondaRealizadaId, rr, function(err, res) {
                                if (err) {
                                    logMens += "ERROR: " + err.Message + "<br/>";
                                    callback2(err);
                                    return;
                                }
                                // Ahora hay que crear la nueva
                                resultadoRonda = "CORRECTO"; // por defecto OK
                                // no hay ronda previa (creamos una nueva)
                                rondaRealizadaDb.postRondaRealizadaDesdeTag(lectura.tag, lectura.fecha, lectura.hora, lectura.vigilanteId, function(err, res) {
                                    if (err) {
                                        logMens += "ERROR: " + err.Message + "<br/>";
                                        callback2(err);
                                        return;
                                    }
                                    rondaRealizada = res;
                                    logMens += "** CREADA RONDA REALIZADA ID:" + rondaRealizada.rondaRealizadaId + "<br/>";
                                    ordenEnRonda = 0;
                                    callback2(); // seguimos
                                });
                            });
                        } else {
                            // no hay ronda previa (creamos una nueva)
                            rondaRealizadaDb.postRondaRealizadaDesdeTag(lectura.tag, lectura.fecha, lectura.hora, lectura.vigilanteId, function(err, res) {
                                if (err) {
                                    logMens += "ERROR: " + err.Message + "<br/>";
                                    callback2(err);
                                    return;
                                }
                                rondaRealizada = res;
                                logMens += "** CREADA RONDA REALIZADA ID:" + rondaRealizada.rondaRealizadaId + "<br/>";
                                ordenEnRonda = 0;
                                callback2(); // seguimos
                            });
                        }
                        break;
                    case "PUNTO":
                        logMens += "PUNTO TAG:" + lectura.tag + " Fecha: " + lectura.fecha + " Hora: " + lectura.hora + " ID: " + tipoId + "<br/>";
                        // se ha leido un punto (incrementamos su orden)
                        ordenEnRonda++;
                        // lo buscamos en la base de datos
                        rondaRealizadaDb.getPuntoRondaRealizadaCarga(rondaRealizada.rondaRealizadaId, tipoId, function(err, res) {
                            if (err) {
                                logMens += "ERROR: " + err.Message + "<br/>";
                                callback2(err);
                                return;
                            }
                            var puntos = res;
                            var encontrado = false;
                            // comprobamos que pertenece a la ronda hay que mirar todos los posibles resultados
                            for (var i = 0; i < puntos.length; i++) {
                                punto = puntos[i];
                                if (punto.puntoId == tipoId && punto.rondaId == rondaRealizada.rondaId) {
                                    encontrado = true;
                                    if (punto.orden == ordenEnRonda) {
                                        var prr = {
                                            fecha: lectura.fecha,
                                            hora: lectura.hora,
                                            resultado: "CORRECTO"
                                        };
                                        logMens += "PUNTO ID:" + tipoId + " ENCONTRADO EN SECUENCIA CORRECTA" + "<br/>";
                                    } else {
                                        var prr = {
                                            fecha: lectura.fecha,
                                            hora: lectura.hora,
                                            resultado: "FUERA DE SECUENCIA"
                                        };
                                        logMens += "PUNTO ID:" + tipoId + " ENCONTRADO FUERA DE SECUENCIA" + "<br/>";
                                    }
                                    rondaRealizadaDb.putPuntoRondaRealizadaCarga(punto.rondaRealizadaPuntoId, prr, function(err, res) {
                                        if (err) {
                                            logMens += "ERROR: " + err.Message + "<br/>";
                                            callback2(err);
                                            return;
                                        }
                                        callback2();
                                        return;
                                    });
                                }
                            }
                            if (!encontrado) {
                                // hay que ver que vamos a hacer, de momento seguimos
                                logMens += "*************** PUNTO ID:" + tipoId + " NO PERTENECE A ESTA RONDA " + "<br/>";
                                callback2();
                            }
                        });
                        break;
                    default:
                        logMens += "DESCONOCIDO TAG:" + lectura.tag + " Fecha: " + lectura.fecha + " Hora: " + lectura.hora + "<br/>";
                        break;
                }
                // a por la siguiente lectura
                callback2();
            },
            function(err) {
                if (err) {
                    callback(err);
                    return;
                }
                logMens += "--- PROCESO FINALIZADO SIN ERRORES --";
                callback(null, logMens)
            });
    });

};
module.exports.procesarDescargasTest = fnProcesarDescargasTest;

function fromDbToJsDescarga(descarga, registros) {
    if (registros.length == 0) {
        return null;
    }
    var registro = registros[0];
    descarga.cabecera = {
        descargaId: registro.descargaId,
        nterminal: registro.nterminal,
        fecha: registro.fecha,
        hora: registro.hora
    };
    for (var i = 0; i < registros.length; i++) {
        var r = registros[i];
        var l = {
            tag: r.tag,
            fecha: moment(r.lfecha).format('YYYY-MM-DD'),
            hora: r.lhora,
            tipo: r.tipo,
            tipoId: r.tipoId
        }
        descarga.lecturas.push(l);
    }
    return descarga;
}

// Verifica TAG
// Conmprueba si el tag leido corresponde a una roda, vigilante o punto
// devuelve una cadena con el tipo y el identificador del registro en la base de datos.
// VIGIN, VIGFN (Vigilante inicio y final)
// RNDIN, RDNFN (Ronda inicio y final)
// PUNTO (Punto)
function verificaTAG(tag, callback_serie) {
    async.series([
            function(callback) {
                vigilanteDb.getVigilantesBuscarTag(tag, function(err, result) {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    if (result.length == 0) {
                        callback(null, null);
                        return;
                    }
                    var vigilante = result[0];
                    var tipo = "VIGILANTE";
                    if (vigilante.tagf && tag == vigilante.tagf) {
                        tipo = "VIGILANTEF";
                    }
                    callback(null, {
                        tipo: tipo,
                        id: vigilante.vigilanteId
                    });
                });
            },
            function(callback) {
                rondaDb.getRondaDetalleTag(tag, function(err, result) {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    if (!result) {
                        callback(null, null);
                        return;
                    }
                    var ronda = result;
                    var tipo = "RONDA";
                    if (ronda.tagf && tag == ronda.tagf) {
                        tipo = "RONDAF";
                    }
                    callback(null, {
                        tipo: tipo,
                        id: ronda.rondaId
                    });
                });
            },
            function(callback) {
                puntoDb.getPuntoTag(tag, function(err, result) {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    if (!result) {
                        callback(null, null);
                        return;
                    }
                    var punto = result;
                    var tipo = "PUNTO";
                    callback(null, {
                        tipo: tipo,
                        id: punto.puntoId
                    });
                });
            }
        ],
        function(err, results) {
            if (err) {
                callback_serie(err, null);
            }
            var mresult = null;
            for (var i = 0; i < results.length; i++) {
                if (results[i]) {
                    mresult = results[i];
                }
            }
            callback_serie(null, mresult);
        });
}

//--- Montaje para llamada síncrona en los insert
function procesarLecturas(descargaId, lecturas, callback_procesar) {
    var i = 0;
    async.eachSeries(lecturas,
        function(lectura, callback) {
            verificaTAG(lectura.tag, function(err, result) {
                if (err) {
                    callback(err);
                    return;
                }
                var fecha = lectura.stamp.substr(0, 4) + "-" + lectura.stamp.substr(4, 2) + "-" + lectura.stamp.substr(6, 2);
                var hora = lectura.stamp.substr(8, 2) + ":" + lectura.stamp.substr(10, 2) + ":" + lectura.stamp.substr(12, 2);
                var descargaLinea = {
                    descargaId: descargaId,
                    tag: lectura.tag,
                    fecha: fecha,
                    hora: hora,
                    tipo: null,
                    tipoId: null
                };
                descargaLinea.descargaId = descargaId;
                if (result) {
                    descargaLinea.tipo = result.tipo,
                        descargaLinea.tipoId = result.id
                }
                lectura.fecha = fecha;
                lectura.hora = hora;
                lectura.tipo = descargaLinea.tipo;
                lectura.tipoId = descargaLinea.tipoId;
                var connection = getConnection();
                var sql = "INSERT INTO descargas_lineas SET ?";
                sql = mysql.format(sql, descargaLinea);
                connection.query(sql, function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback();
                    }
                });

            });
        },
        function(err) {
            callback_procesar(err)
        });
}

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
        procesarLecturas(descarga.cabecera.descargaId, lecturas, function(err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, descarga);
        });
    });
}
