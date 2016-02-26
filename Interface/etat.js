var etat = {"inbox": [{"from": "AF22111212232211122","date": "2015 12 28 20:15:42","msg": "On a une réunion demain à 13h00" },{"from": "AF22111212232211122","date": "2016 01 03 10:15:31","msg": "On se rencontre à 12h00 pour le lunch" }],
"outbox":[{"to": "AF22111212232211122","date": "2016 01 12 20:15:42","msg": "Viens-tu au cours ce soir?" }],
"yp": {"AF22111212232211122": {"name": "Jean Fanchon"},"90221F212A4200001AA": {"name": "Robert Pratt"},"BA2674F84578427C784": {"name": "Jemal Djari"}}};

//Fonction qui affiche la liste des messages reçus dans la fenêtre 'cible'
function afficheInbox()
{
	var messages = '<div style="height: 80%; width: 90%; overflow: auto;"><table border="1" width="100%" ><tr><th>Envoyé Par</th><th>Date</th></tr>';
	for(var i=0;i<etat.inbox.length;i++) {
		var recuDe = etat.yp[etat.inbox[i].from].name
		  messages  = messages + "<tr><td>" + recuDe + "</td><td>" + etat.inbox[i].date + "</td></tr><tr><td colspan='2'>" + etat.inbox[i].msg + "</td></tr>"
	};
	document.getElementById('TitreCible').innerHTML = "Boite de réception";
	document.getElementById('Cible').innerHTML = messages;
 }

//Fonction qui affiche la liste des messages envoyés dans la fenêtre 'cible'
function afficheOutbox()
{
	var envoies = '<div style="height: 80%; width: 90%; overflow: auto;"><table border="1" width="100%" ><tr><th>Destinataire</th><th>Date</th></tr>';
	 for(var i=0;i<etat.outbox.length;i++) {
		 var destinataire = etat.yp[etat.outbox[i].to].name
		 envoies = envoies + "<tr><td>"+ destinataire + "</td><td>" + etat.outbox[i].date + "</td></tr><tr><td colspan='2'>" + etat.outbox[i].msg + "</td></tr>"
	 };
	 document.getElementById('TitreCible').innerHTML = "Messages envoyés";
	 document.getElementById('Cible').innerHTML = envoies;
}

//Fonction qui affiche la liste des contacts dans la fenêtre 'cible'
function afficheYp()
{
	var contacts = '<div style="height: 80%; width: 90%; overflow: auto;"><table border="1" width="100%" ><tr><th>Adresse</th><th>Nom</th></tr>';
	var cles = Object.keys(etat.yp);
	for(var i=0;i<cles.length;i++){
		contacts = contacts + "<tr><td>" + cles[i] + "</td><td>" + etat.yp[cles[i]].name + "</td></tr>"
	};
	document.getElementById('TitreCible').innerHTML = "Liste des contacts";
	document.getElementById('Cible').innerHTML = contacts;
}

//Fonction qui ajoute le nouveau contact dans la variable etat.yp
function ajouterContact(form){
	var adresse=form.inputadresse.value;
	var nom=form.inputnom.value;
	if (nom=="" || adresse=="") {
		alert("Vous devez indiquer l'adresse et le nom du destinataire");
	} else {
		var objNom = {};
		objNom["name"] = nom;
		etat.yp[adresse] = objNom;
		confirm("Contact ajouté");
		form.reset();
	}
}

//Fonction qui ajoute le nouveau message envoyés dans la variable etat.outbox
function ajouterMessage(form){
	var adresse=form.toAdresse.value;
	//var date = "";
	var dateJour = new Date().toLocaleString();
	var message=form.message.value;
	if(adresse==""){
		alert("Vous devez indiquer l'adresse du destinataire");
	} else {
		var objMessage = {};
		objMessage["to"] = adresse;
		objMessage["date"] = dateJour;
		objMessage["msg"] = message;
		etat.outbox.push(objMessage);
		confirm("Message envoyé");
		form.reset();
	}
}
