<?php
require_once '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    $pdo = getDbConnection();
    $stmt = $pdo->query("SELECT reason_id, reason_description FROM tblrejection_reasons ORDER BY reason_id");
    $reasons = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($reasons);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch rejection reasons"]);
}
