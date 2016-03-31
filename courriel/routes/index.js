var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var msg = {};

/* Route pour voir un message */
router.get('/message', requireLogin, function(req, res, next) {

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

/* Route pour se connecter. */
router.post('/connexion', function(req, res, next) {
	
	var db = new sqlite3.Database('../database/Courriel.db');
	
	db.serialize(function() {
		
	  db.get("select nom, clePublique from utilisateurs where nom = ? and password = ?", req.body.username, req.body.password, function(err, row) {

			if (row == undefined)
			{
				console.log('Mauvais username ou password');
				res.render('login', { titre: 'Connexion', erreur: 'Mauvais username ou password' })
			}
			else
			{
				console.log('connexion ok');
				//cookie de 30 minutes
				res.cookie('user', row.ClePublique, { httpOnly: true }); 
				res.redirect('/message');
			}
			
			db.close();
	  });		
	});
	
});

/* Page de login. */
router.get('/login', function(req, res, next) {
  res.render('login', { titre: 'Connexion' });
});

function requireLogin(req, res, next)
{
	if (req.cookies && req.cookies.user) 
	{
		var db = new sqlite3.Database('../database/Courriel.db');
		
		db.serialize(function() {
			db.get("select nom from utilisateurs where clePublique = ?", req.cookies.user, function(err, row) {

					db.close();
			
					if (row == undefined)
					{
						res.redirect('/login');
					}
					else
					{
						next();
					}	
					
			  });
		});

  } 
  else 
  {
    res.redirect('/login');
  }
}

module.exports = router;
