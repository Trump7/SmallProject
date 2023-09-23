const urlBase = 'http://laughsender.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

//for home, about, and manager page
function checkAuth() {
	const {firstName, lastName, userId} = getUserData();
	
	const isAuthenticated = userId > 0;
	
	const loginButt = document.getElementById("loginButt");
	const logoutButt = document.getElementById("logoutButt");
	const userNamePrompt = document.getElementById("userNamePrompt");
	const manButt = document.getElementById("manButt");
	const userName = document.getElementById("userName");
	
	//if the user is logged in, it will show logout, prompt, and manager
	//if the user is not logged in, it will only show the login button
	//display = "none" means to take it out
	//display = "block" means it's shown (block-level element)
	if(isAuthenticated){
		loginButt.style.display = "none";
		logoutButt.style.display = "block";
		userNamePrompt.style.display = "block";
		manButt.style.display = "block";
		userName.innerHTML = "Logged in as<br>" + firstName + " " + lastName;
	}
	else{
		loginButt.style.display = "block";
		logoutButt.style.display = "none";
		userNamePrompt.style.display = "none";
		manButt.style.display = "none";
		/* Not sure why this isn't working... 
		Should redirect user from color.html if not logged in
		if(window.location.href == "color.html"){
			window.location.href = "login.html";
		}
		*/
	}
}

//for login page
function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	let hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

//part of log in script
function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

//get user data is read cookie with returning the data
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

//logout will only be available if logged in.  Auto expires cookie.
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

//used to load contacts on manager page
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
						tableVals += '<td class="button-cell">'; 
						tableVals += '<img class="edit-button" src="images/edit.png" title="Edit" onclick="openEditContact(' + response.results[i].ID + ',' + i + ')">';
						tableVals += '<img class="delete-button" src="images/delete.png" title="Delete" onclick="deleteContact(' + response.results[i].ID + ')">';
						tableVals += '</td>';
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

//function to search through existing contacts
function searchContacts(){
	const searchBox = document.getElementById('contactSearch').value.toLowerCase();
	
	//get data together
	const {userId} = getUserData();
	let data = {search: searchBox, UserID: userId};
	
	
	let jsonPayload = JSON.stringify(data);
	
	let url = urlBase + '/SearchContacts.' + extension;
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
						const result = response.results[i];
						
						tableVals += '<tr>';
						tableVals += '<td>' + result.Name + '</td>';
						tableVals += '<td>' + result.Phone + '</td>';
						tableVals += '<td>' + result.Email + '</td>';
						tableVals += '<td class="button-cell">'; 
						tableVals += '<img class="edit-button" src="images/edit.png" title="Edit" onclick="openEditContact(' + result.ID + ',' + i + ')">';
						tableVals += '<img class="delete-button" src="images/delete.png" title="Delete" onclick="deleteContact(' + result.ID + ')">';
						tableVals += '</td>';
						tableVals += '</tr>';
					}
					
					document.getElementById("contacts-contents").innerHTML = tableVals;
				}
				else{
					let tableVals = '';
					document.getElementById("contacts-contents").innerHTML = tableVals;
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){}
}

function deleteContact(index){
	if(confirm("Are you sure you want to delete this contact?") == true){
		//delete contact
		let data = {ID: index};
		let jsonPayload = JSON.stringify(data);
	
		let url = urlBase + '/DeleteContacts.' + extension;
		let xhr = new XMLHttpRequest();
	
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
		try{
			xhr.onreadystatechange = function(){
				if(this.readyState == 4 && this.status == 200){
					let response = JSON.parse(xhr.responseText);
				
					if("success" in response){
						loadContacts();
						alert("Success! Contact was deleted");
					}
					else{
						alert("Error: Could not delete Contact");
					}
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err){
			alert("Error: " + err);
		}
	}
}

function editContact(id){
	const name = document.getElementById('e.name').value;
	const phone = document.getElementById('e.phone').value;
	const mail = document.getElementById('e.email').value;
	
	//verification that name is present
	if(name == ''){
		document.getElementById('edit-warning').innerHTML = "Warning: Name must be present";
		return;
	}
	
	//edit contact
	let data = {Name: name, Phone: phone, Email: mail, ID: id};
	let jsonPayload = JSON.stringify(data);
	
	let url = urlBase + '/EditContacts.' + extension;
	let xhr = new XMLHttpRequest();
	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try{
		xhr.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				let response = JSON.parse(xhr.responseText);
				
				if("success" in response){
					document.getElementById('edit-warning').innerHTML = "Contact Changed Successfully";
					setTimeout(function(){loadContacts(); closeEditContact();}, 2000);
				}
				else{
					document.getElementById("edit-warning").innerHTML = "Error: Could not submit edit.";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("edit-warning").innerHTML = err.message;
	}
}

function openEditContact(id, index){
	const window = document.getElementById('edit-window');
	window.style.display = 'block';
	
	const row = document.getElementById('contacts-contents').rows[index];
	
	document.getElementById('e.name').value = row.cells[0].textContent;
	document.getElementById('e.phone').value = row.cells[1].textContent;
	document.getElementById('e.email').value = row.cells[2].textContent;
	
	const saveButton = document.getElementById('save-button');
		saveButton.onclick = function () {
        editContact(id);
    };
}

function closeEditContact(){
	//hide the add window
	const window = document.getElementById('edit-window');
	window.style.display = 'none';
	//clear contents of add window
	document.getElementById('e.name').value = '';
	document.getElementById('e.phone').value = '';
	document.getElementById('e.email').value = '';
	document.getElementById('edit-warning').innerHTML = "";
}


//used to open the add contact window
function openAddContact(){
	//show the add window
	const window = document.getElementById('add-window');
	window.style.display = 'block';
}

//used to clear and close the add contact window
function closeAddContact(){
	//hide the add window
	const window = document.getElementById('add-window');
	window.style.display = 'none';
	//clear contents of add window
	document.getElementById('name').value = '';
	document.getElementById('phone').value = '';
	document.getElementById('email').value = '';
	document.getElementById('add-warning').innerHTML = "";
}

//used to add a contact to that users' list
function addContact(){
	const name = document.getElementById('name').value;
	const phone = document.getElementById('phone').value;
	const mail = document.getElementById('email').value;
	
	//verification that name is present
	if(name == ''){
		document.getElementById('add-warning').innerHTML = "Warning: Name must be present";
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
					document.getElementById('add-warning').innerHTML = "Account Successfully Added";
					setTimeout(function(){loadContacts(); closeAddContact();}, 2000);
				}
				else{
					document.getElementById("add-warning").innerHTML = "Error: Perhaps contact already exists?";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("add-warning").innerHTML = err.message;
	}
}