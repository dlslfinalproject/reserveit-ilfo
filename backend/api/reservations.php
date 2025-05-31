<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Adjust for security, e.g. restrict domains
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Preflight request for CORS
    http_response_code(200);
    exit;
}

// Database config - update these with your actual credentials
$host = '127.0.0.1';
$port = 3307;
$dbname = 'reserveit';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true);
}

$path = isset($_GET['path']) ? explode('/', trim($_GET['path'], '/')) : [];
$method = $_SERVER['REQUEST_METHOD'];
$resource = $path[0] ?? null;
$id = isset($path[1]) ? (int)$path[1] : null;

switch ($resource) {
    case 'activities':
        handleActivities($method, $id, $pdo);
        break;
    case 'approval_status':
        handleApprovalStatus($method, $id, $pdo);
        break;
    case 'rejection_reasons':
        handleRejectionReasons($method, $id, $pdo);
        break;
    case 'reservations':
        handleReservations($method, $id, $pdo);
        break;
    case 'schedules':
        handleSchedules($method, $id, $pdo);
        break;
    case 'users':
        handleUsers($method, $id, $pdo);
        break;
    case 'venues':
        handleVenues($method, $id, $pdo);
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Resource not found']);
}

function handleActivities($method, $id, $pdo) {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM tblactivities WHERE activity_id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$data) {
            http_response_code(404);
            echo json_encode(['error' => 'Activity not found']);
            return;
        }
        echo json_encode($data);
    } else {
        $stmt = $pdo->query("SELECT * FROM tblactivities ORDER BY activity_name ASC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}

function handleApprovalStatus($method, $id, $pdo) {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM tblapproval_status WHERE status_id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$data) {
            http_response_code(404);
            echo json_encode(['error' => 'Approval status not found']);
            return;
        }
        echo json_encode($data);
    } else {
        $stmt = $pdo->query("SELECT * FROM tblapproval_status ORDER BY status_name ASC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}

function handleRejectionReasons($method, $id, $pdo) {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM tblrejection_reasons WHERE reason_id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$data) {
            http_response_code(404);
            echo json_encode(['error' => 'Rejection reason not found']);
            return;
        }
        echo json_encode($data);
    } else {
        $stmt = $pdo->query("SELECT * FROM tblrejection_reasons ORDER BY reason_description ASC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}

function handleSchedules($method, $id, $pdo) {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM tblschedules WHERE schedule_id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$data) {
            http_response_code(404);
            echo json_encode(['error' => 'Schedule not found']);
            return;
        }
        echo json_encode($data);
    } else {
        $stmt = $pdo->query("SELECT * FROM tblschedules ORDER BY schedule_option ASC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}

function handleUsers($method, $id, $pdo) {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    if ($id) {
        $stmt = $pdo->prepare("SELECT id, email, first_name, last_name, profile_picture, role, created_at, updated_at FROM tblusers WHERE id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$data) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            return;
        }
        echo json_encode($data);
    } else {
        $stmt = $pdo->query("SELECT id, email, first_name, last_name, profile_picture, role FROM tblusers ORDER BY first_name ASC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}

function handleVenues($method, $id, $pdo) {
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM tblvenues WHERE venue_id = ?");
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$data) {
            http_response_code(404);
            echo json_encode(['error' => 'Venue not found']);
            return;
        }
        echo json_encode($data);
    } else {
        $stmt = $pdo->query("SELECT * FROM tblvenues WHERE is_active = 1 ORDER BY venue_name ASC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}

function handleReservations($method, $id, $pdo) {
    switch ($method) {
        case 'GET':
            if ($id) {
                $stmt = $pdo->prepare("SELECT * FROM tblreservations WHERE reservation_id = ?");
                $stmt->execute([$id]);
                $data = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!$data) {
                    http_response_code(404);
                    echo json_encode(['error' => 'Reservation not found']);
                    return;
                }
                echo json_encode($data);
            } else {
                // Get all reservations sorted by approval status (approved, pending, rejected), then by date and start time
                $stmt = $pdo->query("
                    SELECT r.*, s.status_name 
                    FROM tblreservations r
                    JOIN tblapproval_status s ON r.status_id = s.status_id
                    ORDER BY FIELD(s.status_name, 'approved', 'pending', 'rejected'), r.reservation_date DESC, r.start_time ASC
                ");
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
            break;

        case 'POST':
            $input = getJsonInput();
            if (!validateReservationInput($input)) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing or invalid reservation fields']);
                return;
            }
            $sql = "INSERT INTO tblreservations 
                (user_id, who_reserved, event_name, activity_id, venue_id, number_of_participants, reservation_date, start_time, end_time, status_id, rejection_reason_id, rejection_other_notes, notes, link_to_csao_approved_poa, schedule_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $result = $stmt->execute([
                $input['user_id'],
                $input['who_reserved'],
                $input['event_name'],
                $input['activity_id'],
                $input['venue_id'],
                $input['number_of_participants'],
                $input['reservation_date'],
                $input['start_time'],
                $input['end_time'],
                $input['status_id'],
                $input['rejection_reason_id'] ?? null,
                $input['rejection_other_notes'] ?? null,
                $input['notes'] ?? null,
                $input['link_to_csao_approved_poa'] ?? null,
                $input['schedule_id'] ?? null
            ]);
            if ($result) {
                http_response_code(201);
                echo json_encode(['message' => 'Reservation created', 'reservation_id' => $pdo->lastInsertId()]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to create reservation']);
            }
            break;

        case 'PUT':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Reservation ID is required']);
                return;
            }
            $input = getJsonInput();
            if (!validateReservationInput($input, true)) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing or invalid reservation fields']);
                return;
            }
            $sql = "UPDATE tblreservations SET
                user_id = ?, who_reserved = ?, event_name = ?, activity_id = ?, venue_id = ?, number_of_participants = ?, reservation_date = ?, start_time = ?, end_time = ?, status_id = ?, rejection_reason_id = ?, rejection_other_notes = ?, notes = ?, link_to_csao_approved_poa = ?, schedule_id = ?
                WHERE reservation_id = ?";
            $stmt = $pdo->prepare($sql);
            $result = $stmt->execute([
                $input['user_id'],
                $input['who_reserved'],
                $input['event_name'],
                $input['activity_id'],
                $input['venue_id'],
                $input['number_of_participants'],
                $input['reservation_date'],
                $input['start_time'],
                $input['end_time'],
                $input['status_id'],
                $input['rejection_reason_id'] ?? null,
                $input['rejection_other_notes'] ?? null,
                $input['notes'] ?? null,
                $input['link_to_csao_approved_poa'] ?? null,
                $input['schedule_id'] ?? null,
                $id
            ]);
            if ($result) {
                echo json_encode(['message' => 'Reservation updated']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update reservation']);
            }
            break;

        case 'DELETE':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Reservation ID is required']);
                return;
            }
            $stmt = $pdo->prepare("DELETE FROM tblreservations WHERE reservation_id = ?");
            $result = $stmt->execute([$id]);
            if ($result) {
                echo json_encode(['message' => 'Reservation deleted']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to delete reservation']);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}

function validateReservationInput($input, $isUpdate = false) {
    // Required fields for create/update
    $required = [
        'user_id',
        'who_reserved',
        'event_name',
        'activity_id',
        'venue_id',
        'number_of_participants',
        'reservation_date',
        'start_time',
        'end_time',
        'status_id',
    ];

    foreach ($required as $field) {
        if (!isset($input[$field]) || ($input[$field] === '')) {
            return false;
        }
    }
    // Additional validations can be added here (date format, integer check, etc.)
    return true;
}
