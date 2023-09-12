const urlBase = 'http://laughsender.com/LAMPAPI';
const extension = 'php';


function registerUser() {
    // Retrieve user input from the registration form
    let firstName = document.getElementById("registerFirstName").value;
    let lastName = document.getElementById("registerLastName").value;
    let login = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;
	let confirmpassword = document.getElementById("comfirmPassword").value;

    // Validate user input
    if (!isValidName(firstName)){
        document.getElementById("registerResult").innerHTML = "Invalid first name. Letters only.";
        return;
    }

    if (!isValidName(lastName)) {
        document.getElementById("registerResult").innerHTML = "Invalid last name. Letters only.";
        return;
    }
	
	if(password !== confirmpassword){
		document.getElementById("registerResult").innerHTML = "Password and Confirm Password do not match.";
		return;
	}
	
    if (password.length < 8) {
        document.getElementById("registerResult").innerHTML = "Password should be at least 8 characters long";;
        return;
    }
	
	document.getElementById("registerResult").innerHTML = "";
	
	//if the user is not available it will stop here
	//if it is available, it will create the account
	checkUserAvailable(login).then(() => {
		return createUser(firstName, lastName, login, password);
	}).then(() => {
		//after creating the account if there were no errors, a success message will be displayed
		document.getElementById("registerResult").innerHTML = "The account has been successfully created! Redirecting to login...";
		//after getting the success message it will wait a few seconds and redirect to the login page
		setTimeout(() => {
			window.location.href = "login.html";
		}, 4000);
	}).catch((err) => {
		document.getElementById("registerResult").innerHTML = err.message;
	});
}

function checkUserAvailable(username) {
	let data = {login: username};
	let jsonPayload = JSON.stringify(data);
	
	let url = urlBase + '/SearchUsers.' + extension;
	let xhr = new XMLHttpRequest();
	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try{
		xhr.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				let response = JSON.parse(xhr.responseText);
				
				if("error" in response){
					//username is taken
					document.getElementById("registerResult").innerHTML = "User has already been taken";
					return;
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function createUser(first, last, user, pass){
	let data = {firstName: first, lastName: last, login: user, password: pass};
	let jsonPayload = JSON.stringify(data);
	
	let url = urlBase + '/RegisterUser.' + extension;
	let xhr = new XMLHttpRequest();
	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try{
		xhr.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				let response = JSON.parse(xhr.responseText);
				
				if("error" in response){
					document.getElementById("registerResult").innerHTML = "There was an error creating the account";
					return;
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function isValidName(name) {
    return /^[A-Za-z]+$/.test(name);
}
