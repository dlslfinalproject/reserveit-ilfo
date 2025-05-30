<?php session_start(); 
error_reporting(E_ALL & ~E_DEPRECATED);
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/db.php'; // Ensure db.php correctly loads your .env variables

use Google\Client;

header('Content-Type: application/json');

$pdo = getDbConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $idToken = $input['id_token'] ?? null;

    if (!$idToken) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Google ID token missing.']);
        exit();
    }

    $client = new Client();
    // Set up the Google Client for ID token verification
    $client->setAuthConfig([
        // ⭐⭐⭐ CORRECTED LINES HERE ⭐⭐⭐
        'client_id' => $_ENV['GOOGLE_CLIENT_ID'],
        'client_secret' => $_ENV['GOOGLE_CLIENT_SECRET'],
    ]);
    // ⭐⭐⭐ CORRECTED LINE HERE ⭐⭐⭐
    $client->setAudience($_ENV['GOOGLE_CLIENT_ID']); // Audience must be your client ID

    try {
        // ... (rest of your existing code is fine from here) ...
        $payload = $client->verifyIdToken($idToken);

        if (!$payload) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid Google ID token.']);
            exit();
        }

        // ... (rest of your auth.php logic) ...
        $googleId = $payload['sub'];
        $email = $payload['email'];
        $firstName = $payload['given_name'] ?? null;
        $lastName = $payload['family_name'] ?? null;
        $profilePicture = $payload['picture'] ?? null;

        if (!str_ends_with($email, '@dlsl.edu.ph')) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Access denied. Only @dlsl.edu.ph accounts are allowed.']);
            exit();
        }

        $stmt = $pdo->prepare("SELECT id, role FROM tblusers WHERE google_id = ?");
        $stmt->execute([$googleId]);
        $user = $stmt->fetch();

        $userRole = 'general_user';

        if ($user) {
            $userId = $user['id'];
            $userRole = $user['role'];
            $updateStmt = $pdo->prepare("UPDATE tblusers SET email = ?, first_name = ?, last_name = ?, profile_picture = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $updateStmt->execute([$email, $firstName, $lastName, $profilePicture, $userId]);
        } else {
            try {
                $stmt = $pdo->prepare("INSERT INTO tblusers (google_id, email, first_name, last_name, profile_picture, role) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([$googleId, $email, $firstName, $lastName, $profilePicture, $userRole]);
                $userId = $pdo->lastInsertId();
            } catch (PDOException $e) {
                http_response_code(500);
                error_log("User registration failed: " . $e->getMessage());
                echo json_encode(['success' => false, 'message' => 'Failed to register user.']);
                exit();
            }
        }

        $_SESSION['user_id'] = $userId;
        $_SESSION['user_role'] = $userRole;
        $_SESSION['google_id'] = $googleId;
        $_SESSION['email'] = $email;

        echo json_encode([
            'success' => true,
            'message' => 'Authentication successful.',
            'user' => [
                'id' => $userId,
                'email' => $email,
                'first_name' => $firstName,
                'last_name' => $lastName, // Note: This might be a typo, usually last_name should map to last_name, not profile_picture. Check your database structure and intentions.
                'profile_picture' => $profilePicture,
                'role' => $userRole
            ]
        ]);

    } catch (\Exception $e) {
        http_response_code(500);
        error_log("Google Sign-In error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Google Sign-In failed.']);
    }

} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
}
