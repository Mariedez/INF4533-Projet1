var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var msg = {
	sujet: "Bonjour",
	cleDe: "Htwu4BtMecG0Tiw0vvbJ7M8drkOgI1IKKLxuQzZYZBrrJJqL7sBwBscqWkCOIpoeqCcPVm69TyVjVI6xpUeBrfrPYePOrcdF+ME7/pT9ATbUCZHXYbQNfZkHHWuHlL8Q7U1xlTm0R+FhUc67a1JceT7P7TzXjnhLRTjCLb57gVA=",
	cleA: "Htwu4BtMecG0Tiw0vvbJ7M8drkOgI1IKKLxuQzZYZBrrJJqL7sBwBscqWkCOIpoeqCcPVm69TyVjVI6xpUeBrfrPYePOrcdF+ME7/pT9ATbUCZHXYbQNfZkHHWuHlL8Q7U1xlTm0R+FhUc67a1JceT7P7TzXjnhLRTjCLb57gVA=",
	body: "IpvguB4YY8MPJ6JSFGgur9mpjTbOEn2roBQH",
	de: "Vincent Emond",
	a: "Vincent Emond",
	date: "2016/03/30"
};

/* GET home page. */
router.get('/message', function(req, res, next) {
  res.render('message', { message: msg });
});

module.exports = router;
