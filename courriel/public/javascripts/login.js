$(document).ready(function() {
	$('#file').change(saveCle);
})

function saveCle(evt)
{
    var f = evt.target.files[0]; 

    if (f) {
      var r = new FileReader();
      r.onload = function(e) { 
	    var contents = e.target.result;
        sessionStorage.setItem("cle",  contents);
		/*alert("Fichier chargé avec succès");*/
      }
      r.readAsText(f);
    } else { 
      alert("Erreur de chargement du fichier");
    }
}



function validateForm()
{
	var username = $('#usrnm').val();
	var password = $('#pswd').val();
	var fichierCle = $('#file').val();
	
	if (username === "" || password === "")
	{
		$('#err').text('Un des champs est vide.');
		return false;
	}
	else if (fichierCle === "")
	{
		$('#err').text('Vous devez choisir un fichier avec la clé privée.');
		return false;
	}
	else if (!sessionStorage.getItem("cle"))
	{
		$('#err').text('Erreur lors du chargement du fichier de clé. Veuillez choisir un autre fichier.');
		return false;
	}
	else
	{
		return true;
	}
}