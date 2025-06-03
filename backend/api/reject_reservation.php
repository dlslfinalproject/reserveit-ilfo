<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

if (
    !isset($data['reservation_id']) ||
    !isset($data['rejection_reason_id']) ||
    !isset($data['rejection_other_notes'])
) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}

$reservation_id = $data['reservation_id'];
$rejection_reason_id = $data['rejection_reason_id'];
$rejection_other_notes = trim($data['rejection_other_notes']);

try {
    $pdo = getDbConnection();

    // Get the current status of the reservation
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

    // Get the status ID for "rejected"
    $stmt = $pdo->prepare("SELECT status_id FROM tblapproval_status WHERE LOWER(status_name) = 'rejected'");
    $stmt->execute();
    $statusRow = $stmt->fetch();

    if (!$statusRow) {
        echo json_encode(['success' => false, 'message' => 'Rejected status not found.']);
        exit;
    }

    $rejected_status_id = $statusRow['status_id'];

    // Update the reservation
    $stmt = $pdo->prepare("
        UPDATE tblreservations 
        SET status_id = ?, 
            rejection_reason_id = ?, 
            rejection_other_notes = ?, 
            updated_at = NOW() 
        WHERE reservation_id = ?
    ");
    $stmt->execute([$rejected_status_id, $rejection_reason_id, $rejection_other_notes, $reservation_id]);

    echo json_encode(['success' => true, 'message' => 'Reservation rejected successfully.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
