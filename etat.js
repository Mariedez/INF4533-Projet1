var etat = {"inbox": [{"from": "AF22111212232211122","date": "2015 12 28 20:15:42","msg": "Un court message ...." },{"from": "AF22111212232211122","date": "2016 01 03 10:15:31","msg": "Un autre message ...." }],"outbox":[{"to": "AF22111212232211122","date": "2016 01 12 20:15:42","msg": "Bla bla bla ...." }],"yp": {"AF22111212232211122": {"name": "Jean Fanchon"},"90221F212A4200001AA": {"name": "Bob"}}};

afficheInbox = function(){
	for(var i=0;i<etat.inbox.length;i++) {
		 console.log("Envoyé à: " + etat.inbox[i].to + "\nLe: " + etat.inbox[i].date + "\nMessage: " + etat.inbox[i].msg);
	 };
afficheOutbox = function(){
	 for(var i=0;i<etat.outbox.length;i++) {
		 console.log("Envoyé à: " + etat.outbox[i].to + "\nLe: " + etat.outbox[i].date + "\nMessage: " + etat.outbox[i].msg);
	 };
};

afficheYp = function(){
	var cles = Object.keys(etat.yp);
	for(var i=0;i<cles.length;i++){
		alert("Adresse: " + cles[i] + "\nNom: " + etat.yp[cles[i]].name);
	};
};

ajouteMessage = function(adresse,date,message){
	var nouvMessage = "{\"to\": " + "\"" + adresse + "\"" + ",\"date\": " + "\"" + date + "\"" + ",\"msg\": " + "\"" + message + "\"" + " }";
	etat.outbox.push(nouvMessage);
};

ajouteAdresse = function(adresse,nom){
	var nouvAdresse = "\"" + adresse + "\": {\"name\": \"" + nom + "\"}";
	etat.yp.push(nouvAdresse);
};








