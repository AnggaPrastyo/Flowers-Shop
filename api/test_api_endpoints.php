<?php
// api/test_api_endpoints.php
// Tool untuk test semua API endpoints
?>
<!DOCTYPE html>
<html>

<head>
    <title>Flowers Shop - API Testing</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }

        .test-section {
            margin: 20px 0;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        .success {
            background-color: #d4edda;
            color: #155724;
        }

        .error {
            background-color: #f8d7da;
            color: #721c24;
        }

        button {
            padding: 10px 15px;
            margin: 5px;
            cursor: pointer;
        }

        textarea {
            width: 100%;
            height: 100px;
        }

        pre {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
    </style>
</head>

<body>
    <h1>🌸 Flowers Shop - API Testing Tool</h1>

    <div class="test-section">
        <h2>1. Test Register API</h2>
        <button onclick="testRegister()">Test Register</button>
        <div id="registerResult"></div>
    </div>

    <div class="test-section">
        <h2>2. Test Login API</h2>
        <button onclick="testLogin()">Test Login</button>
        <div id="loginResult"></div>
    </div>

    <div class="test-section">
        <h2>3. Test Logout API</h2>
        <button onclick="testLogout()">Test Logout</button>
        <div id="logoutResult"></div>
    </div>

    <div class="test-section">
        <h2>4. Custom Test</h2>
        <label>API Endpoint:</label>
        <select id="customEndpoint">
            <option value="login.php">login.php</option>
            <option value="register.php">register.php</option>
            <option value="logout.php">logout.php</option>
        </select><br><br>

        <label>JSON Data:</label><br>
        <textarea id="customData" placeholder='{"email": "test@example.com", "password": "123456"}'></textarea><br>

        <button onclick="testCustom()">Send Custom Request</button>
        <div id="customResult"></div>
    </div>

    <script>
        const apiUrl = '/flowers_shop/api';

        async function testRegister() {
            const data = {
                nama: 'Test User',
                email: 'test@example.com',
                password: '123456',
                confirm_password: '123456'
            };

            await makeRequest('register.php', data, 'registerResult');
        }

        async function testLogin() {
            const data = {
                email: 'test@example.com',
                password: '123456'
            };

            await makeRequest('login.php', data, 'loginResult');
        }

        async function testLogout() {
            await makeRequest('logout.php', {}, 'logoutResult');
        }

        async function testCustom() {
            const endpoint = document.getElementById('customEndpoint').value;
            const jsonData = document.getElementById('customData').value;

            let data = {};
            try {
                data = jsonData ? JSON.parse(jsonData) : {};
            } catch (e) {
                document.getElementById('customResult').innerHTML =
                    '<div class="error">Invalid JSON: ' + e.message + '</div>';
                return;
            }

            await makeRequest(endpoint, data, 'customResult');
        }

        async function makeRequest(endpoint, data, resultElementId) {
            const resultElement = document.getElementById(resultElementId);
            resultElement.innerHTML = '<p>Loading...</p>';

            try {
                const response = await fetch(`${apiUrl}/${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                const statusClass = result.success ? 'success' : 'error';
                const requestInfo = `
                    <h4>Request:</h4>
                    <pre>POST ${apiUrl}/${endpoint}
Content-Type: application/json

${JSON.stringify(data, null, 2)}</pre>
                `;

                const responseInfo = `
                    <h4>Response (${response.status}):</h4>
                    <pre>${JSON.stringify(result, null, 2)}</pre>
                `;

                resultElement.innerHTML = `
                    <div class="${statusClass}">
                        ${requestInfo}
                        ${responseInfo}
                    </div>
                `;

            } catch (error) {
                resultElement.innerHTML = `
                    <div class="error">
                        <h4>Network Error:</h4>
                        <pre>${error.message}</pre>
                    </div>
                `;
            }
        }
    </script>
</body>

</html>