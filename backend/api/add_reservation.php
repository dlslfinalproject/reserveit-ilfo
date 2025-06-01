<?php
require_once '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents("php://input"), true);

// Define required fields
$requiredFields = [
    'user_id', 'who_reserved', 'event_name', 'activity_id',
    'reservation_startdate', 'reservation_enddate',
    'number_of_participants', 'start_time', 'end_time',
];

// Check for missing fields
foreach ($requiredFields as $field) {
    if (!isset($data[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing field: $field"]);
        exit();
    }
}

// Set optional fields
$venue_id = isset($data['venue_id']) ? $data['venue_id'] : null;

// Prepare the SQL insert statement
$query = "INSERT INTO reservations (
    user_id, who_reserved, event_name, activity_id,
    venue_id, reservation_startdate, reservation_enddate,
    number_of_participants, start_time, end_time,
    notes, link_to_csao_approved_poa, approval_status
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($query);

$approval_status = 0; // Default to 'Pending'

// Bind parameters
$stmt->bind_param(
    "issiiissssssi",
    $data['user_id'],
    $data['who_reserved'],
    $data['event_name'],
    $data['activity_id'],
    $venue_id,
    $data['reservation_startdate'],
    $data['reservation_enddate'],
    $data['number_of_participants'],
    $data['start_time'],
    $data['end_time'],
    $data['notes'],
    $data['link_to_csao_approved_poa'],
    $approval_status
);

// Execute and return result
if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(["message" => "Reservation successfully created."]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Unable to create reservation.", "details" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
