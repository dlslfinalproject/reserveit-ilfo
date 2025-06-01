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
try {
    $pdo = getDbConnection();
    $stmt = $pdo->query("SELECT reason_id, reason_description FROM tblrejection_reasons ORDER BY reason_id");
    $reasons = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($reasons);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch rejection reasons"]);
}
