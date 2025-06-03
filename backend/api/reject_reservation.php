<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods:POST");

require_once '../config/db.php';

// Allow only POST requests
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
    $pdo = getDB();

    // Check if reservation exists and is pending
    $stmt = $pdo->prepare("SELECT status FROM tblreservations WHERE id = ?");
    $stmt->execute([$reservation_id]);
    $existing = $stmt->fetch();

    if (!$existing) {
        echo json_encode(['success' => false, 'message' => 'Reservation not found.']);
        exit;
    }

    if ($existing['status'] !== 'pending') {
        echo json_encode(['success' => false, 'message' => 'Reservation cannot be rejected because it is already processed.']);
        exit;
    }

    // Update reservation to rejected with reason and notes
    $stmt = $pdo->prepare("
        UPDATE tblreservations 
        SET status = 'rejected', 
            rejection_reason_id = ?, 
            rejection_other_notes = ?, 
            updated_at = NOW() 
        WHERE id = ?
    ");
    $stmt->execute([$rejection_reason_id, $rejection_other_notes, $reservation_id]);

    echo json_encode(['success' => true, 'message' => 'Reservation rejected successfully.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
