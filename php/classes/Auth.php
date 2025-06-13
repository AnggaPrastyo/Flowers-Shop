<?php

/**
 * Enhanced Authentication Class - Fixed Version
 * Flowers Shop Project
 * File: php/classes/Auth.php
 */

class Auth
{
    private $db;

    public function __construct()
    {
        // Load database with better path resolution
        $this->loadDatabase();

        // Start session if not already started
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
    }

    /**
     * Smart database loading with multiple path attempts
     */
    private function loadDatabase()
    {
        $possiblePaths = [
            __DIR__ . '/../database.php',           // Standard relative path
            $_SERVER['DOCUMENT_ROOT'] . '/flowers_shop/php/database.php', // Absolute path
            dirname(dirname(__FILE__)) . '/database.php',  // Alternative relative
            '../php/database.php',                   // From API folder
        ];

        $databaseLoaded = false;

        foreach ($possiblePaths as $path) {
            if (file_exists($path)) {
                require_once $path;
                $databaseLoaded = true;
                break;
            }
        }

        if (!$databaseLoaded) {
            throw new Exception("Database class not found. Please check file structure.");
        }

        // Initialize database connection
        try {
            $database = new Database();
            $this->db = $database->pdo;
        } catch (Exception $e) {
            throw new Exception("Database connection failed: " . $e->getMessage());
        }
    }

    /**
     * Register new user
     */
    public function registerUser(array $data): array
    {
        try {
            // Validate required fields
            $required = ['nama', 'email', 'password'];
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    return [
                        'success' => false,
                        'message' => "Field {$field} wajib diisi"
                    ];
                }
            }

            // Validate email format
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                return [
                    'success' => false,
                    'message' => 'Format email tidak valid'
                ];
            }

            // Check if email already exists
            $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$data['email']]);

            if ($stmt->rowCount() > 0) {
                return [
                    'success' => false,
                    'message' => 'Email sudah terdaftar'
                ];
            }

            // Hash password
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

            // Insert new user with enhanced data
            $stmt = $this->db->prepare("
                INSERT INTO users (nama, email, password, username, telepon, alamat, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            ");

            $username = $data['username'] ?? explode('@', $data['email'])[0];

            $stmt->execute([
                $data['nama'],
                $data['email'],
                $hashedPassword,
                $username,
                $data['telepon'] ?? null,
                $data['alamat'] ?? null
            ]);

            $userId = $this->db->lastInsertId();

            // Set session for new user
            $this->setUserSession([
                'id' => $userId,
                'nama' => $data['nama'],
                'email' => $data['email']
            ]);

            return [
                'success' => true,
                'message' => 'Registrasi berhasil',
                'user_id' => $userId,
                'user' => [
                    'id' => $userId,
                    'nama' => $data['nama'],
                    'email' => $data['email']
                ]
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Login user
     */
    public function login(string $email, string $password): array
    {
        try {
            // Validate input
            if (empty($email) || empty($password)) {
                return [
                    'success' => false,
                    'message' => 'Email dan password wajib diisi'
                ];
            }

            // Get user by email
            $stmt = $this->db->prepare("SELECT id, nama, email, password FROM users WHERE email = ?");
            $stmt->execute([$email]);

            if ($stmt->rowCount() == 0) {
                return [
                    'success' => false,
                    'message' => 'Email tidak ditemukan'
                ];
            }

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Verify password
            if (!password_verify($password, $user['password'])) {
                return [
                    'success' => false,
                    'message' => 'Password salah'
                ];
            }

            // Set user session
            $this->setUserSession($user);

            return [
                'success' => true,
                'message' => 'Login berhasil',
                'user' => [
                    'id' => $user['id'],
                    'nama' => $user['nama'],
                    'email' => $user['email']
                ]
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Admin login with enhanced security
     */
    public function loginAdmin(string $email, string $password): array
    {
        try {
            // Check admin table
            $stmt = $this->db->prepare("SELECT id, nama, email, password, role FROM admins WHERE email = ?");
            $stmt->execute([$email]);

            if ($stmt->rowCount() == 0) {
                return [
                    'success' => false,
                    'message' => 'Admin tidak ditemukan'
                ];
            }

            $admin = $stmt->fetch(PDO::FETCH_ASSOC);

            // Verify password
            if (!password_verify($password, $admin['password'])) {
                return [
                    'success' => false,
                    'message' => 'Password salah'
                ];
            }

            // Set admin session
            $this->setAdminSession($admin);

            return [
                'success' => true,
                'message' => 'Login admin berhasil',
                'admin' => [
                    'id' => $admin['id'],
                    'nama' => $admin['nama'],
                    'email' => $admin['email'],
                    'role' => $admin['role']
                ]
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Set user session
     */
    private function setUserSession(array $user): void
    {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_nama'] = $user['nama'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['is_logged_in'] = true;
        $_SESSION['user_type'] = 'user';
    }

    /**
     * Set admin session
     */
    private function setAdminSession(array $admin): void
    {
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_nama'] = $admin['nama'];
        $_SESSION['admin_email'] = $admin['email'];
        $_SESSION['admin_role'] = $admin['role'];
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['user_type'] = 'admin';
    }

    /**
     * Logout user/admin
     */
    public function logout(): array
    {
        try {
            // Clear all session data
            session_unset();
            session_destroy();

            // Start new session
            session_start();

            return [
                'success' => true,
                'message' => 'Logout berhasil'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Terjadi kesalahan saat logout: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Check if user is logged in
     */
    public function isLoggedIn(): bool
    {
        return isset($_SESSION['is_logged_in']) && $_SESSION['is_logged_in'] === true;
    }

    /**
     * Check if admin is logged in
     */
    public function isAdminLoggedIn(): bool
    {
        return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
    }

    /**
     * Get current user data
     */
    public function getCurrentUser(): ?array
    {
        if (!$this->isLoggedIn()) {
            return null;
        }

        return [
            'id' => $_SESSION['user_id'],
            'nama' => $_SESSION['user_nama'],
            'email' => $_SESSION['user_email'],
            'type' => 'user'
        ];
    }

    /**
     * Get current admin data
     */
    public function getCurrentAdmin(): ?array
    {
        if (!$this->isAdminLoggedIn()) {
            return null;
        }

        return [
            'id' => $_SESSION['admin_id'],
            'nama' => $_SESSION['admin_nama'],
            'email' => $_SESSION['admin_email'],
            'role' => $_SESSION['admin_role'],
            'type' => 'admin'
        ];
    }

    /**
     * Require user login
     */
    public function requireLogin(): void
    {
        if (!$this->isLoggedIn()) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Login required',
                'redirect' => 'login.html'
            ]);
            exit;
        }
    }

    /**
     * Require admin login
     */
    public function requireAdminLogin(): void
    {
        if (!$this->isAdminLoggedIn()) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Admin login required',
                'redirect' => 'admin/login.html'
            ]);
            exit;
        }
    }
}
