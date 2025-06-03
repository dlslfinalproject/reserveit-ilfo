<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

session_start(); // Required to access $_SESSION

require_once '../config/db.php';
$pdo = getDbConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

// Decode the raw JSON body
$input = json_decode(file_get_contents('php://input'), true);

$reservation_id = $input['reservation_id'] ?? null;
$venue_id = $input['venue_id'] ?? null;
$notes = $input['notes'] ?? null;

if (!$reservation_id || !$venue_id) {
    echo json_encode(['status' => 'error', 'message' => 'Missing reservation ID or venue ID.']);
    exit;
}

try {
    // Verify reservation exists and is pending
    $stmt = $pdo->prepare("SELECT status_id FROM tblreservations WHERE reservation_id = ?");
    $stmt->execute([$reservation_id]);
    $reservation = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$reservation) {
        echo json_encode(['status' => 'error', 'message' => 'Reservation not found.']);
        exit;
    }

    if ((int)$reservation['status_id'] !== 1) { // 1 = Pending
        echo json_encode(['status' => 'error', 'message' => 'Reservation is not pending.']);
        exit;
    }

    // Approve reservation (status_id = 2 for Approved)
    $stmt = $pdo->prepare("
        UPDATE tblreservations
        SET status_id = 2, venue_id = ?, admin_notes = ?
        WHERE reservation_id = ?
    ");
    $stmt->execute([$venue_id, $notes, $reservation_id]);

    echo json_encode(['status' => 'success', 'message' => 'Reservation approved.']);
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
