//État ininial de la variable etat
var etat = {"inbox": [{"from": "BA2674F84578427C784","date": "2016 02 28 16:15:42","msg": "Mille millions de mille milliards de mille sabords! Espèce de bachi-bouzouk! Bougres de faux jetons à la sauce tartare! Arrêtez de faire le zouave!" },{"from": "90221F212A4200001AA","date": "2016 02 25 23:18:55","msg": "M'enfin!" },{"from": "AF22111212232211122","date": "2015 12 28 20:15:42","msg": "Ils sont fou ces romains" },{"from": "CA2674F845784273476","date": "2016 01 03 10:15:31","msg": "Selon mon pendule, il faut aller un peu plus à l'ouest, oui j'en suis certain, il faut aller à l'ouest" },{"from": "BF5464F845356273486","date": "2016 01 14 21:12:55","msg": "Ahhh! Je ris de me voir si belle en ce miroir!" }],
"outbox":[{"to": "AF22111212232211122","date": "2016 01 12 20:15:42","msg": "Non Obélix, tu ne peux pas avoir de potion magique, tu sais bien que tu est tombé dedans quand tu étais petit. Tu es assez fort comme ça." },{"to": "BA2674F84578427C784","date": "2016 02 28 16:22:23","msg": "Capitaine, sauve qui peut, voici la Castafiore" },{"to": "90221F212A4200001AA","date": "2015 12 12 18:15:24","msg": "Gaston, vous n'avez pas encore répondu au courrier en retard!" }],
"yp": {"AF22111212232211122": {"name": "Obélix"},"90221F212A4200001AA": {"name": "Gaston Lagaffe"},"BA2674F84578427C784": {"name": "Capitaine Haddock"},"CA2674F845784273476": {"name":"Professeur Tournesol"},"BF5464F845356273486": {"name":"La Castafiore"}}};

//Fonction qui affiche la liste des messages reçus dans la fenêtre 'cible'
function afficheInbox()
{
	var messages = '<div class="Contenant"><table><tr><th>Envoyé Par</th><th>Date</th></tr>';
	for(var i=0;i<etat.inbox.length;i++) {
		var recuDe = etat.yp[etat.inbox[i].from].name
		  messages  = messages + "<tr><td>" + recuDe + "</td><td>" + etat.inbox[i].date + "</td></tr><tr><td colspan='2' id=\"mes\">" + etat.inbox[i].msg + "</td></tr>"
	};
	document.getElementById('TitreCible').innerHTML = "Boîte de réception";
	document.getElementById('Cible').innerHTML = messages + "</table></div>";
 }

//Fonction qui affiche la liste des messages envoyés dans la fenêtre 'cible'
function afficheOutbox()
{
	var envoies = '<div class="Contenant"><table><tr><th>Destinataire</th><th>Date</th></tr>';
	 for(var i=0;i<etat.outbox.length;i++) {
		 var destinataire = etat.yp[etat.outbox[i].to].name
		 envoies = envoies + "<tr><td>"+ destinataire + "</td><td>" + etat.outbox[i].date + "</td></tr><tr><td colspan='2' id=\"mes\">" + etat.outbox[i].msg + "</td></tr>"
	 };
	 document.getElementById('TitreCible').innerHTML = "Messages envoyés";
	 document.getElementById('Cible').innerHTML = envoies + "</table></div>";
}
//Fonction qui crée et retourne un tableau(array) contenant la liste des noms des contacts dans YP
function getNomContacts() 
{
	var cles = Object.keys(etat.yp);
	var nomContacts = [];
	for(var i=0;i<cles.length;i++){
		nomContacts.push(etat.yp[cles[i]].name);
	}
	return nomContacts;
}

//Fonction qui affiche la liste des contacts dans la fenêtre 'cible'
function afficheYp()
{
	var contacts = '<div class=Contenant><table><tr><th>Noms</th></tr>';
	var cles = Object.keys(etat.yp);
	var nomContacts = getNomContacts();
	for(var i=0;i<nomContacts.length;i++){
		contacts = contacts + "<tr><td>" + etat.yp[cles[i]].name + "</td></tr>"
	};
	document.getElementById('TitreCible').innerHTML = "Liste des contacts";
	document.getElementById('Cible').innerHTML = contacts + "</table></div>";
}

//Fonction qui vérifie si un nom existe déjà dans la liste de contact YP
function verifContact(nom)
{
	var flag = false;
	var nomContacts = getNomContacts();
	for(var i=0;i<nomContacts.length;i++){
		if(nom==nomContacts[i])
			{flag = true};
	}
	return flag;
}

//Fonction qui ajoute le nouveau contact dans la variable etat.yp
function ajouterContact(form)
{
	var adresse=form.inputadresse.value;
	var nom=form.inputnom.value;
	if(verifContact(nom)) {
			alert("Il y a déjà un contact portant ce nom. Veuillez entrer en autre nom.");
	} else {
		if (nom=="" || adresse=="") {
			alert("Vous devez indiquer l'adresse et le nom du destinataire");
		} else {
			var objNom = {};
			objNom["name"] = nom;
			etat.yp[adresse] = objNom;
			alert("Contact ajouté");
			form.reset();
		}
	}
}

// Fonction qui créé la liste des destinataires pour envoyer un nouveau message

function creerListeDest()
{
	var listeDest = getNomContacts();
	var listeDeroulante = document.getElementById("destinataires");
	listeDeroulante.options.length = 0;
	listeDeroulante[0] = new Option("","Choisissez un destinataire");
	for(var i=1;i<listeDest.length;i++){
		 listeDeroulante[listeDeroulante.length] = new Option(listeDest[i],listeDest[i]);
	}
}

//Fonction qui ajoute le nouveau message envoyés dans la variable etat.outbox
function ajouterMessage(form)
{
	var nom = form.destinataires.value;
	var adresse;
	var found = false;
	var cles = Object.keys(etat.yp);
	for(var i = 0; i<cles.length; i++){
		if (etat.yp[cles[i]].name == nom){
			found = true;
	 		adresse = cles[i];
		}
	}
	if(found == false){
		alert("Vous devez choisir un destinataire existant. Vous pouvez ajouter un destinataire en cliquant sur Nouveau contact.");
	}else{
		var dateJour = new Date().toLocaleString("fr-CA");
		var message=form.message.value;
		var objMessage = {};
		objMessage["to"] = adresse;
		objMessage["date"] = dateJour;
		objMessage["msg"] = message;
		etat.outbox.push(objMessage);
		alert("Message envoyé");
		form.reset();
	}
}



