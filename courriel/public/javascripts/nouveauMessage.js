$(document).ready(function() {
	$('#btnSend').click(envoyerMessage);
});

function envoyerMessage()
{
	var message = $('#txtMsg').val();
	var destiCle = $('#selectTo option:selected').val();
	alert(destiCle);
	var cleSym = genereCleSym();
	var sourceCle = decodeURIComponent(getCookie('moiCle'));
	
	var msg = {};
	
	msg.cleA = destiCle;
	msg.cleDe = sourceCle;
	
	var cleSymB64 = byteArrayToBase64(cleSym);
	var cleSymCrypteDesti = chiffreAsym(cleSymB64, destiCle);
	var cleSymCrypteSource = chiffreAsym(cleSymB64, sourceCle);
	
	var messageCrypte = chiffreSym(message, cleSym);
	var messageCrypteB64 = byteArrayToBase64(messageCrypte);
	
	msg.body = messageCrypteB64;
	msg.cleSymDe = cleSymCrypteSource;
	msg.cleSymA = cleSymCrypteDesti;
	
	$.ajax({ type:'post', 
				url: 'http://localhost:3000/saveMessage', 
				contentType: 'application/json', 
				data: JSON.stringify(msg),
				statusCode: { 500: function() {alert("Une erreur s'est produite lors de l'envoi du message.");}, 200: function() {alert("Message envoyé avec succès!");} } 
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