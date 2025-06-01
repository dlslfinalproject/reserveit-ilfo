<?php
require_once '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    $pdo = getDbConnection();
    $stmt = $pdo->query("SELECT activity_id, activity_name FROM tblactivities ORDER BY activity_name");
    $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($activities);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch activities"]);
}
