<?php
// api/login.php
// API endpoint untuk login user

// Enable error reporting untuk development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST.'
    ]);
    exit;
}

try {
    // Include Auth class
    require_once '../php/classes/Auth.php';

    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate input
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }

    if (!isset($input['email']) || !isset($input['password'])) {
        throw new Exception('Email dan password harus diisi');
    }

    if (empty(trim($input['email'])) || empty(trim($input['password']))) {
        throw new Exception('Email dan password tidak boleh kosong');
    }

    // Validate email format
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Format email tidak valid');
    }

    // Create Auth instance and login
    $auth = new Auth();
    $result = $auth->login($input['email'], $input['password']);

    // Return result
    if ($result['success']) {
        http_response_code(200);
    } else {
        http_response_code(401);
    }

    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'error_type' => 'validation_error'
    ]);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage(),
        'error_type' => 'server_error'
    ]);
}
