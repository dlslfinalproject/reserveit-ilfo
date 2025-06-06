<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = getDbConnection(); 

try {
    $stmt = $conn->prepare("SELECT reason_id, reason_description FROM tblrejection_reasons ORDER BY reason_description ASC");
    $stmt->execute();

    $reasons = $stmt->fetchAll(PDO::FETCH_ASSOC);  

    echo json_encode(['success' => true, 'reasons' => $reasons]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch rejection reasons.',
        'error' => $e->getMessage()
    ]);
}
?>
