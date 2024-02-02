<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function sanitize_input($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

function validate_ip($ip) {
    return filter_var($ip, FILTER_VALIDATE_IP);
}

function get_geo_location($ip) {
    static $cache = [];
    if (isset($cache[$ip])) {
        return $cache[$ip];
    }

    $api_key = getenv('IP_API_GEOLOCATION_API_KEY');
    $url = "https://ipapi.co/{$ip}/json/?key={$api_key}";

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $json = curl_exec($ch);

    if ($json === false) {
        throw new Exception('cURL Error: ' . curl_error($ch));
    }

    curl_close($ch);

    $data = json_decode($json, TRUE);
    $cache[$ip] = $data;

    return $data;
}

$apiType = sanitize_input($_GET['apiType'] ?? '');
$searchTerm = sanitize_input($_GET['searchTerm'] ?? '');
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

$userIp = $_GET['userIp'] ?? null;
$sentLat = $_GET['latitude'] ?? null;
$sentLong = $_GET['longitude'] ?? null;

if ($userIp) {
    $userIp = sanitize_input($userIp);
    if (!validate_ip($userIp)) {
        die('Invalid IP address');
    }
}

function fetch_with_news_api_key($apiKey, $searchTerm, $offset) {
    $count = 55;
    $endpoint = "https://api.bing.microsoft.com/v7.0/news/search?q=" . urlencode($searchTerm) . "&offset=" . $offset . "&count=" . $count;

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Accept: application/json",
        "Referer: ",
        "Ocp-Apim-Subscription-Key: $apiKey"
    ]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);

    if ($response === false) {
        throw new Exception('cURL Error: ' . curl_error($ch));
    }

    curl_close($ch);

    return $response;
}

function fetch_with_image_api_key($apiKey, $searchTerm, $offset) {
    $count = 105;
    $endpoint = "https://api.bing.microsoft.com/v7.0/images/search?q=" . urlencode($searchTerm) . "&subscription-key=" . $apiKey . "&offset=" . $offset . "&count=" . $count;

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Accept: application/json",
        "Referer: ",
        "subscription-key: $apiKey"
    ]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);

    if ($response === false) {
        throw new Exception('cURL Error: ' . curl_error($ch));
    }

    curl_close($ch);

    return $response;
}

function fetch_with_video_api_key($apiKey, $searchTerm, $offset) {
    $count = 55;
    $endpoint = "https://api.bing.microsoft.com/v7.0/videos/search?q=" . urlencode($searchTerm) . "&subscription-key=" . $apiKey . "&offset=" . $offset . "&count=" . $count;

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Accept: application/json",
        "Referer: ",
        "subscription-key: $apiKey"
    ]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);

    if ($response === false) {
        throw new Exception('cURL Error: ' . curl_error($ch));
    }

    curl_close($ch);

    return $response;
}

function fetch_with_api_key($apiKey, $searchTerm, $offset, $userIp, $sentLat = null, $sentLong = null) {
    static $geoCache = [];
    $count = 10;

    $lat = $sentLat;
    $long = $sentLong;

    if ($sentLat === null || $sentLong === null) {
        if (isset($geoCache[$userIp])) {
            $geoData = $geoCache[$userIp];
        } else {
            $geoData = get_geo_location($userIp);
            $geoCache[$userIp] = $geoData;
        }
        $lat = $geoData['latitude'] ?? null;
        $long = $geoData['longitude'] ?? null;
    }

    $re = ($lat !== null && $long !== null) ? 22 : 18000;

    $endpoint = "https://api.bing.microsoft.com/v7.0/search?q=" . urlencode($searchTerm) . "&subscription-key=" . $apiKey . "&offset=" . $offset . "&count=" . $count;

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    $headers = [
        "Accept: application/json",
        "Referer: ",
        "subscription-key: $apiKey",
    ];
    if ($lat && $long) {
        $headers[] = "X-Search-Location: lat:$lat;long:$long;re:$re";
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);

    if ($response === false) {
        throw new Exception('cURL Error: ' . curl_error($ch));
    }

    curl_close($ch);

    $searchResults = json_decode($response, true);

    $searchResults['latitude'] = $lat;
    $searchResults['longitude'] = $long;

    return json_encode($searchResults);
}           

    if ($apiType == 'images') {
        $apiKey1 = getenv('bing_image_search_api_key1');
        $apiKey2 = getenv('bing_image_search_api_key2');
        $response = fetch_with_image_api_key($apiKey1, $searchTerm, $offset);
        if ($response === false) {
            $response = fetch_with_image_api_key($apiKey2, $searchTerm, $offset);
        }
    } elseif ($apiType == 'videos') {
        $apiKey1 = getenv('bing_video_search_api_key1');
        $apiKey2 = getenv('bing_video_search_api_key2');
        $response = fetch_with_video_api_key($apiKey1, $searchTerm, $offset);
        if ($response === false) {
            $response = fetch_with_video_api_key($apiKey2, $searchTerm, $offset);
        }
    } elseif ($apiType == 'news') {
        $apiKey1 = getenv('bing_news_search_api_key1');
        $apiKey2 = getenv('bing_news_search_api_key2');
        $response = fetch_with_news_api_key($apiKey1, $searchTerm, $offset);
        if ($response === false) {
            $response = fetch_with_news_api_key($apiKey2, $searchTerm, $offset);
        }
    } else {
        $apiKey1 = getenv('bing_web_search_api_key1');
        $apiKey2 = getenv('bing_web_search_api_key2');
    
        $response = fetch_with_api_key($apiKey1, $searchTerm, $offset, $userIp, $sentLat, $sentLong);
        if ($response === false) {
            $response = fetch_with_api_key($apiKey2, $searchTerm, $offset, $userIp, $sentLat, $sentLong);
        }
    }    

header('Content-Type: application/json');
if ($apiType == 'merriamWebster') {
    echo json_encode([$response]);
} else {
    echo $response;
}
?>