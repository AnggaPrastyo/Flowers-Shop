<?php
echo "Testing Auth class loading...\n";

// Test 1: File exists
if (file_exists('../php/classes/Auth.php')) {
    echo "✅ File exists\n";

    // Test 2: Include file
    try {
        require_once '../php/classes/Auth.php';
        echo "✅ File included successfully\n";

        // Test 3: Class exists
        if (class_exists('Auth')) {
            echo "✅ Auth class found\n";

            // Test 4: Create instance
            try {
                $auth = new Auth();
                echo "✅ Auth instance created successfully\n";
                echo "🎉 ALL TESTS PASSED!\n";
            } catch (Exception $e) {
                echo "❌ Failed to create Auth instance: " . $e->getMessage() . "\n";
            }
        } else {
            echo "❌ Auth class not found in file\n";
        }
    } catch (Exception $e) {
        echo "❌ Failed to include file: " . $e->getMessage() . "\n";
    }
} else {
    echo "❌ File not found\n";
}
