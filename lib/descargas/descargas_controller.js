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


// Exports
module.exports = router;
