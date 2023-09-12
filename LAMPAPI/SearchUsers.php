<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;
	$login = $inData["Login"];

	$conn = new mysqli("localhost", "APIMan", "WeLoveAPIMan", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT * FROM Users WHERE Login = ?");
		
		$stmt->bind_param("s", $login);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		print "sssssss";
		
		// checks for username
		while($row = $result->fetch_assoc())
		{
			$searchCount++;
		}
		
		if($searchCount == 0)
		{
			returnWithError('{"No Matching Login"}');
		}
		else
		{
			print $login;
			// print " ";
			// print $result->fetch_assoc();
			returnWithInfo('ok');
		}
		
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError($err)
	{
		sendResultInfoAsJson($err);
	}
	
	// function returnWithInfo( $searchResults )
	// {
	// 	sendResultInfoAsJson($searchResults);
	// }

	function returnWithInfo($info)
	{
		$retValue = '{"Success": "' . $info . '"}';
		print $retValue;
		sendResultInfoAsJson($retvalue);
	}
	
?>
