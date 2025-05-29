<?php
// backend/config/db.php

// Define your database credentials.
// IMPORTANT: For production, use environment variables (e.g., via Composer's phpdotenv library)
// instead of hardcoding these directly in the script.
$host = 'localhost'; // Or your database host
$db   = 'reserveit'; // Your database name, confirmed from screenshots
$user = 'root';     // REPLACE WITH YOUR ACTUAL DB USER
$pass = ''; // REPLACE WITH YOUR ACTUAL DB PASSWORD
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,     // Fetch results as associative arrays
    PDO::ATTR_EMULATE_PREPARES   => false,                // Disable emulation for better security and performance
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // In a real application, you'd log this error to a file and show a generic message.
    // For development, we can show the error.
    error_log("Database connection error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Could not connect to the database.']);
    exit();
}