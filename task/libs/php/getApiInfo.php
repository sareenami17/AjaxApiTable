<?php

ini_set('display_errors', '1');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$api = $_REQUEST['api'];
$url = '';

switch ($api) {
    case 'countryInfo':
        $country = $_REQUEST['country'];
        $lang = $_REQUEST['lang'];
        $url = "http://api.geonames.org/countryInfoJSON?formatted=true&lang=$lang&country=$country&username=sareenami17&style=full";
        break;
    case 'timezone':
        $lat = $_REQUEST['lat'];
        $lng = $_REQUEST['lng'];
        $url = "http://api.geonames.org/timezoneJSON?formatted=true&lat=$lat&lng=$lng&username=sareenami17";
        break;
    case 'findNearbyPlaceName':
        $lat = $_REQUEST['lat'];
        $lng = $_REQUEST['lng'];
        $url = "http://api.geonames.org/findNearbyPlaceNameJSON?formatted=true&lat=$lat&lng=$lng&username=sareenami17";
        break;
    default:
        echo json_encode(["status" => ["code" => 400, "name" => "failed", "description" => "Invalid API"]]);
        exit;
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

if ($result === false) {
    echo json_encode([
        "status" => [
            "code" => curl_errno($ch),
            "name" => "failed",
            "description" => curl_error($ch)
        ]
    ]);
    curl_close($ch);
    exit;
}

curl_close($ch);

$decode = json_decode($result, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        "status" => [
            "code" => 500,
            "name" => "failed",
            "description" => "JSON decode error: " . json_last_error_msg()
        ]
    ]);
    exit;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode['geonames'] ?? $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

?>
