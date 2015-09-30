//=======================================
// WM500V2 (index.js)
// API to communicate to WM500V2 terminals via USB
//========================================
// Author: Rafael Garcia (rafa@myariadna.com)
// 2015 [License CC-BY-NC-4.0]


// required modules
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

// api support
var terminalApi = require('./lib/terminal/terminal-api');
var administradores_router = require('./lib/administradores/administradores_controller');

// read app parameters (host and port for the API)
var config = require('./config.json');


// starting express
var app = express();
// to parse body content
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

// using cors for cross class
app.use(cors());

// mounting routes
var router = express.Router();

// -- common to all routes
router.use(function (req, res, next){
	// go on (by now)
	next();
});


// -- general GET (to know if the server is up and runnig)
router.get('/', function(req,res){
	res.json('SGUARD API -- runnig');
});



// -- TERMINAL --------------
router.route('/terminal/read-terminal-number')
	.get(terminalApi.readTerminalNumber);

router.route('/terminal/records')
	.get(terminalApi.getRecords)
	.delete(terminalApi.deleteRecords);

router.route('/terminal/set-date-time')	
	.post(terminalApi.setDateTime);

// -- registering routes
app.use('/api',router);
app.use('/api/administradores', administradores_router);

// -- start server
app.listen(config.apiPort);

// -- console message
console.log('SGUARD API on port: ' + config.apiPort);