function genereCleSym()
{
	var cle = [];
	
	for (var i = 0; i<16; i++)
	{
		var rand = Math.floor(Math.random() * 256);
		cle[i] = rand;
	}
	
	return cle;
}

function chiffreSym(msg, cle)
{
	// Convert text to bytes 
	var textBytes = aesjs.util.convertStringToBytes(msg);
	 
	// The counter is optional, and if omitted will begin at 0 
	var aesCtr = new aesjs.ModeOfOperation.ctr(cle, new aesjs.Counter(0));
	var encryptedBytes = aesCtr.encrypt(textBytes);
	
	return encryptedBytes;
}

function dechiffreSym(msg, cle)
{
	var aesCtr = new aesjs.ModeOfOperation.ctr(cle, new aesjs.Counter(0));
	var decryptedBytes = aesCtr.decrypt(msg);
 
	// Convert our bytes back into text 
	var decryptedText = aesjs.util.convertBytesToString(decryptedBytes);
	
	return decryptedText;
}

function chiffreAsym(msg, cle)
{
	var crypt = new JSEncrypt();
	crypt.setKey(cle); 
	
	var enc = crypt.encrypt(msg);
	
	return enc;
}

function dechiffreAsym(msg, cle)
{
	var crypt = new JSEncrypt();
	crypt.setKey(cle); 
	
	var dec = crypt.decrypt(msg);
	
	return dec;
}

function byteArrayToBase64(a)
{
	var str = "";
	
	for (var i = 0; i<a.length; i++)
	{
		str += String.fromCharCode(a[i]);
	}
	
	return window.btoa(str);
}

function base64ToByteArray(str)
{
	var a = [];
	
	var dec = window.atob(str);
	
	for (var i = 0; i<dec.length; i++)
	{
		a[i] = dec.charCodeAt(i);
	}
	
	return a;
}

function compareArray(a,b)
{
	if (a.length != b.length)
		return false;
	
	for (var i = 0; i<a.length; i++)
	{
		if(a[i] != b[i])
			return false;
	}
	
	return true;
}