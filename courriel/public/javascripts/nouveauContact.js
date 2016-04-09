$(document).ready(function() {
	$('#btnEnr').click(enregistrerContact);
});

function enregistrerContact()
{
	var cleContact = $('#nomUtilisateur option:selected').val();
	var cleMoi = decodeURIComponent(getCookie('moiCle'));
	var nouvContact = {};
	nouvContact.cleMoi = cleMoi;
	nouvContact.cleContact = cleContact;
	$.ajax({ type:'post', 
				url: 'http://localhost:3000/saveContact', 
				contentType: 'application/json', 
				data: JSON.stringify(nouvContact),
				statusCode: { 500: function() {alert("Une erreur s'est produite lors de l'enregistrement du contact.");}, 200: function() {alert("Contact ajouté avec succès!");} } 
			});
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