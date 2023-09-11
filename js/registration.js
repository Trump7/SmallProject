function registerUser() {
    // Retrieve user input from the registration form
    var firstName = document.getElementById("registerFirstName").value;
    var lastName = document.getElementById("registerLastName").value;
    var login = document.getElementById("registerUsername").value;
    var password = document.getElementById("registerPassword").value;

    // Validate user input
    if (!isValidFirstName(firstName)) {
        alert("First name should contain only letters.");
        return;
    }

    if (!isValidLastName(lastName)) {
        alert("Last name should contain only letters.");
        return;
    }

    if (password.length < 8) {
        alert("Password should be at least 8 characters long.");
        return;
    }

    // Create a JavaScript object to send to the server
    var data = {
        FirstName: firstName,
        LastName: lastName,
        Login: login,
        Password: password
    };

    // Send a POST request to the server to register the user
    fetch("register.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error === "") {
            // Registration was successful, show a success message
            document.getElementById("registrationResult").innerHTML = "Registration successful!";
            // You can also redirect the user to the login page or any other page here
        } else {
            // Registration failed, show an error message
            document.getElementById("registrationResult").innerHTML = "Error: " + data.error;
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function isValidFirstName(firstName) {
    return /^[A-Za-z]+$/.test(firstName);
}

function isValidLastName(lastName) {
    return /^[A-Za-z]+$/.test(lastName);
}

function isValidPassword(password){
	return 
}
