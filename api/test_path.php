<?php
echo "Testing path resolution...\n";
if (file_exists('../php/classes/Auth.php')) {
    echo "✅ Auth.php found!";
} else {
    echo "❌ Auth.php NOT found!";
    echo "\nChecking alternatives:";
    if (file_exists('../php/classes/auth.php')) echo "\n- Found: auth.php (lowercase)";
    if (file_exists('../classes/Auth.php')) echo "\n- Found: ../classes/Auth.php";
    if (file_exists('../../php/classes/Auth.php')) echo "\n- Found: ../../php/classes/Auth.php";
}
