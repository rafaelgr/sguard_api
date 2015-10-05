var express = require('express');
var router = express.Router();
var edificiosDb = require("./edificios_db_mysql");

// GetEdificios
// Devuelve una lista de objetos con todos los edificios de la 
// base de datos.
// Si en la url se le pasa un nombre devuelve aquellos edificios
// que lo contengan.
router.get('/', function(req, res) {
    var nombre = req.query.nombre;
    if (nombre) {
        edificiosDb.getEdificiosBuscar(nombre, function(err, edificios) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(edificios);
            }
        });

    } else {
        edificiosDb.getEdificios(function(err, edificios) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(edificios);
            }
        });
    }
});

// GetEdificio
// devuelve el grupo con el id pasado
router.get('/:grupoId', function(req, res) {
    edificiosDb.getEdificio(req.params.grupoId, function(err, grupo) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (grupo == null) {
                res.status(404).send("Edificio no encontrado");
            } else {
                res.json(grupo);
            }
        }
    });
});


// PostEdificio
// permite dar de alta un grupo
router.post('/', function(req, res) {
    edificiosDb.postEdificio(req.body.grupo, function(err, grupo) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(grupo);
        }
    });
});



// PutEdificio
// modifica el grupo con el id pasado
router.put('/:grupoId', function(req, res) {
    // antes de modificar comprobamos que el objeto existe
    edificiosDb.getEdificio(req.params.grupoId, function(err, grupo) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            if (grupo == null) {
                res.status(404).send("Edificio no encontrado");
            } else {
                // ya sabemos que existe y lo intentamos modificar.
                edificiosDb.putEdificio(req.params.grupoId, req.body.grupo, function(err, grupo) {
                    if (err) {
                        res.status(500).send(err.message);
                    } else {
                        res.json(grupo);
                    }
                });
            }
        }
    });
});

// DeleteEdificio
// elimina un grupo de la base de datos
router.delete('/:grupoId', function(req, res) {
    var grupo = req.body.grupo;
    edificiosDb.deleteEdificio(req.params.grupoId, grupo, function(err, grupo) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

// Exports
module.exports = router;