var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var msg = {};

/* GET home page. */
router.get('/message', function(req, res, next) {

	var db = new sqlite3.Database('../database/Courriel.db');
	
	db.serialize(function() {
		
	  db.get('select dateEnvoi, cleSymDe, cleSymA, message_de, message_a, texte from vue_message where id_message = 5', function(err, row) {

			msg.cleDe = row.cleSymDe;
			msg.cleA = row.cleSymA;
			msg.body = row.texte;
			msg.de = row.message_de;
			msg.a = row.message_a;
			msg.date = row.dateEnvoi;
			
			db.close();
			
			res.render('message', { message: msg, titre: 'Message reçu' });
	  });		
	});
	
	
});

module.exports = router;
