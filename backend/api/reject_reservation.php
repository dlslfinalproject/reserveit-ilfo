<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require_once '../config/db.php';
require_once 'email_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (
    !isset($data['reservation_id']) ||
    !isset($data['rejection_reason_id'])
) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}

$reservation_id = $data['reservation_id'];
$reason_id = $data['rejection_reason_id'];
$rejection_other_notes = isset($data['rejection_other_notes']) ? trim($data['rejection_other_notes']) : null;

try {
    $pdo = getDbConnection();

    $stmt = $pdo->prepare("
        SELECT s.status_name 
        FROM tblreservations r
        JOIN tblapproval_status s ON r.status_id = s.status_id
        WHERE r.reservation_id = ?
    ");
    $stmt->execute([$reservation_id]);
    $existing = $stmt->fetch();

    if (!$existing) {
        echo json_encode(['success' => false, 'message' => 'Reservation not found.']);
        exit;
    }

    if (strtolower($existing['status_name']) !== 'pending') {
        echo json_encode(['success' => false, 'message' => 'Reservation cannot be rejected because it is already processed.']);
        exit;
    }

  
    $stmt = $pdo->prepare("SELECT status_id FROM tblapproval_status WHERE LOWER(status_name) = 'rejected'");
    $stmt->execute();
    $statusRow = $stmt->fetch();

    if (!$statusRow) {
        echo json_encode(['success' => false, 'message' => 'Rejected status not found.']);
        exit;
    }

    $rejected_status_id = $statusRow['status_id'];

    $stmt = $pdo->prepare("SELECT reason_description FROM tblrejection_reasons WHERE reason_id = ?");
    $stmt->execute([$reason_id]);
    $reasonRow = $stmt->fetch(PDO::FETCH_ASSOC);

    $reasonDescription = $reasonRow ? $reasonRow['reason_description'] : 'Unspecified';

    $stmt = $pdo->prepare("
        UPDATE tblreservations 
        SET status_id = ?, 
            rejection_reason_id = ?, 
            rejection_other_notes = ?, 
            updated_at = NOW() 
        WHERE reservation_id = ?
    ");
    $stmt->execute([$rejected_status_id, $reason_id, $rejection_other_notes, $reservation_id]);

    $stmt = $pdo->prepare("
        SELECT u.email, u.first_name, r.event_name, r.reservation_startdate, r.reservation_enddate
        FROM tblreservations r
        JOIN tblusers u ON r.user_id = u.id
        WHERE r.reservation_id = ?
    ");
    $stmt->execute([$reservation_id]);
    $reservationInfo = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($reservationInfo) {
        $userEmail = $reservationInfo['email'];
        $userName = $reservationInfo['first_name'];
        $eventName = $reservationInfo['event_name'];
        $start = $reservationInfo['reservation_startdate'];
        $end = $reservationInfo['reservation_enddate'];

        $subject = "Reservation Rejected";
        $message = "
            <h3>Hi {$userName},</h3>
            <p>We regret to inform you that your reservation for <strong>{$eventName}</strong> 
            from <strong>{$start}</strong> to <strong>{$end}</strong> has been <strong>Rejected</strong>.</p>
            <p><strong>Reason:</strong> {$reasonDescription}</p>";

        if (!empty($rejection_other_notes)) {
            $message .= "<p><strong>Additional Notes:</strong> {$rejection_other_notes}</p>";
        }

        $message .= "<p>If you have any questions, please contact the administrator.</p>
            <p>Thank you for using ReserveIT.</p>";

        sendEmail($userEmail, $subject, $message);
    }

    echo json_encode(['success' => true, 'message' => 'Reservation rejected and email sent.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
