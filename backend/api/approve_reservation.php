<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

session_start(); // Required to access $_SESSION

require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status_name' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

// Decode the raw JSON body
$input = json_decode(file_get_contents('php://input'), true);

$reservation_id = $input['reservation_id'] ?? null;
$venue_id = $input['venue_id'] ?? null;
$notes = $input['notes'] ?? null;


if (!$reservation_id || !$venue_id) {
    echo json_encode(['status_name' => 'error', 'message' => 'Missing reservation ID or venue ID.']);
    exit;
}

try {
    // Verify reservation exists and is pending
    $stmt = $pdo->prepare("SELECT * FROM tblreservations WHERE reservation_id = ?");
    $stmt->execute([$reservation_id]);
    $reservation = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$reservation) {
        echo json_encode(['status_name' => 'error', 'message' => 'Reservation not found.']);
        exit;
    }

    if ($reservation['status_name'] !== 'pending') {
        echo json_encode(['status_name' => 'error', 'message' => 'Reservation is not pending.']);
        exit;
    }

    // Update reservation with approved status and assigned venue
    $stmt = $pdo->prepare("
        UPDATE tblreservations
        SET status_name = 'approved', venue_id = ?, approved_at = NOW(),  admin_notes = ?
        WHERE reservation_id = ?
    ");
    $stmt->execute([$venue_id, $notes, $reservation_id]);

    echo json_encode(['status_name' => 'success', 'message' => 'Reservation approved.']);
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode(['status_name' => 'error', 'message' => 'Database error.']);
}
