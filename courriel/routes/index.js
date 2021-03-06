var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var nomUtilisateur='';


/* Page d'accueil qui redirige vers /login. */
router.get('/', function(req, res, next) {
  res.redirect('/login');
});

/* Page de login. */
router.get('/login', function(req, res, next) {
	console.log(__dirname);
  res.render('login', { titre: 'Connexion' });
});

/* Route pour se connecter. */
router.post('/connexion', function(req, res, next) {

	var db = new sqlite3.Database('../database/Courriel.db');
	var sess = req.session;
	var ref = req.headers['referer'];

	db.serialize(function() {
	  db.get("select nom, clePublique from utilisateurs where nom = ? and password = ?", req.body.username, req.body.password, function(err, row) {
			db.close();
			if (row == undefined)
			{
				res.render('login', { titre: 'Connexion', erreur: "Mauvais nom d'utilisateur ou mot de passe." })
			}
			else
			{
				console.log('connexion ok');
				nomUtilisateur=row.Nom;
				sess.user = row.ClePublique;
				res.cookie('moiCle', row.ClePublique);
				res.cookie('moi', row.Nom);
				var rURL = getParameterByName('r', ref);
				if (rURL)
				{
					res.redirect('/' + rURL);
				}
				else
				{
					res.redirect('/inbox');
				}
			}
	  });
	});
});

/* Route pour écrire un message. */
router.get('/nouveauMessage', requireLogin, function(req, res, next) {
  getContactsForUser(req.session.user, function(data) {
	res.render('nouveauMessage', { titre: 'Nouveau message', contacts: data });
  });
});

/* Route pour sauvegarder un nouveau message */
router.post('/saveMessage', requireLogin, function(req, res, next) {
	var msg = req.body
	var now = new Date();
	now = formatDate(now);
	var db = new sqlite3.Database('../database/Courriel.db');
	db.serialize(function() {
	  db.run('INSERT INTO messages (CleDe, CleA, DateEnvoi, Texte, CleSymDe, CleSymA) values (?, ?, ?, ?, ?, ?)', msg.cleDe, msg.cleA, now, msg.body, msg.cleSymDe, msg.cleSymA , function(err) {
			db.close();
			if (err)
			{
				console.log(err);
				res.sendStatus(500);
			}
			else
			{
				res.sendStatus(200);
			}
	  });
	});
});

/* Route pour afficher la boîte de réception des messages */
router.get('/inbox', requireLogin, function(req, res, next) {
    getUserInbox(req.session.user, function(data){
      res.render('inbox', { titre: 'Boîte de réception de ' + nomUtilisateur, inbox: data });
  });
});

/* Route pour afficher la boîte des messages envoyés */
router.get('/outbox', requireLogin, function(req, res, next) {
    getUserOutbox(req.session.user, function(data){
      res.render('outbox', { titre: 'Messages envoyés par ' + nomUtilisateur, outbox: data });
  });
});

/* Route pour rafraîchir la liste des contacts après l'ajout d'un nouveau contact */
router.get('/getContacts', requireLogin, function(req, res, next) {
    getContactsForUser(req.session.user, function(data) {
          lesContacts = data;
		  res.json(data);
      });
});



