<?php
require_once '../config/db.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    $pdo = getDbConnection();
    $stmt = $pdo->query("SELECT venue_id, venue_name, min_capacity, max_capacity, description, is_active FROM tblvenues WHERE is_active = 1 ORDER BY venue_name");
    $venues = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($venues);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch venues"]);
}
