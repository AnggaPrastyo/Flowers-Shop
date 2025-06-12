<!DOCTYPE html>
<html>

<head>
    <title>Test API Endpoints</title>
    <style>
        body {
            font-family: Arial;
            margin: 20px;
        }

        .container {
            max-width: 800px;
        }

        .endpoint {
            border: 1px solid #ddd;
            margin: 10px 0;
            padding: 15px;
            border-radius: 5px;
        }

        .success {
            background: #d4edda;
            border-color: #c3e6cb;
        }

        .error {
            background: #f8d7da;
            border-color: #f5c6cb;
        }

        button {
            background: #007bff;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        button:hover {
            background: #0056b3;
        }

        textarea {
            width: 100%;
            height: 100px;
            margin: 5px 0;
        }

        .result {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>🧪 Test API Endpoints - Flowers Shop</h1>

        <!-- Test 1: Login API -->
        <div class="endpoint">
            <h3>1. Test Login API</h3>
            <p><strong>URL:</strong> api/login.php</p>
            <form method="POST" action="login.php">
                <input type="email" name="email" placeholder="Email" required><br><br>
                <input type="password" name="password" placeholder="Password" required><br><br>
                <label><input type="checkbox" name="admin" value="true"> Login sebagai Admin</label><br><br>
                <button type="submit">Test Login</button>
            </form>
        </div>

        <!-- Test 2: Register API -->
        <div class="endpoint">
            <h3>2. Test Register API</h3>
            <p><strong>URL:</strong> api/register.php</p>
            <form method="POST" action="register.php">
                <input type="text" name="nama" placeholder="Nama Lengkap" required><br><br>
                <input type="text" name="username" placeholder="Username" required><br><br>
                <input type="email" name="email" placeholder="Email" required><br><br>
                <input type="text" name="telepon" placeholder="Telepon" required><br><br>
                <textarea name="alamat" placeholder="Alamat" required></textarea><br>
                <input type="password" name="password" placeholder="Password" required><br><br>
                <input type="password" name="konfirmasi_password" placeholder="Konfirmasi Password"><br><br>
                <button type="submit">Test Register</button>
            </form>
        </div>

        <!-- Test 3: Logout API -->
        <div class="endpoint">
            <h3>3. Test Logout API</h3>
            <p><strong>URL:</strong> api/logout.php</p>
            <form method="POST" action="logout.php">
                <button type="submit">Test Logout</button>
            </form>
            <br>
            <a href="logout.php" target="_blank">
                <button type="button">Test Logout (GET)</button>
            </a>
        </div>

        <!-- Quick Access -->
        <div class="endpoint">
            <h3>4. Quick Access Links</h3>
            <p>Test API langsung:</p>
            <a href="login.php" target="_blank">📱 login.php</a> |
            <a href="register.php" target="_blank">📝 register.php</a> |
            <a href="logout.php" target="_blank">🚪 logout.php</a>
        </div>

        <!-- Database Check -->
        <div class="endpoint">
            <h3>5. Database Connection Check</h3>
            <?php
            try {
                require_once '../classes/Auth.php';
                $auth = new Auth();
                echo '<div class="success">✅ Database connection: OK</div>';
                echo '<div class="success">✅ Auth class: OK</div>';
            } catch (Exception $e) {
                echo '<div class="error">❌ Error: ' . $e->getMessage() . '</div>';
            }
            ?>
        </div>
    </div>

    <script>
        // JavaScript untuk test dengan AJAX jika diperlukan
        function testAPI(endpoint, data) {
            fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    alert('Response: ' + JSON.stringify(data, null, 2));
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Error: ' + error);
                });
        }
    </script>
</body>

</html>