const urlBase = 'http://laughsender.com/LAMPAPI';
const extension = 'php';


function registerUser() {
    // Retrieve user input from the registration form
    let firstName = document.getElementById("registerFirstName").value;
    let lastName = document.getElementById("registerLastName").value;
    let login = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;
	let confirmpassword = document.getElementById("confirmPassword").value;

	document.getElementById("registerResult").innerHTML = "";

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
	
	//if the user is not available it will stop here
	//if it is available, it will create the account
	checkUserAvailable(login, function(userAvailable){
		if(userAvailable){
			createUser(firstName, lastName, login, password, function(regResult){
				if(regResult == "true"){
					//after creating the account if there were no errors, a success message will be displayed
					document.getElementById("registerResult").innerHTML = "The account has been successfully created! Redirecting to login...";
					//after getting the success message it will wait a few seconds and redirect to the login page
					setTimeout(window.location.href = "/login.html", 3000);
				}
				else{
					document.getElementById("registerResult").innerHTML = "Error: " + regResult;
				}
			});
		}
		else{
			document.getElementById("registerResult").innerHTML = "User has already been taken";
		}
	});
}	


function checkUserAvailable(username, result) {
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
				
				if("Success" in response){
					//username is taken
					result(false);
				}
				else{
					//username is available
					result(true);
				}	
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function createUser(first, last, user, pass, result){
	let data = {FirstName: first, LastName: last, Login: user, Password: pass};
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
					//registration failed
					result("There was a problem when creating the account.");
				}
				else{
					result("true");
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
