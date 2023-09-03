<?php
	$inData = getRequestInfo();

	// Extract variables from the request payload
	$phone = $inData["Phone"];
	$email = $inData["Email"];
	$name = $inData["Name"];
	$userId = $inData["UserId"];

	// Initialize database connection
	$conn = new mysqli("localhost", "APIMan", "WeLoveAPIMan", "COP4331"); 	

	// Check for connection error
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// Prepare SQL statement for inserting data
		$stmt = $conn->prepare("INSERT into Contacts (UserId, Name, Email, Phone) VALUES (?, ?, ?, ?)");

		// Bind the variables to the SQL statement
		$stmt->bind_param("ssss", $userId, $name, $email, $phone);

		// Execute the SQL statement
		$stmt->execute();

		// Close the statement and connection
		$stmt->close();
		$conn->close();

		// Return without any error
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
