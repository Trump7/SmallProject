const urlBase = 'http://laughsender.com/LAMPAPI';
const extension = 'php';

function registerUser() {
    // Retrieve user input from the registration form
    let firstName = document.getElementById("registerFirstName").value;
    let lastName = document.getElementById("registerLastName").value;
    let login = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    // Clear any previous error messages and asterisks
    clearErrors();

    // Validate user input
    let isValid = true;

    if (!isValidName(firstName)){
        document.getElementById("firstResult").innerHTML = "*Invalid first name. Letters only.";
        displayErrorAsterisk("errorFirstName");
        isValid = false;
    }

    if (!isValidName(lastName)) {
        document.getElementById("lastResult").innerHTML = "*Invalid last name. Letters only.";
        displayErrorAsterisk("errorLastName");
        isValid = false;
    }
	
	if(login == ''){
		document.getElementById("userResult").innerHTML = "*Username must be present";
		displayErrorAsterisk("errorUsername");
		isValid = false;
	}

    if (password !== confirmPassword){
        document.getElementById("confirmResult").innerHTML = "*Password and Confirm Password do not match.";
        displayErrorAsterisk("errorPassword");
        displayErrorAsterisk("errorConfirmPassword");
        isValid = false;
    }

    if (password.length < 8) {
        document.getElementById("passResult").innerHTML = "*Password should be at least 8 characters long";
        displayErrorAsterisk("errorPassword");
		displayErrorAsterisk("errorConfirmPassword");
        isValid = false;
    }

    if (isValid) {
        // If all input is valid, continue with registration
        let hash = md5(password);

        // Check if the user is available
        checkUserAvailable(login, function(userAvailable){
            if(userAvailable){
                createUser(firstName, lastName, login, hash, function(regResult){
                    if(regResult === "true"){
                        // After creating the account with no errors, show a success message
                        document.getElementById("registerResult").innerHTML = "The account has been successfully created! Redirecting to login...";
                        // After displaying the success message, wait a few seconds and redirect to the login page
                        setTimeout(function(){window.location.href = "/login.html";}, 3000);
                    }
                    else {
                        document.getElementById("registerResult").innerHTML = "Error: " + regResult;
                    }
                });
            }
            else {
                document.getElementById("registerResult").innerHTML = "User has already been taken";
            }
        });
    }
}

function checkUserAvailable(username, result) {
    let data = {Login: username};
    let jsonPayload = JSON.stringify(data);

    let url = urlBase + '/SearchUsers.' + extension;
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                let response = JSON.parse(xhr.responseText);

                if("Success" in response){
                    // Username is taken
                    result(false);
                }
                else{
                    // Username is available
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

function createUser(first, last, user, pass, result) {
    let data = {FirstName: first, LastName: last, Login: user, Password: pass};
    let jsonPayload = JSON.stringify(data);

    let url = urlBase + '/RegisterUser.' + extension;
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                let response = JSON.parse(xhr.responseText);

                if("error" in response){
                    // Registration failed
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



function displayErrorAsterisk(elementId) {
    document.getElementById(elementId).style.display = "inline";
}

function clearErrors() {
    // Clear any error messages
    document.getElementById("firstResult").innerHTML = "";
	document.getElementById("lastResult").innerHTML = "";
	document.getElementById("userResult").innerHTML = "";
	document.getElementById("passResult").innerHTML = "";
	document.getElementById("confirmResult").innerHTML = "";
	document.getElementById("registerResult").innerHTML = "";

    // Hide all error asterisks
    let errorAsterisks = document.querySelectorAll(".error-asterisk");
    errorAsterisks.forEach(function(asterisk) {
        asterisk.style.display = "none";
    });
}