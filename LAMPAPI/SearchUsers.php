<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "APIMan", "WeLoveAPIMan", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT * FROM Users WHERE Login = ?");
		$stmt->bind_param("s", $inData["Login"]);
		$stmt->execute();
		
		$result = $stmt->get_result();

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
		sendResultInfoAsJson($retvalue);
	}
	
?>
