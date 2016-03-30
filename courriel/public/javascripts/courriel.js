var data;
var autocompleteData = new Array();
var dialog;
var form;
var allFields;
var pkPattern = /[0-9A-F]{19}/;
var oldKey;
var createContact;

$( document ).ready(function() {
	
	data = etat;
	$( "#tabs" ).tabs();
	loadInbox();
	loadOutbox();
	loadContacts();
	$("#txtTo").autocomplete({source: autocompleteData});
	$(".btn-back").button().click(function(e) { 
		$("#tabs").css('display', 'block');
		$(e.target).closest('div').css('display', 'none');
	})
	$("#btnNouveauMsg").button({ icons: { primary: "ui-icon-circle-plus"}}).click(
		function() 
		{
			$("#ecriture-message input[type=text], #ecriture-message textarea").val("");
			$("#tabs").css("display", "none");
			$("#ecriture-message").css("display", "block");
		}
	);
	
	$('#btnNouveauContact').button({ icons: { primary: "ui-icon-circle-plus"}}).click(addContact);
	
	$("#btnSend").button({ icons: { primary: "ui-icon-mail-closed"}}).click(envoyerMessage);
	
	dialog = $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 450,
      width: 400,
      modal: true,
      buttons: {
		  "Modifier": dialogConfirm,
        Cancel: function() {
          dialog.dialog( "close" );
        }
      },
      close: function() {
        form[ 0 ].reset();
        allFields.removeClass( "ui-state-error" );
      }
    });
	
	var name = $('#txtName');
	var pk = $('#txtPK');
	
	allFields = $( [] ).add( name ).add( pk );
	
	form = dialog.find( "form" ).on( "submit", function( event ) {
      event.preventDefault();
    });
	
	$("#btnGenerate").button().click(function() {
		var key = new RandExp(pkPattern).gen();
		$('#txtPK').val(key);
	})
});

function loadInbox()
{
	var table = $("#tbInbox tbody");
	var inbox = data.inbox;
	
	$('#tbInbox tr').has('td').remove();
	
	for (var i = 0; i<inbox.length; i++)
	{
		var name = getName(inbox[i].from);
		var subject = inbox[i].subject;
		
		if (!subject || subject == "")
			subject = "(Sans objet)";
		
		table.append("<tr><td>"+ name +"</td><td>"+ subject +"<td>"+ inbox[i].date + "</td><td>"+inbox[i].msg+"</td></tr>");
		$(table).find("tr:last-child").click(showMessage);
	}
}

function loadOutbox()
{
	var table = $("#tbOutbox tbody");
	var outbox = data.outbox;
	
	$('#tbOutbox tr').has('td').remove();
	
	for (var i = 0; i<outbox.length; i++)
	{
		var name = getName(outbox[i].to);
		var subject = outbox[i].subject;
		
		if (!subject || subject == "")
			subject = "(Sans objet)";
		
		table.append("<tr><td>"+ name +"</td><td>"+ subject +"<td>"+ outbox[i].date + "</td><td>"+outbox[i].msg+"</td></tr>");
		$(table).find("tr:last-child").click(showMessage);
	}
}

function loadContacts()
{
	var table = $("#tbyp tbody");
	var contacts = data.yp;
	autocompleteData = new Array();
	
	$('#tbyp tr').has('td').remove();
	
	for (var key in contacts) {
		if (contacts.hasOwnProperty(key)) {
			table.append("<tr><td>"+ key +"</td><td>"+ contacts[key].name +"</td><td><button class='btnDelete'>Supprimer</button><button class='btnModify'>Modifier</button></td></tr>");
			$(table).find("tr:last-child .btnDelete").button({icons: { primary: 'ui-icon-trash'}}).click(deleteContact);
			$(table).find("tr:last-child .btnModify").button({icons: { primary: 'ui-icon-pencil'}}).click(modifyContact);
			autocompleteData.push(contacts[key].name);
		}
	}
	
	$("#txtTo").autocomplete({source: autocompleteData});
}


function getName(id)
{
	var contact = data.yp;
	var name = contact[id].name;
	
	return name;
}

function getKey(name)
{
	var contacts = data.yp;
	
	for (var key in contacts) {
		if (contacts.hasOwnProperty(key)) {
			if (name.trim().toLowerCase() == contacts[key].name.trim().toLowerCase())
				return key;
		}
	}
}

function showMessage(event)
{
	var e = event.target;
	
	var from = $(e).parent().find("td:nth-child(1)").text();
	var subject = $(e).parent().find("td:nth-child(2)").text();
	var date = $(e).parent().find("td:nth-child(3)").text();
	var msg = $(e).parent().find("td:nth-child(4)").text();
	
	var inbox = $(e).parent().parent().parent().attr('id') == 'tbInbox';
	
	$(".message-subject").text(subject);
	$(".message-de").text((inbox ? "De: " : "À: ") + from);
	$(".message-date").text((inbox ? "Reçu le: " : "Envoyé le: ") + date);
	$(".message-body").html(msg.replace(/\n/g, "<br />"));
	
	$("#tabs").css('display', 'none');
	$("#lecture-message").css('display', 'block');
}

function validName(txt)
{
	var contacts = etat.yp;
	
	for (var key in contacts) {
		if (contacts.hasOwnProperty(key)) {
			if (contacts[key].name.trim().toLowerCase() == txt.trim().toLowerCase())
				return true;
		}
	}
	
	return false;
}

