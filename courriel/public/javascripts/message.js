$(document).ready(
	function() {
		var clePriv = chargeClePrive();
		var messageCrypteB64 = $('#message-body').text();
		var messageCrypte = base64ToByteArray(messageCrypteB64);
		var cleSymCrypte = $("meta[name='cleA']").attr('content');
		var cleSymB64 = dechiffreAsym(cleSymCrypte, clePriv);
		var cleSym = base64ToByteArray(cleSymB64);
		var message = dechiffreSym(messageCrypte, cleSym);
		$('#message-body').text(message);
	}
)

function chargeClePrive()
{
	var cle = sessionStorage.getItem('cle');
	
	if (!cle)
	{
		//ouvrir un pop up ou quelque chose qui demande le fichier de clé
		alert("Pas de clé privée de sauvegardée il faut vous reconnecter.");
		return false;
	}
	else
	{
		return cle;
	}
}