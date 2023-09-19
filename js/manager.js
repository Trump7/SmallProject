const urlBase = 'http://laughsender.com/LAMPAPI';
const extension = 'php';

function loadContacts(){	
	//just using this to get the userId
	const {firstName, lastName, userId} = getUserData();
	
	//add contact
	let data = {UserID: userId};
	let jsonPayload = JSON.stringify(data);
	
	let url = urlBase + '/LoadContacts.' + extension;
	let xhr = new XMLHttpRequest();
	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try{
		xhr.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				let response = JSON.parse(xhr.responseText);
				
				if("results" in response){
					let tableVals = '';
					
					for(let i = 0; i < response.results.length; i++){
						tableVals += '<tr>';
						tableVals += '<td>' + response.results[i].Name + '</td>';
						tableVals += '<td>' + response.results[i].Phone + '</td>';
						tableVals += '<td>' + response.results[i].Email + '</td>';
						tableVals += '</tr>';
					}
					
					document.getElementById("contacts-contents").innerHTML = tableVals;
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){}
}


function openAddContact(){
	//show the add window
	const window = document.getElementById('add-window');
	window.style.display = 'block';
}

function closeAddContact(){
	//hide the add window
	const window = document.getElementById('add-window');
	window.style.display = 'none';
	//clear contents of add window
	document.getElementById('name').value = '';
	document.getElementById('phone').value = '';
	document.getElementById('email').value = '';
}

function addContact(){
	const name = document.getElementById('name').value;
	const phone = document.getElementById('phone').value;
	const mail = document.getElementById('email').value;
	
	//verification that name is present
	if(name == ''){
		document.getElementById('add-warning').innerHTML = "Name must be present";
		return;
	}
	
	//just using this to get the userId
	const {firstName, lastName, userId} = getUserData();
	
	//add contact
	let data = {Phone: phone, Email: mail, Name: name, UserID: userId};
	let jsonPayload = JSON.stringify(data);
	
	let url = urlBase + '/AddContact.' + extension;
	let xhr = new XMLHttpRequest();
	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try{
		xhr.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				let response = JSON.parse(xhr.responseText);
				
				if("success" in response){
					setTimeout(function(){document.getElementById('add-warning').innerHTML = "Account Added";}, 2000);
					loadContacts()
					closeAddContact();
				}
				else{
					document.getElementById("add-warning").innerHTML = err.message;
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("add-warning").innerHTML = err.message;
	}
}



function getUserData()
{
	userId = -1;
	let firstName = "";
	let lastName = "";
	
	
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	return {firstName, lastName, userId};
}


