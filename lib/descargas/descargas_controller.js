var express = require('express');
var router = express.Router();
var descargasDb = require("./descargas_db_mysql");

// GetDescarga del terminal
router.get('/leer-terminal', function(req, res) {
    descargasDb.getDescargaDelTerminal(function(err, result) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

// GetDescarga del terminal
router.get('/leer-descarga/:descargaId', function(req, res) {
    descargasDb.getDescargaDetalle(req.params.descargaId, function(err, result) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

// GetDescarga del terminal
router.get('/procesar-descarga/:descargaId', function(req, res) {
    descargasDb.procesarDescargas(req.params.descargaId, function(err, result) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});

// GetDescarga del terminal
router.get('/procesar-descarga-test/:descargaId', function(req, res) {
    descargasDb.procesarDescargasTest(req.params.descargaId, function(err, result) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(result);
        }
    });
});


// Exports
module.exports = router;
