<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit();
}

// Required fields
$requiredFields = [
    'user_id', 'who_reserved', 'event_name', 'reservation_startdate', 
    'reservation_enddate', 'number_of_participants', 'start_time', 'end_time'
];

// Check required fields
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || $data[$field] === '') {
        http_response_code(400);
        echo json_encode(["error" => "Missing or empty field: $field"]);
        exit();
    }
}

// Optional fields with defaults
$activity_id = isset($data['activity_id']) ? $data['activity_id'] : null;
$custom_activity = isset($data['custom_activity']) ? $data['custom_activity'] : null;
$notes = isset($data['notes']) ? $data['notes'] : '';
$link_to_csao_approved_poa = isset($data['link_to_csao_approved_poa']) ? $data['link_to_csao_approved_poa'] : '';

$approval_status = 0; // Pending

// SQL query: if custom_activity is given, insert it instead of activity_id
// Assuming your DB has either activity_id OR custom_activity, add custom_activity field if needed
$query = "INSERT INTO reservations (
    user_id, who_reserved, event_name, activity_id, custom_activity,
    reservation_startdate, reservation_enddate, number_of_participants, start_time, end_time,
    notes, link_to_csao_approved_poa, approval_status
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($query);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to prepare statement: " . $conn->error]);
    exit();
}

$activity_id = $activity_id !== '' ? $activity_id : null;
$custom_activity = $custom_activity !== '' ? $custom_activity : null;


$stmt->bind_param(
    "isssisisssssi",
    $data['user_id'],
    $data['who_reserved'],
    $data['event_name'],
    $activity_id,
    $custom_activity,
    $data['reservation_startdate'],
    $data['reservation_enddate'],
    $data['number_of_participants'],
    $data['start_time'],
    $data['end_time'],
    $notes,
    $link_to_csao_approved_poa,
    $approval_status
);


if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Reservation successfully created."]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to create reservation", "details" => $stmt->error]);
}

$stmt->close();
$conn->close();
