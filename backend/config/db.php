<?php

require_once __DIR__ . '/../vendor/autoload.php'; // Path to Composer's autoload.php from config/

// Create Dotenv instance and load variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..'); // Path to your backend directory where .env resides
$dotenv->load();

function getDbConnection() {
    $host = $_ENV['DB_HOST'];
    $user = $_ENV['DB_USER'];
    $pass = $_ENV['DB_PASS'];
    $db = 'reserveit';

    $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        return new PDO($dsn, $user, $pass, $options);
    } catch (PDOException $e) {
        // Send JSON error response and exit
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed: ' . $e->getMessage()
        ]);
        exit();
    }
}

?>