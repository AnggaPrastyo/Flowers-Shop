<?php
// api/logout.php
// API endpoint untuk logout user

// Enable error reporting untuk development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Allow both POST and GET for logout
if (!in_array($_SERVER['REQUEST_METHOD'], ['POST', 'GET'])) {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST or GET.'
    ]);
    exit;
}

try {
    // Include Auth class
    require_once '../php/classes/Auth.php';

    // Create Auth instance and logout
    $auth = new Auth();
    $result = $auth->logout();

    // Return result
    http_response_code(200);
    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'error_type' => 'logout_error'
    ]);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage(),
        'error_type' => 'server_error'
    ]);
}
