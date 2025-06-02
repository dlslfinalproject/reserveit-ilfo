<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Content-Type: application/json');

require_once '../config/db.php';

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

// JSON response helper
function jsonResponse($status, $message, $data = null) {
    echo json_encode([
        'status' => $status,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Admin-only check
function requireAdmin() {
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
        http_response_code(403);
        jsonResponse('error', 'Unauthorized access');
    }
}

$conn = getDbConnection();  // <-- Use function from db.php to get PDO connection
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case 'GET':
        // Fetch active venues
        $stmt = $conn->prepare("SELECT * FROM tblvenues WHERE is_active = 1 ORDER BY venue_name ASC");
        $stmt->execute();
        $venues = $stmt->fetchAll(PDO::FETCH_ASSOC);
        jsonResponse('success', 'Fetched venues successfully', $venues);
        break;

    case 'POST':
        requireAdmin();

        if (!isset($input['venue_name'], $input['min_capacity'], $input['max_capacity'])) {
            http_response_code(400);
            jsonResponse('error', 'Missing required fields');
        }

        if (!is_numeric($input['min_capacity']) || !is_numeric($input['max_capacity'])) {
            http_response_code(400);
            jsonResponse('error', 'Capacity values must be numeric');
        }

        $stmt = $conn->prepare("INSERT INTO tblvenues (venue_name, min_capacity, max_capacity, description, created_by) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            trim($input['venue_name']),
            (int)$input['min_capacity'],
            (int)$input['max_capacity'],
            $input['description'] ?? null,
            $_SESSION['user_id'] ?? null
        ]);

        $newVenueId = $conn->lastInsertId();
        $stmt = $conn->prepare("SELECT * FROM tblvenues WHERE venue_id = ?");
        $stmt->execute([$newVenueId]);
        $newVenue = $stmt->fetch(PDO::FETCH_ASSOC);

        jsonResponse('success', 'Venue added successfully', $newVenue);
        break;

    case 'PUT':
        requireAdmin();

        if (!isset($input['venue_id'], $input['venue_name'], $input['min_capacity'], $input['max_capacity'])) {
            http_response_code(400);
            jsonResponse('error', 'Missing required fields');
        }

        if (!is_numeric($input['min_capacity']) || !is_numeric($input['max_capacity'])) {
            http_response_code(400);
            jsonResponse('error', 'Capacity values must be numeric');
        }

        $stmt = $conn->prepare("UPDATE tblvenues SET venue_name = ?, min_capacity = ?, max_capacity = ?, description = ?, updated_by = ? WHERE venue_id = ?");
        $stmt->execute([
            trim($input['venue_name']),
            (int)$input['min_capacity'],
            (int)$input['max_capacity'],
            $input['description'] ?? null,
            $_SESSION['user_id'] ?? null,
            $input['venue_id']
        ]);

        $stmt = $conn->prepare("SELECT * FROM tblvenues WHERE venue_id = ?");
        $stmt->execute([$input['venue_id']]);
        $updatedVenue = $stmt->fetch(PDO::FETCH_ASSOC);

        jsonResponse('success', 'Venue updated successfully', $updatedVenue);
        break;

    case 'DELETE':
        requireAdmin();

        if (!isset($input['venue_id'])) {
            http_response_code(400);
            jsonResponse('error', 'Venue ID required');
        }

        $stmt = $conn->prepare("UPDATE tblvenues SET is_active = 0, updated_by = ? WHERE venue_id = ?");
        $stmt->execute([
            $_SESSION['user_id'] ?? null,
            $input['venue_id']
        ]);

        jsonResponse('success', 'Venue deleted successfully');
        break;

    default:
        http_response_code(405);
        jsonResponse('error', 'Method not allowed');
        break;
}
