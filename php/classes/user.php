<?php

/**
 * User Management Class
 * Flowers Shop Project - Phase 1.3
 * Updated sesuai database structure
 */

require_once __DIR__ . '/Database.php';

class User
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Register new user
     */
    public function register(array $data): array
    {
        try {
            // Validate required fields
            $required = ['username', 'email', 'password', 'full_name'];
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    throw new Exception("Field {$field} is required");
                }
            }

            // Check if email or username already exists
            $stmt = $this->db->getConnection()->prepare(
                "SELECT id FROM users WHERE email = ? OR username = ?"
            );
            $stmt->execute([$data['email'], $data['username']]);

            if ($stmt->rowCount() > 0) {
                throw new Exception("Email or username already exists");
            }

            // Hash password
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

            // Insert new user
            $sql = "INSERT INTO users (username, email, password, full_name, phone, address, status, created_at) 
                    VALUES (?, ?, ?, ?, ?, ?, 'active', NOW())";

            $stmt = $this->db->getConnection()->prepare($sql);
            $stmt->execute([
                $data['username'],
                $data['email'],
                $hashedPassword,
                $data['full_name'],
                $data['phone'] ?? null,
                $data['address'] ?? null
            ]);

            return [
                'success' => true,
                'message' => 'User registered successfully',
                'user_id' => $this->db->getConnection()->lastInsertId()
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Get user by ID
     */
    public function getById(int $userId): ?array
    {
        $stmt = $this->db->getConnection()->prepare(
            "SELECT id, username, email, full_name, phone, address, status, created_at 
             FROM users WHERE id = ? AND status = 'active'"
        );
        $stmt->execute([$userId]);

        return $stmt->fetch() ?: null;
    }

    /**
     * Get user by email (untuk login)
     */
    public function getByEmail(string $email): ?array
    {
        $stmt = $this->db->getConnection()->prepare(
            "SELECT id, username, email, password, full_name, phone, address, status 
             FROM users WHERE email = ?"
        );
        $stmt->execute([$email]);

        return $stmt->fetch() ?: null;
    }

    /**
     * Update user profile
     */
    public function updateProfile(int $userId, array $data): array
    {
        try {
            $allowedFields = ['full_name', 'phone', 'address'];
            $updateFields = [];
            $values = [];

            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updateFields[] = "{$field} = ?";
                    $values[] = $data[$field];
                }
            }

            if (empty($updateFields)) {
            
// ...existing code...
$stmt = $this->db->getConnection()->prepare(
    "SELECT id, username, email, full_name, phone, status, created_at 
     FROM users ORDER BY created_at DESC LIMIT $limit OFFSET $offset"
);
$stmt->execute();
// ...existing code...
            $stmt->execute($values);

            return [
                'success' => true,
                'message' => 'Profile updated successfully'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Change password
     */
    public function changePassword(int $userId, string $oldPassword, string $newPassword): array
    {
        try {
            // Get current password
            $stmt = $this->db->getConnection()->prepare("SELECT password FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($oldPassword, $user['password'])) {
                throw new Exception("Current password is incorrect");
            }

            // Update password
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            $stmt = $this->db->getConnection()->prepare(
                "UPDATE users SET password = ? WHERE id = ?"
            );
            $stmt->execute([$hashedPassword, $userId]);

            return [
                'success' => true,
                'message' => 'Password changed successfully'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Get all users (untuk admin)
     */
    public function getAll(int $page = 1, int $limit = 10): array
    {
        $offset = ($page - 1) * $limit;

        // Get total count
        $totalStmt = $this->db->getConnection()->prepare("SELECT COUNT(*) as total FROM users");
        $totalStmt->execute();
        $total = $totalStmt->fetch()['total'];

        // Get users
        $stmt = $this->db->getConnection()->prepare(
            "SELECT id, username, email, full_name, phone, status, created_at 
             FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?"
        );
        $stmt->execute([$limit, $offset]);

        return [
            'users' => $stmt->fetchAll(),
            'pagination' => [
                'current_page' => $page,
                'total_pages' => ceil($total / $limit),
                'total_items' => $total,
                'items_per_page' => $limit
            ]
        ];
    }
}
