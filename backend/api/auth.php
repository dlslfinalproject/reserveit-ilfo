<?php
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/db.php';

use Google\Client;

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty($input['id_token'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID token missing']);
    exit();
}

$idToken = $input['id_token'];
$client = new Client(['client_id' => '849806952511-hcdtjmtl769ihmjdeqcgdkr11tbp007o.apps.googleusercontent.com']);

try {
    $payload = $client->verifyIdToken($idToken);
    if (!$payload) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid ID token']);
        exit();
    }
} catch (Exception $e) {
    error_log('Google Client verifyIdToken error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Token verification failed']);
    exit();
}

// Extract user info
$googleId = $payload['sub'];
$email = $payload['email'];
$firstName = $payload['given_name'] ?? '';
$lastName = $payload['family_name'] ?? '';
$picture = $payload['picture'] ?? '';

// Allow only @dlsl.edu.ph emails
if (!str_ends_with($email, '@dlsl.edu.ph')) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized email domain']);
    exit();
}

// Admin override list
$adminEmails = [
    'ilfo.office@dlsl.edu.ph',
    'ilfo.manager@dlsl.edu.ph',
    'mary.ann.lumban@dlsl.edu.ph',
    'jane_allyson_paray@dlsl.edu.ph',
];

// Assign role
$assignedRole = in_array($email, $adminEmails) ? 'admin' : 'general_user';

try {
    $db = getDbConnection();

    $stmt = $db->prepare('SELECT id, role FROM tblusers WHERE google_id = ?');
    $stmt->execute([$googleId]);
    $user = $stmt->fetch();

    if ($user) {
        $stmt = $db->prepare('UPDATE tblusers SET email = ?, first_name = ?, last_name = ?, profile_picture = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
        $stmt->execute([$email, $firstName, $lastName, $picture, $user['id']]);
        $userId = $user['id'];
        $userRole = $user['role'];
    } else {
        $stmt = $db->prepare('INSERT INTO tblusers (google_id, email, first_name, last_name, profile_picture, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, "general_user", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)');
        $stmt->execute([$googleId, $email, $firstName, $lastName, $picture]);
        $userId = $db->lastInsertId();
        $userRole = $assignedRole;
    }

    session_start();
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_role'] = $userRole;
    $_SESSION['email'] = $email;

    // Set redirect URL based on role
    $redirectUrl = ($userRole === 'admin')
        ? 'http://localhost:5173/admin' 
        : 'https://mail.google.com/mail/u/0/#inbox';

    echo json_encode([
        'success' => true,
        'message' => 'Authentication successful',
        'redirect' => $redirectUrl,
        'user' => [
            'id' => $userId,
            'email' => $email,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'profile_picture' => $picture,
            'role' => $userRole,
        ],
    ]);
} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
    exit();
}