function envoyerMessage(e) 
{
	var to = $("#txtTo").val();
	
	if (!validName(to))
	{
		var error = "*Le destinataire doit faire partie de la liste de contact.";
		
		if(to.trim() == "")
			error = "*Le message doit avoir un destinataire.";				
			
		$("#error-to").text(error);
		$("#txtTo").css("background-color", "#e60000");
	}
	else
	{
		var sujet = $("#txtSubject").val().trim();
		var date = moment().format('YYYY/MM/DD HH:mm:ss');
		var key = getKey(to);
		var msg = $("#txtMsg").val();
		
		//==================================================================
		
		var pub = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCT+BMdNn4LGQgZtT53EmQ9sAqajMofTQzkfSKM++4recuoiG8BRWkEsrPwBQFHpfC3hi/kDpdLEITjcJRgLVDfUIkUI+9bIs8WV/hpwCZfUSoqzbvROMRGWEMIfvWE8u1d8Efz/pji86CQue9ujMHJNVInHZKSH0PqP/T6U3SgyQIDAQAB";
		var priv = "MIICXAIBAAKBgQCT+BMdNn4LGQgZtT53EmQ9sAqajMofTQzkfSKM++4recuoiG8BRWkEsrPwBQFHpfC3hi/kDpdLEITjcJRgLVDfUIkUI+9bIs8WV/hpwCZfUSoqzbvROMRGWEMIfvWE8u1d8Efz/pji86CQue9ujMHJNVInHZKSH0PqP/T6U3SgyQIDAQABAoGAFxjkMu0so6LWptyp0YBncVGndhSAAH7QgmIeII+6z8KFTdtuKG6jQ/55JABEAOEgQCWMGDdG2orLk40hPBoWw2hVh/xyegBQ1AzWNqBXFOIALfhtuDlqUQaL+0A0nnCsbXeKsxjK3tZSEojgAG/8+nuPgVplCuDTeudYJvVMJeECQQDD1QYcCIMAdGEf8E/+ME3PD6xAshrX+VkiALsyS57iFrqxnPqF7H7N//nAxHxvt2ZFkxTzkaCUjOhyK51+Q4clAkEAwW5txmBNOo6mQzxqRb9IyP8Eqqy0jEWJCuQ3ErXYHq4lBbVEwfIeWVrmei4qhM53V8xccGmdKalAGBUt2cTD1QJAEUGhQzEg0hZvRJA5jE2XXaqk5CKNqQBo8U0dMcZmHsgf9Wy+yrRXTDHFQU5PJM0FbxYR35CylMSB6yWawDiVHQJAWGuoVpRS+T+YFQga9EMafHbGpVZJOg3XNVlZK35girXESrWv9pA8+0+oJ5XO7eKLf2D1qJU+uHqbx+Z2jSN6+QJBAKrqFvDjzWsXscrpQ7tak3J2cKmVKaXVm3wZxHe7cym7a0BLaZAk6JTwjx+N7d6LkBHK+BCugjpfN0AKTWDS92Q=";
		
		var cleSym = genereCleSym(); 
		
		//Encrypt
		var cleSymCrypte = chiffreAsym(cleSym, pub);
		var cleSymCrypteB64 = byteArrayToBase64(cleSymCrypte);
		
		var messageCrypte = chiffreSym(msg, cleSym);
		var messageCrypteB64 = byteArrayToBase64(messageCrypte);
		
		//Decrypt
		var cleSymCrypte2 = base64ToByteArray(cleSymCrypteB64);
		var cleSym2 = dechiffreAsym(cleSymCrypte2, priv);
		
		var messageCrypte2 = base64ToByteArray(messageCrypteB64);
		var message = dechiffreSym(messageCrypte2, cleSym2);
		
		alert(message);
		
		//====================================================================
		
		var msgObj = new Object();
		msgObj.to = key;
		msgObj.date = date;
		
		if (sujet != undefined && sujet != "")
			msgObj.subject = sujet;
		
		msgObj.msg = msg;
				
		$("#error-to").text("");
		$("#txtTo").css("background-color", "");
		
		addMessage(msgObj);
		
		$("#tabs").css('display', 'block');
		$(e.target).closest('div').css('display', 'none');
	}
}

function deleteContact(e)
{
	var key = $(e.target).parents('tr').find('td:first-child').text();
	delete etat.yp[key];
	loadContacts();
}

function modifyContact(e)
{
	createContact = false;
	$(".ui-dialog-title").text("Modifier un contact");
	var pk = $(e.target).parents('tr').find('td:first-child').text();
	var name = $(e.target).parents('tr').find('td:nth-child(2)').text();
	oldKey = pk;
	
	$('#txtName').val(name);
	$('#txtPK').val(pk);
	
	dialog.dialog('open');
}

function addContact()
{
	createContact = true;
	$(".ui-dialog-title").text("Ajouter un contact");
	dialog.dialog('open');
}

function dialogConfirm()
{
	var name = $('#txtName').val();
	var pk = $('#txtPK').val();
	
	if (!isValidKey(pk))
	{
		$('txtPK').addClass( "ui-state-error" );
		updateTips('La clé doit être composé de 19 caractères hexadecimaux (0 à 9 et A à F)');
	}
	else if (name.trim() == '')
	{
		$('txtName').addClass( "ui-state-error" );
		updateTips('Vous devez entrer un nom');
	}
	else
	{
		if (!createContact);
			delete etat.yp[oldKey];
		etat.yp[pk] = { "name": name };
		
		loadContacts();
		dialog.dialog( "close" );
		
	}
	
}

function updateTips( t ) {
	
	var tips = $('.validateTips');
      tips
        .text( t )
        .addClass( "ui-state-highlight" );
      setTimeout(function() {
        tips.removeClass( "ui-state-highlight", 1500 );
      }, 500 );
}

function addMessage(msgObj)
{
	etat.outbox.push(msgObj);
	loadOutbox()
}

function isValidKey(key)
{
	var patt = new RegExp(pkPattern);
	return patt.test(key.trim().toUpperCase());
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

