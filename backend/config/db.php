<?php
// backend/config/db.php (or a dedicated database config file)

// Load environment variables (if you're using a .env file, e.g., with Dotenv library)
// require_once __DIR__ . '/../vendor/autoload.php';
// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
// $dotenv->load();

define('DB_HOST', getenv('DB_HOST') ?: 'localhost'); // Your database host
define('DB_USER', getenv('DB_USER') ?: 'root');     // Your database username
define('DB_PASS', getenv('DB_PASS') ?: '');         // Your database password
define('DB_NAME', getenv('DB_NAME') ?: 'reserveit'); // Your database name

// --- Using PDO for database connection (Recommended) ---
function getDbConnection() {
    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,     // Fetch results as associative arrays
        PDO::ATTR_EMULATE_PREPARES   => false,                // Disable emulation for better security and performance
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Log the error (do not expose full error details in production)
        error_log("Database connection failed: " . $e->getMessage());
        // For development:
        // die("Database connection failed: " . $e->getMessage());
        // For production:
        http_response_code(500);
        echo json_encode(["message" => "Database connection error."]);
        exit();
    }
}

// Example usage (you might not call it directly here, but from your API endpoints)
// $pdo = getDbConnection();
// if ($pdo) {
//     echo "Database connected successfully!";
// } else {
//     echo "Failed to connect to database.";
// }
?>