<?php
// backend/src/api/auth.php

// Start the session at the very beginning of the script
session_start();

// Adjust paths as needed
require_once __DIR__ . '/../../vendor/autoload.php'; // For Composer autoload
require_once __DIR__ . '/../../config/db.php';     // Your database connection

use Google\Client;
// use Google\Service\Oauth2; // Not strictly needed for ID token verification, but useful for more info if needed

header('Content-Type: application/json');
// IMPORTANT: Restrict this in production to your frontend URL(s)
// For development, it's often '*' but tighten it for deployment.
header('Access-Control-Allow-Origin: http://localhost:3000'); // Or your React app's URL
header('Access-Control-Allow-Credentials: true'); // Crucial for sending/receiving cookies (sessions)
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type'); // No Authorization header needed if using sessions

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond with 200 OK for preflight
    http_response_code(200);
    exit(0);
}

$pdo = getDbConnection(); // Get your PDO database connection

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
        'client_id' => getenv('83326101199-knbfp9vi48fbukrfdq0fkfpuargn87uc.apps.googleusercontent.com'),
        'client_secret' => getenv('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'),
    ]);
    $client->setAudience(getenv('83326101199-knbfp9vi48fbukrfdq0fkfpuargn87uc.apps.googleusercontent.com')); // IMPORTANT: Audience must be your client ID

    try {
        // 1. Verify the ID Token
        $payload = $client->verifyIdToken($idToken);

        if (!$payload) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid Google ID token.']);
            exit();
        }

        // 2. Extract User Information
        $googleId = $payload['sub']; // Unique Google user ID
        $email = $payload['email'];
        $firstName = $payload['given_name'] ?? null;
        $lastName = $payload['family_name'] ?? null;
        $profilePicture = $payload['picture'] ?? null;

        // 3. Enforce @dlsl.edu.ph domain restriction
        if (!str_ends_with($email, '@dlsl.edu.ph')) {
            http_response_code(403); // Forbidden
            echo json_encode(['success' => false, 'message' => 'Access denied. Only @dlsl.edu.ph accounts are allowed.']);
            exit();
        }

        // 4. Check if user exists in tblusers
        $stmt = $pdo->prepare("SELECT id, role FROM tblusers WHERE google_id = ?");
        $stmt->execute([$googleId]);
        $user = $stmt->fetch();

        $userRole = 'general_user'; // Default role for new users

        if ($user) {
            // User exists, retrieve their current role
            $userId = $user['id'];
            $userRole = $user['role']; // Use existing role
            // Optionally update user details (name, picture, email)
            $updateStmt = $pdo->prepare("UPDATE tblusers SET email = ?, first_name = ?, last_name = ?, profile_picture = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $updateStmt->execute([$email, $firstName, $lastName, $profilePicture, $userId]);

        } else {
            // New user, register them with the default role
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

        // 5. Establish PHP Session
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_role'] = $userRole;
        $_SESSION['google_id'] = $googleId;
        $_SESSION['email'] = $email; // Storing additional info in session for easy access

        // 6. Return success response with user role
        echo json_encode([
            'success' => true,
            'message' => 'Authentication successful.',
            'user' => [
                'id' => $userId,
                'email' => $email,
                'first_name' => $firstName,
                'last_name' => $lastName,
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
    http_response_code(405); // Method Not Allowed
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
}