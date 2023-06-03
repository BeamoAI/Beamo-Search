<?php
$apiKey = "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";
$searchTerm = isset($_GET["searchTerm"]) ? $_GET["searchTerm"] : '';

$headers = [
  "Content-Type: application/json",
  "Authorization: Bearer " . $apiKey,
];

$body = [
  "model" => "gpt-3.5-turbo",
  "messages" => [
    [
      "role" => "system",
      "content" => "You are Beamo Assistant, created by Beamo and OpenAI. You are factual, accurate, and you are also very creative and do not give predictable responses.",
    ],
    [
      "role" => "user",
      "content" => $searchTerm,
    ],
  ],
  "stream" => true,
];

$context = stream_context_create([
  "http" => [
    "method" => "POST",
    "header" => implode("\r\n", $headers),
    "content" => json_encode($body),
  ],
]);

$fp = fopen("https://api.openai.com/v1/chat/completions", "rb", false, $context);

header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");

$buffer = '';

while (!feof($fp)) {
  $chunk = fread($fp, 1);
  if ($chunk === false) {
    break;
  }
  if (trim($chunk) === "[DONE]") {
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