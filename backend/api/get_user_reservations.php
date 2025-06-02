<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized. Please log in."
    ]);
    exit;
}

include_once "../config/db.php";

// Get the PDO connection
$conn = getDbConnection();

$user_id = $_SESSION['user_id'];

try {
    $query = "
        SELECT 
            r.reservation_id,
            u.first_name, u.last_name,
            r.event_name,
            a.activity_name,
            r.custom_activity_name,
            v.venue_name,
            r.reservation_startdate,
            r.reservation_enddate,
            r.start_time,
            r.end_time,
            r.number_of_participants,
            s.status_name AS status,
            r.link_to_csao_approved_poa AS poa_link,
            r.notes
        FROM tblreservations r
        JOIN tblusers u ON r.user_id = u.id
        LEFT JOIN tblactivities a ON r.activity_id = a.activity_id
        LEFT JOIN tblvenues v ON r.venue_id = v.venue_id
        LEFT JOIN tblapproval_status s ON r.status_id = s.status_id
        WHERE r.user_id = ?
        ORDER BY r.reservation_startdate DESC
    ";

    $stmt = $conn->prepare($query);
    $stmt->execute([$user_id]);

    $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = array_map(function ($row) {
        return [
            'reservation_id' => (int)$row['reservation_id'],
            'whoReserved' => $row['first_name'] . ' ' . $row['last_name'],
            'nameOfProgram' => $row['event_name'],
            'natureOfActivity' => !empty($row['custom_activity_name']) ? $row['custom_activity_name'] : $row['activity_name'],
            'venue' => $row['venue_name'],
            'numberOfParticipants' => (int)$row['number_of_participants'],
            'startDate' => $row['reservation_startdate'],
            'endDate' => $row['reservation_enddate'],
            'time' => [
                'start' => $row['start_time'],
                'end' => $row['end_time'],
            ],
            'status' => $row['status'],
            'poaLink' => $row['poa_link'],
            'notes' => $row['notes'],
        ];
    }, $reservations);

    echo json_encode([
        "success" => true,
        "reservations" => $response
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
