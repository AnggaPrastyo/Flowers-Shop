<?php
// php/classes/Auth.php
// Class untuk handle authentication

// Fix path dengan absolute path dari document root
$root_path = $_SERVER['DOCUMENT_ROOT'] . '/flowers_shop';
require_once $root_path . '/php/database.php';

class Auth
{
    private $db;

    public function __construct()
    {
        // Inisialisasi database connection
        $database = new Database();
        $this->db = $database->pdo;

        // Start session jika belum
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
    }

    // Registrasi user baru
    public function registerUser($data): array
    {
        try {
            // Cek apakah email sudah terdaftar
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

            // Insert user baru
            $stmt = $this->db->prepare("INSERT INTO users (nama, email, password, created_at) VALUES (?, ?, ?, NOW())");
            $stmt->execute([
                $data['nama'],
                $data['email'],
                $hashedPassword
            ]);

            return [
                'success' => true,
                'message' => 'Registrasi berhasil',
                'user_id' => $this->db->lastInsertId()
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ];
        }
    }

    // Login user
    public function login($email, $password): array
    {
        try {
            // Cek user berdasarkan email
            $stmt = $this->db->prepare("SELECT id, nama, email, password FROM users WHERE email = ?");
            $stmt->execute([$email]);

            if ($stmt->rowCount() == 0) {
                return [
                    'success' => false,
                    'message' => 'Email tidak ditemukan'
                ];
            }

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Verifikasi password
            if (!password_verify($password, $user['password'])) {
                return [
                    'success' => false,
                    'message' => 'Password salah'
                ];
            }

            // Set session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_nama'] = $user['nama'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['is_logged_in'] = true;

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
                'message' => 'Error: ' . $e->getMessage()
            ];
        }
    }

    // Logout user
    public function logout(): array
    {
        try {
            // Hapus semua session
            session_unset();
            session_destroy();

            return [
                'success' => true,
                'message' => 'Logout berhasil'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ];
        }
    }

    // Cek apakah user sudah login
    public function isLoggedIn(): bool
    {
        return isset($_SESSION['is_logged_in']) && $_SESSION['is_logged_in'] === true;
    }

    // Get data user yang sedang login
    public function getCurrentUser(): array|null
    {
        if (!$this->isLoggedIn()) {
            return null;
        }

        return [
            'id' => $_SESSION['user_id'],
            'nama' => $_SESSION['user_nama'],
            'email' => $_SESSION['user_email']
        ];
    }
}
