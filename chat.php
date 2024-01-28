<?php
session_start();

function sanitize_input($input) {
    return htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function get_gmt_time() {
    return date('F jS, Y, g:i:s A');
}

$userMessage = isset($_GET["userMessage"]) ? sanitize_input($_GET["userMessage"]) : '';
$assistantMessage = isset($_GET["assistantMessage"]) ? sanitize_input($_GET["assistantMessage"]) : '';

if (!isset($_SESSION['conversation'])) {
    $_SESSION['conversation'] = array();

    if (!empty($userMessage)) {
        array_push($_SESSION['conversation'], "Human: " . $userMessage);
    }
    if (!empty($assistantMessage)) {
        array_push($_SESSION['conversation'], "Assistant: " . $assistantMessage);
    }
} else {
    if (!empty($userMessage)) {
        array_push($_SESSION['conversation'], "Human: " . $userMessage);
    }
    if (!empty($assistantMessage)) {
        array_push($_SESSION['conversation'], "Assistant: " . $assistantMessage);
    }
}

$conversationLength = count($_SESSION['conversation']);
if ($conversationLength > 30) {
    $_SESSION['conversation'] = array_slice($_SESSION['conversation'], -30);
}

$currentGmtTime = get_gmt_time();
$contextConversation = implode("\n\n", $_SESSION['conversation']);

session_write_close();

$claudekey = getenv('claude_key');
$headers = [
    "Content-Type: application/json",
    "x-api-key: " . $claudekey,
];

$systemPrompt = "You are Beamo Assistant, you are inside of Beamo Search, a search engine that uses generative AI to make the user experience better and make information easier to find. The current GMT date and time is " . $currentGmtTime . ". Help the person you are talking to and give all the information that is to the best of your knowledge and ability. Use emojis in your responses to make them as readable as possible. Distribute them throughout the response, not just at the beginning or end. Do not cite sources in your responses. Make your answers as short as possible. Remember to not cite sources. Keep answers as short as possible. Only give the user what is relevant in the moment and do not give something random that is not helpful. Just make your responses as short as possible. Give your core answer as soon as possible in your response. Users love it and it makes me happy and it should make you happy since you are helping people! Just remember to always do that. Remember to not cite or mention any of your sources ever.";

$body = [
    "model" => "claude-2.1",
    "prompt" => $systemPrompt . "\n\n" . $contextConversation . "\n\nAssistant: ",
    "max_tokens_to_sample" => 3000,
    "stream" => true,
];

$context = stream_context_create([
    "http" => [
        "method" => "POST",
        "header" => implode("\r\n", $headers),
        "content" => json_encode($body),
    ],
]);

$fp = fopen("https://api.anthropic.com/v1/complete", "rb", false, $context);

header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");

$buffer = '';
$assistantMessage = '';

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
                if (strpos($line, 'completion') !== false) {
                    $response = json_decode(substr($line, 5), true);
                    $assistantMessage = "Assistant: " . $response['completion'];
                }
            }
        }
    }

    ob_flush();
    flush();
}

fclose($fp);

session_start();
if (!empty($assistantMessage)) {
    array_push($_SESSION['conversation'], $assistantMessage);
}
session_write_close();
?>