var msg = {};
/* Route pour voir un message */
router.get('/message', requireLogin, isValidMessage, function(req, res, next) {
	var db = new sqlite3.Database('../database/Courriel.db');
	var id = getParameterByName("id", req.url);
	db.serialize(function() {
	  db.get('select dateEnvoi, cleSymDe, cleSymA, message_de, message_a, texte from vue_message where id_message = ?',id, function(err, row) {
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

/* Route pour voir la liste des utilisateurs*/
router.get('/utilisateurs', function(req,res,next) {
       var lesContacts;
	   var CleUtil = req.session.user;
	   console.log(CleUtil);
	   console.log("on est dans la liste");
       getTousUtilisateurs(function(data) {
       lesUtilisateurs = data;
       res.render('utilisateurs', { titre: 'Liste des utilisateurs', utilisateurs: lesUtilisateurs });
     });
});

/* Route pour voir la liste des contacts*/
router.get('/contacts', requireLogin, function(req,res,next) {
       var lesContacts;
	   var CleUtil = req.session.user;
	   console.log(CleUtil);
	   getContactsForUser(req.session.user, function(data) {
	      //premier callback les contacts sont prêts
          lesContacts = data;
          getUtilisateurs(CleUtil,function(lesUtilisateurs) {
           //deuxième callback à l'intérieur du premier tout est prêt.
            res.render('contacts', { titre: 'Liste des contacts de ' + nomUtilisateur , contacts: lesContacts, utilisateurs: lesUtilisateurs });
         });
      });
});

/* Route pour enregistrer un nouveau utilisateur dans la base de données*/
router.post('/saveUtilisateur', function(req,res,next) {
	var nouvUtilisateur = req.body;
	var db = new sqlite3.Database('../database/Courriel.db');
	db.serialize(function() {
	  db.run('INSERT INTO utilisateurs (clePublique, Nom, Password) values (?, ?, ?)', nouvUtilisateur.cle, nouvUtilisateur.nom, nouvUtilisateur.password , function(err) {
			db.close();
			if (err)
			{
				console.log(err);
				res.sendStatus(500);
			}
			else
			{
				res.sendStatus(200);
			}
	  });
	});
});


/* Route pour enregistrer un nouveau contact dans la base de données*/
router.post('/saveContact', requireLogin, function(req,res,next) {
	var nouvContact = req.body;
	var db = new sqlite3.Database('../database/Courriel.db');
	db.serialize(function() {
	  db.run('INSERT INTO Contacts (CleUtilisateur, CleContact) values (?, ?)', nouvContact.cleMoi, nouvContact.cleContact, function(err) {
			db.close();
			if (err)
			{
				console.log(err);
				res.sendStatus(500);
			}
			else
			{
				res.sendStatus(200);
			}
	  });
	});
});


/* Fonction pour obtenir le nom de la personne qui s'est connectée*/
function requireLogin(req, res, next)
{
	var sess = req.session;
	var redURL = req.url.substr(1, req.url.length - 1);
	var nom;
  if (sess.user)
	{
		var db = new sqlite3.Database('../database/Courriel.db');
		db.serialize(function() {
			db.get("select nom from utilisateurs where clePublique = ?", sess.user, function(err, row) {
					db.close();
					if (row == undefined)
					{
						res.redirect('/login?r=' + redURL);
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
    res.redirect('/login?r=' + redURL);
  }
}



/* Fonction pour obtenir la liste des messages reçus pour un utilisateur donné à partir de la base de données*/
function getUserInbox(userKey,callback)
{
	var db = new sqlite3.Database('../database/Courriel.db');
	db.serialize(function() {

	  db.all("select dateEnvoi, message_de, texte, id_message from vue_message where cleA = ?", userKey, function(err, rows) {
			db.close();
			console.log(rows);
			callback(rows);
	  });
	});
}

/* Fonction pour obtenir la liste des messages envoyés par un utilisateur donné à partir de la base de données*/
function getUserOutbox(userKey,callback)
{
	var db = new sqlite3.Database('../database/Courriel.db');
	db.serialize(function() {

	  db.all("select dateEnvoi, message_a, texte, id_message from vue_message where cleDe = ?", userKey, function(err, rows) {
			db.close();
			console.log(rows);
			callback(rows);
	  });
	});
}


/* Fonction pour obtenir la liste des contacts d'un utilisateur donné à partir de la base de données*/
function getContactsForUser(userKey, callback)
{
	var db = new sqlite3.Database('../database/Courriel.db');

	if (!userKey)
		return false;

	db.serialize(function() {

	  db.all("select cleContact, contact_nom from liste_contacts where cleUtilisateur = ?", userKey, function(err, rows) {
			db.close();
			console.log(rows);
			callback(rows);
	  });
	});
}

/* Fonction pour obtenir la liste de tous les utilisateurs.*/
function getTousUtilisateurs(callback)
{
	var db = new sqlite3.Database('../database/Courriel.db');
	db.serialize(function() {
	   db.all("select ClePublique, Nom from Utilisateurs ", function(err, rows) {
			db.close();
			console.log('Ok voici la liste');
			console.log(rows);
			callback(rows);
	  });
	});
}

/* Fonction pour obtenir la liste des utilisateurs qui ne sont pas déjà dans les contacts de l'utilisateur qui est connecté.*/
function getUtilisateurs(userKey,callback)
{
	if (!userKey)
		return false;

	var db = new sqlite3.Database('../database/Courriel.db');
	db.serialize(function() {
	   db.all("select ClePublique, Nom from Liste_contact_ajouter where CleUtilisateur = ?", userKey, function(err, rows) {
			db.close();
			console.log('Ok voici la liste');
			console.log(rows);
			callback(rows);
	  });
	});
}

/*Fonction pour obtenir la valeur d'un paramètre passé dans le URL.*/
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//S'assure que le message concerne l'utilisateur connecté
function isValidMessage(req, res, next)
{
	var id = getParameterByName("id", req.url);
	var cle = req.session.user;

	if (!id || !cle)
		res.sendStatus(404);
	else
	{
		var db = new sqlite3.Database('../database/Courriel.db');
		db.serialize(function() {
			db.get("select texte from messages where id_message = ? and (CleDe = ? or CleA = ?)", id, cle, cle, function(err, row) {
				db.close();
				if (row)
					next();
				else
					res.sendStatus(404);
			});
		});
	}
}

function formatDate(d)
{
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	var day = d.getDate();

	if (month.toString().length == 1)
		month = "0" + month;

	if (day.toString().length == 1)
		day = "0" + day;

	return year + "-" + month + "-" + day;
}

module.exports = router;
