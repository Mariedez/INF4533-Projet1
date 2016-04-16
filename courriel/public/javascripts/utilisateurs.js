$(document).ready(function() {
	$('#btnEnr').click(enregistrerUtilisateur);
});

function enregistrerUtilisateur()
{
	var username = $('#usrnm').val();
	var passeword = $('#pswd').val();
	var confirme = $('#cpswd').val();


	var dansListe = $("#" + username).text();

  $('#err').text('');

	if (username === "" || passeword === "" || confirme === "")
	{
		$('#err').text('Un des champs est vide.');
		return false;
	}
	else if (dansListe != '')
	{
		$('#err').text("L'utilisateur est dans la liste");
		return false;
	}
	else if (passeword != confirme)
	{
		$('#err').text('Le mot de passe ne concorde pas.');
		return false;
	}

	var d = new Date();
	var cle = d.toString();

	var nouvUtilisateur = {};
	nouvUtilisateur.cle = cle;
	nouvUtilisateur.nom = username;
	nouvUtilisateur.password = passeword;
	$.ajax({ type:'post',
				url: 'http://localhost:3000/saveUtilisateur',
				contentType: 'application/json',
				data: JSON.stringify(nouvUtilisateur),
				statusCode: { 500: function() {alert("Une erreur s'est produite lors de l'enregistrement de l'utilisateur.");}, 200: rechargerPage }
			});
}


function rechargerPage()
{
	alert("Utilisateur ajouté avec succès!");
	location.reload();
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
