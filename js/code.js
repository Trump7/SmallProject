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
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
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
	const table = document.getElementById('contacts');
	const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
	
	for(let i = 0; i < rows.length; i++){
		const nameCell = rows[i].getElementsByTagName('td')[0];
		const phoneCell = rows[i].getElementsByTagName('td')[1];
		const emailCell = rows[i].getElementsByTagName('td')[2];
		
		const name = nameCell.textContent.toLowerCase();
		const phone = phoneCell.textContent.toLowerCase();
		const email = emailCell.textContent.toLowerCase();
		
		if(name.includes(searchBox) || phone.includes(searchBox) || email.includes(searchBox)){
			rows[i].style.display = '';
		}
		else{
			rows[i].style.display = 'none';
		}
	}
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