var etat = {"inbox": [{"from": "AF22111212232211122","date": "2015 12 28 20:15:42","msg": "On a une réunion demain à 13h00" },{"from": "AF22111212232211122","date": "2016 01 03 10:15:31","msg": "On se rencontre à 12h00 pour le lunch" }],
"outbox":[{"to": "AF22111212232211122","date": "2016 01 12 20:15:42","msg": "Viens-tu au cours ce soir?" }],
"yp": {"AF22111212232211122": {"name": "Jean Fanchon"},"90221F212A4200001AA": {"name": "Robert Pratt"},"BA2674F84578427C784": {"name": "Jemal Djari"}}};

//Fonction qui affiche la liste des messages reçus dans la fenêtre 'cible'
function afficheInbox()
{
	var messages = "";
	for(var i=0;i<etat.inbox.length;i++) {
		  messages  = messages + "Recu de: " + etat.inbox[i].from + " Le: " + etat.inbox[i].date + "<br>Message: " + etat.inbox[i].msg + "<br><br>"
	};
	document.getElementById('TitreCible').innerHTML = "Boite de réception";
	document.getElementById('Cible').innerHTML = messages;
 }

//Fonction qui affiche la liste des messages envoyés dans la fenêtre 'cible'
function afficheOutbox()
{
	var envoies = "";
	 for(var i=0;i<etat.outbox.length;i++) {
		 envoies = envoies + "Envoyé à: "+ etat.outbox[i].to + " Le: " + etat.outbox[i].date + "<br>Message: " + etat.outbox[i].msg + "<br><br>"
	 };
	 document.getElementById('TitreCible').innerHTML = "Messages envoyés";
	 document.getElementById('Cible').innerHTML = envoies;
}
 
//Fonction qui affiche la liste des contacts dans la fenêtre 'cible'
function afficheYp()
{
	var contacts = "";
	var cles = Object.keys(etat.yp);
	for(var i=0;i<cles.length;i++){
		contacts = contacts + "Adresse: " + cles[i] + "<br>Nom: " + etat.yp[cles[i]].name + "<br><br>"
	};
	document.getElementById('TitreCible').innerHTML = "Liste des contacts";
	document.getElementById('Cible').innerHTML = contacts;
}

//Fonction qui ajoute le nouveau contact dans la variable etat.yp
function ajouterContact(form){
	var adresse=form.inputadresse.value;
	var nom=form.inputnom.value;
	var objNom = {};
	objNom["name"] = nom;
	etat.yp[adresse] = objNom;
}

//Fonction qui ajoute le nouveau message envoyés dans la variable etat.outbox
function ajouterMessage(form){
	var adresse=form.toAdresse.value;
	//var date=Date.now();
	var date="";
	var message=form.message.value;
	var objMessage = {};
	objMessage["to"] = adresse;
	objMessage["date"] = date;
	objMessage["msg"] = message;
	etat.outbox.push(objMessage);
}



