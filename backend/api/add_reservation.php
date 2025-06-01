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
    http_response_code(200);
    exit();
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
$activity_id = !empty($data['activity_id']) ? $data['activity_id'] : null;
$custom_activity_name = !empty($data['custom_activity_name']) ? $data['custom_activity_name'] : null;
$notes = isset($data['notes']) ? $data['notes'] : '';
$link_to_csao_approved_poa = isset($data['link_to_csao_approved_poa']) ? $data['link_to_csao_approved_poa'] : '';
$status_id = 1; // Pending

try {
    $pdo = getDbConnection(); // ✅ Use PDO connection

    $query = "INSERT INTO tblreservations (
        user_id, who_reserved, event_name, activity_id, custom_activity_name,
        reservation_startdate, reservation_enddate, number_of_participants,
        start_time, end_time, notes, link_to_csao_approved_poa, status_id
    ) VALUES (
        :user_id, :who_reserved, :event_name, :activity_id, :custom_activity_name,
        :reservation_startdate, :reservation_enddate, :number_of_participants,
        :start_time, :end_time, :notes, :poa_link, :status
    )";

    $stmt = $pdo->prepare($query);

    $stmt->execute([
        ':user_id' => $data['user_id'],
        ':who_reserved' => $data['who_reserved'],
        ':event_name' => $data['event_name'],
        ':activity_id' => $activity_id,
        ':custom_activity_name' => $custom_activity_name,
        ':reservation_startdate' => $data['reservation_startdate'],
        ':reservation_enddate' => $data['reservation_enddate'],
        ':number_of_participants' => $data['number_of_participants'],
        ':start_time' => $data['start_time'],
        ':end_time' => $data['end_time'],
        ':notes' => $notes,
        ':poa_link' => $link_to_csao_approved_poa,
        ':status' => $status_id,
    ]);

    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Reservation successfully created."]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
}
