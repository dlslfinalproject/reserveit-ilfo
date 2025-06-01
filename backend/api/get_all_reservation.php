<?php
require_once '../config/db.php';
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

try {
    $pdo = getDbConnection();

    $sql = "
        SELECT 
            r.reservation_id,
            u.first_name, u.last_name,
            r.event_name,
            a.activity_name,
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
        JOIN tblactivities a ON r.activity_id = a.activity_id
        JOIN tblvenues v ON r.venue_id = v.venue_id
        JOIN tblapproval_status s ON r.status_id = s.status_id
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = array_map(function ($row) {
        return [
            'reservation_id' => (int)$row['reservation_id'],
            'whoReserved' => $row['first_name'] . ' ' . $row['last_name'],
            'nameOfProgram' => $row['event_name'],
            'natureOfActivity' => $row['activity_name'],
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

    echo json_encode(['reservations' => $response]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database query failed.']);
}
