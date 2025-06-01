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

$required_fields = [
    'user_id', 'who_reserved', 'event_name', 'activity_id', 'reservation_startdate', 'reservation_enddate',
    'number_of_participants', 'start_time', 'end_time'
];

foreach ($required_fields as $field) {
    if (empty($data[$field]) && $data[$field] !== "0") {
        http_response_code(400);
        echo json_encode(["error" => "Missing required field: $field"]);
        exit();
    }
}

$notes = isset($data['notes']) ? $data['notes'] : null;
$link_to_csao_approved_poa = isset($data['link_to_csao_approved_poa']) ? $data['link_to_csao_approved_poa'] : null;

$status_id = 1;

try {
    $pdo = getDbConnection();

    $sql = "
        INSERT INTO tblreservations (
            user_id, who_reserved, event_name, activity_id, venue_id,
            reservation_startdate, reservation_enddate, number_of_participants,
            start_time, end_time, status_id, notes, link_to_csao_approved_poa
        ) VALUES (
            :user_id, :who_reserved, :event_name, :activity_id, :venue_id,
            :reservation_startdate, :reservation_enddate, :number_of_participants,
            :start_time, :end_time, :status_id, :notes, :link_to_csao_approved_poa
        )
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':user_id' => $data['user_id'],
        ':who_reserved' => $data['who_reserved'],
        ':event_name' => $data['event_name'],
        ':activity_id' => $data['activity_id'],
        ':venue_id' => $venue_id,
        ':reservation_startdate' => $data['reservation_startdate'],
        ':reservation_enddate' => $data['reservation_enddate'],
        ':number_of_participants' => $data['number_of_participants'],
        ':start_time' => $data['start_time'],
        ':end_time' => $data['end_time'],
        ':status_id' => $status_id,
        ':notes' => $notes,
        ':link_to_csao_approved_poa' => $link_to_csao_approved_poa,
    ]);

    echo json_encode([
        "success" => true,
        "reservation_id" => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database insert failed: " . $e->getMessage()]);
}
