<?php
$apiType = $_GET['apiType'];
$searchTerm = $_GET['searchTerm'];
$offset = isset($_GET['offset']) ? $_GET['offset'] : 0;

function fetch_weather_api($apiKey, $lat, $lon, $days, $city = null) {
    $endpoint = "http://api.weatherapi.com/v1/forecast.json?key=" . $apiKey . "&q=" . ($city ? $city : $lat . "," . $lon) . "&days=" . $days . "&hourly=24";
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

function fetch_with_news_api_key($apiKey, $searchTerm, $offset) {
    $count = 55;
    $endpoint = "https://api.bing.microsoft.com/v7.0/news/search?q=" . urlencode($searchTerm) . "&offset=" . $offset . "&mkt=en-US" . "&count=" . $count;
    $opts = [
        'http' => [
            'method' => 'GET',
            'header' => "Ocp-Apim-Subscription-Key: $apiKey\r\n" . "Accept: application/json\r\n"
        ]
    ];
    $context = stream_context_create($opts);
    $response = @file_get_contents($endpoint, false, $context);
    return $response;
}

function fetch_google_maps($apiKey, $searchTerm) {
    $endpoint = "https://www.google.com/maps/embed/v1/search?q=" . urlencode($searchTerm) . "&key=" . $apiKey;
    return $endpoint;
}

function fetch_with_image_api_key($apiKey, $searchTerm, $offset) {
    $count = 105;
    $endpoint = "https://api.bing.microsoft.com/v7.0/images/search?q=" . urlencode($searchTerm) . "&subscription-key=" . $apiKey . "&offset=" . $offset . "&count=" . $count;
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

function fetch_with_video_api_key($apiKey, $searchTerm, $offset) {
    $count = 55;
    $endpoint = "https://api.bing.microsoft.com/v7.0/videos/search?q=" . urlencode($searchTerm) . "&subscription-key=" . $apiKey . "&offset=" . $offset . "&count=" . $count;
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

function fetch_with_api_key($apiKey, $searchTerm, $offset) {
    $count = 25;
    $endpoint = "https://api.bing.microsoft.com/v7.0/search?q=" . urlencode($searchTerm) . "&subscription-key=" . $apiKey . "&offset=" . $offset . "&count=" . $count;
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

function fetch_merriam_webster_definitions($apiKey, $searchTerm) {
    $endpoint = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" . urlencode($searchTerm) . "?key=" . $apiKey;
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

function fetch_autosuggest_results($apiKey1, $apiKey2, $searchTerm) {
    $response = fetch_autosuggest_with_api_key($apiKey1, $searchTerm);
    if (!$response) {
        $response = fetch_autosuggest_with_api_key($apiKey2, $searchTerm);
    }
    return $response;
}

function fetch_autosuggest_with_api_key($apiKey, $searchTerm) {
    $endpoint = "https://api.bing.microsoft.com/v7.0/suggestions?q=" . urlencode($searchTerm) . "&subscription-key=" . $apiKey;
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

if ($apiType == 'merriamWebster') {
    $merriamWebsterApiKey = 'aa546e57-8a99-4ed8-b8e1-a11fe5df467e';
    $response = fetch_merriam_webster_definitions($merriamWebsterApiKey, $searchTerm);
} elseif ($apiType == 'autosuggest') {
    $apiKey1 = '31acff7fbe044d9bab0bd40976ac8c2f';
    $apiKey2 = 'e10549f9d69b46e1ae525d416742281b';
    $response = fetch_autosuggest_results($apiKey1, $apiKey2, $searchTerm);
} elseif ($apiType == 'images') {
    $apiKey1 = '8e9afa34e5ad4ed1b7fa562743d7b2e1';
    $apiKey2 = 'f15fd28027cf4913aae8988257ab0acc';
    $response = fetch_with_image_api_key($apiKey1, $searchTerm, $offset);
    if (!$response) {
        $response = fetch_with_image_api_key($apiKey2, $searchTerm, $offset);
    }
} elseif ($apiType == 'videos') {
    $apiKey1 = '8e9afa34e5ad4ed1b7fa562743d7b2e1';
    $apiKey2 = 'f15fd28027cf4913aae8988257ab0acc';
    $response = fetch_with_video_api_key($apiKey1, $searchTerm, $offset);
    if (!$response) {
        $response = fetch_with_video_api_key($apiKey2, $searchTerm, $offset);
    }
} elseif ($apiType == 'maps') {
    $apiKey = 'AIzaSyAum7fXVwoss86yJDbHCoAOwwomhBVJor0';
    $response = fetch_google_maps($apiKey, $searchTerm);
 } elseif ($apiType == 'forecast') {
        $weatherApiKey = 'cb70b6bdd3c845829aa121546231104';
        $city = isset($_GET['city']) ? $_GET['city'] : null;
        if($city) {
            $response = fetch_weather_api($weatherApiKey, null, null, $days, $city);
        } else {
            $lat = $_GET['lat'];
            $lon = $_GET['lon'];
            $days = $_GET['days'];
            $response = fetch_weather_api($weatherApiKey, $lat, $lon, $days);
        }
} elseif ($apiType == 'news') {
    $apiKey1 = '8e9afa34e5ad4ed1b7fa562743d7b2e1';
    $apiKey2 = 'f15fd28027cf4913aae8988257ab0acc';
    $response = fetch_with_news_api_key($apiKey1, $searchTerm, $offset);
    if (!$response) {
        $response = fetch_with_news_api_key($apiKey2, $searchTerm, $offset);
    }
} else {
    $apiKey1 = '8e9afa34e5ad4ed1b7fa562743d7b2e1';
    $apiKey2 = 'e10549f9d69b46e1ae525d416742281b';
    $response = fetch_with_api_key($apiKey1, $searchTerm, $offset);
    if (!$response) {
        $response = fetch_with_api_key($apiKey2, $searchTerm, $offset);
    }
}

header('Content-Type: application/json');
if ($apiType == 'merriamWebster') {
    echo json_encode([$response]);
} else {
    echo $response;
}
?>