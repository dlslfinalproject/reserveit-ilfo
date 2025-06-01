<?php
require_once '../config/db.php';
header("Access-Control-Allow-Origin: http://localhost:5173"); // Allow all origins
header("Access-Control-Allow-Methods: GET, OPTIONS"); // Allow specific methods
header("Access-Control-Allow-Headers: Content-Type"); // Allow specific headers
header("Content-Type: application/json");
try {
    $pdo = getDbConnection();
    $stmt = $pdo->query("SELECT status_id, status_name FROM tblapproval_status ORDER BY status_id");
    $statuses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($statuses);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch approval statuses"]);
}
