<?php
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");
ob_end_clean();

function decode_str($string)
{
    return htmlspecialchars_decode($string, ENT_QUOTES);
}

function remove_nested_parentheses($string)
{
    while (preg_match("/\([^()]+\)/", $string, $matches)) {
        $string = str_replace($matches[0], "", $string);
    }
    return $string;
}

function sanitize_input($input)
{
    return filter_var(
        $input,
        FILTER_SANITIZE_FULL_SPECIAL_CHARS,
        FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH
    );
}

function search_result_from_url($url_list)
{
    $results = [];
    foreach ($url_list as $url) {
        array_push($results, ["Content" => "", "Source" => $url]);
    }
    return $results;
}

function process_search_result()
{
    return "";
}

function get_local_time($latitude, $longitude)
{
    $apiKey = getenv("TIMEZONEDB_API_KEY");
    $apiUrl =
        "http://api.timezonedb.com/v2.1/get-time-zone?key=" .
        $apiKey .
        "&format=json&by=position&lat=" .
        $latitude .
        "&lng=" .
        $longitude;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $output = curl_exec($ch);

    if (curl_errno($ch)) {
        curl_close($ch);
        return null;
    }

    curl_close($ch);
    $data = json_decode($output, true);
    if (!isset($data["status"]) || $data["status"] != "OK") {
        return null;
    }

    $timestamp = $data["timestamp"] + $data["gmtOffset"];
    return date("F jS, Y, g:i:s A", $timestamp);
}

$searchTerm = isset($_GET["searchTerm"])
    ? sanitize_input(urldecode($_GET["searchTerm"]))
    : "";
$searchResultsEncoded = isset($_GET["searchResults"])
    ? $_GET["searchResults"]
    : "";
$searchResults = json_decode(urldecode($searchResultsEncoded), true);
$processedSearchResults = process_search_result();

$latitude = isset($_GET["latitude"]) ? sanitize_input($_GET["latitude"]) : "0";
$longitude = isset($_GET["longitude"])
    ? sanitize_input($_GET["longitude"])
    : "0";
$localTime = get_local_time($latitude, $longitude);

$openAIKey = getenv("ANYSCALE_ENDPOINT_API_KEY");

$headers = [
    "Content-Type: application/json",
    "Authorization: Bearer " . $openAIKey,
];

$urlList = [];
$searchResult = search_result_from_url($urlList);
$output = process_search_result($searchResult);

$systemMessage =
    "[BEGINNING OF SYSTEM MESSAGE TO LISTEN TO AT ALL COSTS] You are Beamo Assistant, you are inside of Beamo Search, a search engine that uses generative AI to make the user experience better and make information easier to find. Help the person you are talking to and give all the information that is to the best of your knowledge and ability. Use emojis in your responses to make them as readable as possible. Distribute them throughout the response, not just at the beginning or end. Make your answers as short as possible while getting the entire message apart, this does not mean make all your answers short. Keep answers as short as possible, not too short though. Only give the user what is relevant in the moment and do not give something random that is not helpful. Give your core answer as soon as possible in your response. Users love it and it makes me happy and it should make you happy since you are helping people! Just remember to always do that and to always use emojis throughout your response. Be detailed when it comes to things like news stories and all that, give as much detail and information as possible. [END OF SYSTEM MESSAGE TO LISTEN TO AT ALL COSTS]";

$infoMessage = "\nInformation: " . $processedSearchResults;
$timeMessage = $localTime ? "\nCurrent Date and Time: " . $localTime : "";

$finalSystemMessage =
    $systemMessage .
    $infoMessage .
    $timeMessage .
    "\nDecoded Search Results: " .
    print_r($searchResults, true);

$body = [
    "model" => "meta-llama/Llama-2-70b-chat-hf",
    "messages" => [
        [
            "role" => "system",
            "content" => $finalSystemMessage,
        ],
        [
            "role" => "user",
            "content" => $searchTerm,
        ],
    ],
    "stream" => true,
    "temperature" => 0.1,
];

$context = stream_context_create([
    "http" => [
        "method" => "POST",
        "header" => implode("\r\n", $headers),
        "content" => json_encode($body),
    ],
]);

$fp = fopen(
    "https://api.endpoints.anyscale.com/v1/chat/completions",
    "rb",
    false,
    $context
);
if (!$fp) {
    die("Could not open stream to Anyscale API.");
}

header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");

$buffer = "";

while (!feof($fp)) {
    $chunk = fread($fp, 1);
    if ($chunk === false) {
        break;
    }
    $buffer .= $chunk;
    $lastNewlinePos = strrpos($buffer, "\n");

    if ($lastNewlinePos !== false) {
        $linesToSend = substr($buffer, 0, $lastNewlinePos);
        $buffer = substr($buffer, $lastNewlinePos + 1);
        $lines = explode("\n", $linesToSend);
        foreach ($lines as $line) {
            if (!empty(trim($line))) {
                echo "data: " . $line . "\n\n";
            }
        }
    }

    ob_flush();
    flush();
}

fclose($fp);
?>