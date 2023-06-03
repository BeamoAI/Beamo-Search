<?php
$api_key = "hTPFyCKlXas2fMnTWGaZXHahmTKOLSYMODZjtOKSp0RZGSJjhD9tQ3DzBP5v";

function generate_image($prompt, $size = "512x512", $n = 1) {
    $api_key = $GLOBALS['api_key'];

    $headers = [
        "Content-Type: application/json",
        "Authorization: Bearer {$api_key}"
    ];

    $data = [
        "key" => $api_key,
        "prompt" => $prompt,
        "samples" => $n,
        "width" => explode("x", $size)[0],
        "height" => explode("x", $size)[1],
        "num_inference_steps" => 20,
        "guidance_scale" => 7.5,
        "safety_checker" => "yes",
        "enhance_prompt" => "yes"
    ];

    $context = stream_context_create([
        "http" => [
            "method" => "POST",
            "header" => implode("\r\n", $headers),
            "content" => json_encode($data)
        ]
    ]);

    $response = file_get_contents("https://stablediffusionapi.com/api/v3/text2img", false, $context);
    $response_json = json_decode($response, true);

    if (isset($response_json["output"]) && count($response_json["output"]) > 0) {
        $image_url = $response_json["output"][0];
        return $image_url;
    } else {
        return null;
    }
}

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

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
?>