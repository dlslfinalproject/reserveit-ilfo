<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
require_once '../config/db.php';

try {
    $pdo = getDbConnection();
    $stmt = $pdo->query("SELECT activity_id, activity_name FROM tblactivities ORDER BY activity_name");
    $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($activities);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch activities"]);
}
