<?php

$api_key = getenv('API_KEY');
$max_attempts = 3;
$default_image = "default.jpg";

function generate_image($prompt, $size = "1024x1024", $n = 1) {
  $api_key = getenv('API_KEY');
  
  $headers = [
    "Content-Type: application/json",
    "Authorization: Bearer {$api_key}"
  ];

  $data = [
    "model" => "dall-e-3",
    "prompt" => $prompt,
    "n" => $n,
    "size" => $size,
  ];

  $context = stream_context_create([
    "http" => [
      "method" => "POST",
      "header" => implode("\r\n", $headers),
      "content" => json_encode($data)
    ]
  ]);

  $max_attempts = $GLOBALS['max_attempts'];
  $attempt = 0;
  
  while ($attempt < $max_attempts) {
    $response = @file_get_contents("https://api.openai.com/v1/images/generations", false, $context);
    if ($response === false) {
      error_log("Failed to generate image URL: " . error_get_last()['message']);
      $attempt++;
      continue;
    }
    $response_json = json_decode($response, true);
    
    if (isset($response_json["data"]) && count($response_json["data"]) > 0) {
      $image_url = $response_json["data"][0]["url"];
      if($image_url) {
        return $image_url;
      }
    }
    $attempt++;
  }

  error_log("Failed to generate image URL after $max_attempts attempts");
  return $GLOBALS['default_image'];  
}

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $post_data = json_decode(file_get_contents('php://input'), true);

  if (!isset($post_data["prompt"])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No prompt provided"]);
    exit;
  }

  $prompt = $post_data["prompt"];
  $image_url = generate_image($prompt);

  if ($image_url) {
    echo json_encode(["status" => "success", "image_url" => $image_url]);
  } else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to generate image URL"]); 
  }
}