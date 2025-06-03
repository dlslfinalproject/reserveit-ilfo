<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../config/db.php';

// Handle preflight OPTIONS request
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
    $pdo = getDbConnection(); // ✅ Use correct DB connection function

    // Get status ID of the target status
    $stmt = $pdo->prepare('SELECT status_id FROM tblapproval_status WHERE status_name = :status');
    $stmt->execute(['status' => $status]);
    $statusRow = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$statusRow) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Status not found in database']);
        exit;
    }

    $statusId = $statusRow['status_id'];

    // Get current reservation's status
    $stmt = $pdo->prepare('
        SELECT s.status_name 
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

    // Prevent reversal logic
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

    // Proceed to update status
    $stmt = $pdo->prepare('UPDATE tblreservations SET status_id = :status_id WHERE reservation_id = :id');
    $stmt->execute(['status_id' => $statusId, 'id' => $id]);

    if ($stmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Status unchanged.']);
        exit;
    }

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
