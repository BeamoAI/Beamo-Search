<?php
$apiKey = 'cb70b6bdd3c845829aa121546231104';
$lat = $_GET['lat'];
$lon = $_GET['lon'];

function fetch_weather($apiKey, $lat, $lon) {
    $endpoint = "http://api.weatherapi.com/v1/current.json?key=" . $apiKey . "&q=" . $lat . "," . $lon;
    $opts = [
        'http' => [
            'method' => 'GET',
            'header' => "Accept: application/json\r\n"
        ]
    ];
    $context = stream_context_create($opts);
    $response = @file_get_contents($endpoint, false, $context);
    return $response;
}

$response = fetch_weather($apiKey, $lat, $lon);

header('Content-Type: application/json');
echo $response;
?>