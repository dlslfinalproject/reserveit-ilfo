<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../config/db.php';
require_once 'email_helper.php'; 


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['id'], $input['status'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit;
}

$id = intval($input['id']);
$status = trim($input['status']);

$allowedStatuses = ['Pending', 'Approved', 'Rejected'];
if (!in_array($status, $allowedStatuses)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid status value']);
    exit;
}

try {
    $pdo = getDbConnection();

    // Get new status ID
    $stmt = $pdo->prepare('SELECT status_id FROM tblapproval_status WHERE status_name = :status');
    $stmt->execute(['status' => $status]);
    $statusRow = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$statusRow) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Status not found in database']);
        exit;
    }

    $statusId = $statusRow['status_id'];

    $stmt = $pdo->prepare('
        SELECT r.status_id, s.status_name 
        FROM tblreservations r 
        JOIN tblapproval_status s ON r.status_id = s.status_id 
        WHERE r.reservation_id = :id
    ');
    $stmt->execute(['id' => $id]);
    $currentRow = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$currentRow) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Reservation not found']);
        exit;
    }

    $currentStatus = $currentRow['status_name'];

    if (strtolower($currentStatus) === 'rejected') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Cannot change status. Reservation has already been rejected.']);
        exit;
    }

    if (strtolower($currentStatus) === 'approved' && strtolower($status) !== 'approved') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Cannot change status. Reservation has already been approved.']);
        exit;
    }

    $stmt = $pdo->prepare('UPDATE tblreservations SET status_id = :status_id WHERE reservation_id = :id');
    $stmt->execute(['status_id' => $statusId, 'id' => $id]);

    if ($stmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Status unchanged.']);
        exit;
    }

    $stmt = $pdo->prepare('
        SELECT r.event_name, r.reservation_startdate, r.reservation_enddate, u.email, u.first_name
        FROM tblreservations r
        JOIN tblusers u ON r.user_id = u.user_id
        WHERE r.reservation_id = :id
    ');
    $stmt->execute(['id' => $id]);
    $reservationInfo = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($reservationInfo && in_array($status, ['Approved', 'Rejected'])) {
        $userEmail = $reservationInfo['email'];
        $userName = $reservationInfo['first_name'];
        $eventName = $reservationInfo['event_name'];
        $start = $reservationInfo['reservation_startdate'];
        $end = $reservationInfo['reservation_enddate'];

        $subject = "Reservation {$status}";
        $message = "
            <h3>Hi {$userName},</h3>
            <p>Your reservation for <strong>{$eventName}</strong> from <strong>{$start}</strong> to <strong>{$end}</strong> has been <strong>{$status}</strong>.</p>
            <p>Thank you for using the ReserveIT reservation system.</p>
        ";

        sendEmail($userEmail, $subject, $message);
    }

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
