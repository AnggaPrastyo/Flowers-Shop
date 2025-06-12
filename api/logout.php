<?php
// api/logout.php
// API endpoint untuk logout

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../php/classes/Auth.php';

try {
    $auth = new Auth();

    // Cek apakah user sedang login
    if (!$auth->isLoggedIn()) {
        echo json_encode([
            'success' => false,
            'message' => 'Tidak ada session aktif'
        ]);
        exit;
    }

    $result = $auth->logout();

    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
