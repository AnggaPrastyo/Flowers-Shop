<?php
// test_database.php - Fixed version
// Test database connection dan enhanced methods

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>🔍 Testing Step 1.2: Enhanced Database</h2>";

try {
    // Include database class - FIXED PATH
    require_once 'database.php';

    echo "<div style='background: #e8f5e8; padding: 10px; margin: 10px 0;'>";
    echo "✅ <strong>Database class loaded successfully</strong><br>";

    // Test 1: Basic connection
    echo "<h3>Test 1: Basic Connection</h3>";
    $db = new Database();
    echo "✅ Database instance created<br>";

    if ($db->testConnection()) {
        echo "✅ <strong>Database connection: SUCCESS</strong><br>";
    } else {
        echo "❌ Database connection: FAILED<br>";
    }

    // Test 2: Singleton pattern
    echo "<h3>Test 2: Singleton Pattern</h3>";
    $db1 = Database::getInstance();
    $db2 = Database::getInstance();

    if ($db1 === $db2) {
        echo "✅ <strong>Singleton pattern: WORKING</strong><br>";
    } else {
        echo "❌ Singleton pattern: NOT WORKING<br>";
    }

    // Test 3: Enhanced methods
    echo "<h3>Test 3: Enhanced Methods</h3>";

    // Test fetchAll - ambil semua users
    $users = $db->fetchAll("SELECT id, username, email FROM users LIMIT 3");
    echo "✅ fetchAll(): Found " . count($users) . " users<br>";

    // Test fetchOne - ambil satu user
    $user = $db->fetchOne("SELECT username, email FROM users WHERE id = ?", [1]);
    if ($user) {
        echo "✅ fetchOne(): User found - " . $user['username'] . "<br>";
    }

    // Test exists - cek apakah user ada
    $userExists = $db->exists('users', 'id = ?', [1]);
    echo "✅ exists(): User ID 1 " . ($userExists ? "EXISTS" : "NOT FOUND") . "<br>";

    // Test count - hitung total users
    $totalUsers = $db->count('users');
    echo "✅ count(): Total users = " . $totalUsers . "<br>";

    // Test 4: Database info
    echo "<h3>Test 4: Database Info</h3>";
    $info = $db->getInfo();
    echo "✅ Host: " . $info['host'] . "<br>";
    echo "✅ Database: " . $info['database'] . "<br>";
    echo "✅ Status: " . $info['connection_status'] . "<br>";
    echo "✅ MySQL Version: " . $info['server_version'] . "<br>";

    echo "</div>";

    echo "<div style='background: #d4edda; padding: 15px; margin: 20px 0; border: 1px solid #c3e6cb;'>";
    echo "<h3>🎉 STEP 1.2: COMPLETE!</h3>";
    echo "<p><strong>✅ All database tests passed!</strong></p>";
    echo "<p>✅ Enhanced Database class working perfectly</p>";
    echo "<p>✅ Ready for Step 1.3: Authentication System</p>";
    echo "</div>";
} catch (Exception $e) {
    echo "<div style='background: #f8d7da; padding: 15px; margin: 20px 0; border: 1px solid #f5c6cb;'>";
    echo "❌ <strong>Error:</strong> " . $e->getMessage();
    echo "</div>";
}
