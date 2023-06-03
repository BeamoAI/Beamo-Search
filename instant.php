<?php
$apiKey = "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";
$searchTerm = isset($_GET["searchTerm"]) ? $_GET["searchTerm"] : '';

$headers = [
  "Content-Type: application/json",
  "Authorization: Bearer " . $apiKey,
];

$body = [
  "model" => "text-embedding-ada-002",
  "input" => $searchTerm
];

$context = stream_context_create([
  "http" => [
    "method" => "POST",
    "header" => implode("\r\n", $headers),
    "content" => json_encode($body),
  ],
]);

$fp = fopen("https://api.openai.com/v1/embeddings", "rb", false, $context);

header("Content-Type: application/json");
header("Cache-Control: no-cache");
header("Connection: keep-alive");

$buffer = '';

while (!feof($fp)) {
  $chunk = fread($fp, 4096);
  if ($chunk === false) {
    break;
  }
  
  $buffer .= $chunk;
}

$response = json_decode($buffer, true);
$embedding = [];

if (isset($response["data"][0]["embedding"])) {
  foreach ($response["data"][0]["embedding"] as $value) {
    $embedding[] = is_numeric($value) ? $value : 0;
  }
}

echo json_encode($embedding);

fclose($fp);
?>