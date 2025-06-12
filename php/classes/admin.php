<?php

/**
 * Admin Management Class
 * Flowers Shop Project - Phase 1.3
 * Updated sesuai database structure
 */

require_once __DIR__ . '/Database.php';

class Admin
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Get admin by email (untuk login)
     */
    public function getByEmail(string $email): ?array
    {
        $stmt = $this->db->getConnection()->prepare(
            "SELECT id, username, email, password, role, full_name, status 
             FROM admins WHERE email = ?"
        );
        $stmt->execute([$email]);

        return $stmt->fetch() ?: null;
    }

    /**
     * Get admin by ID
     */
    public function getById(int $adminId): ?array
    {
        $stmt = $this->db->getConnection()->prepare(
            "SELECT id, username, email, role, full_name, status, created_at 
             FROM admins WHERE id = ? AND status = 'active'"
        );
        $stmt->execute([$adminId]);

        return $stmt->fetch() ?: null;
    }

    /**
     * Create new admin (only by super_admin)
     */
    public function create(array $data, string $creatorRole): array
    {
        try {
            // Only super_admin can create new admin
            if ($creatorRole !== 'super_admin') {
                throw new Exception("Unauthorized: Only super admin can create new admin");
            }

            // Validate required fields
            $required = ['username', 'email', 'password', 'full_name', 'role'];
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    throw new Exception("Field {$field} is required");
                }
            }

            // Validate role
            $validRoles = ['admin', 'super_admin'];
            if (!in_array($data['role'], $validRoles)) {
                throw new Exception("Invalid role. Must be: " . implode(', ', $validRoles));
            }

            // Check if email already exists
            $stmt = $this->db->getConnection()->prepare(
                "SELECT id FROM admins WHERE email = ? OR username = ?"
            );
            $stmt->execute([$data['email'], $data['username']]);

            if ($stmt->rowCount() > 0) {
                throw new Exception("Email or username already exists");
            }

            // Hash password
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

            // Insert new admin
            $sql = "INSERT INTO admins (username, email, password, role, full_name, status, created_at) 
                    VALUES (?, ?, ?, ?, ?, 'active', NOW())";

            $stmt = $this->db->getConnection()->prepare($sql);
            $stmt->execute([
                $data['username'],
                $data['email'],
                $hashedPassword,
                $data['role'],
                $data['full_name']
            ]);

            return [
                'success' => true,
                'message' => 'Admin created successfully',
                'admin_id' => $this->db->getConnection()->lastInsertId()
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Get all admins (pagination)
     */
    public function getAll(int $page = 1, int $limit = 10): array
    {
        $offset = ($page - 1) * $limit;

        // Get total count
        $totalStmt = $this->db->getConnection()->prepare("SELECT COUNT(*) as total FROM admins WHERE status = 'active'");
        $totalStmt->execute();
        $total = $totalStmt->fetch()['total'];

        // Get admins
        $stmt = $this->db->getConnection()->prepare(
            "SELECT id, username, email, role, full_name, status, created_at 
             FROM admins WHERE status = 'active' 
             ORDER BY created_at DESC LIMIT ? OFFSET ?"
        );
        $stmt->execute([$limit, $offset]);

        return [
            'admins' => $stmt->fetchAll(),
            'pagination' => [
                'current_page' => $page,
                'total_pages' => ceil($total / $limit),
                'total_items' => $total,
                'items_per_page' => $limit
            ]
        ];
    }

    /**
     * Update admin profile
     */
    public function updateProfile(int $adminId, array $data): array
    {
        try {
            $allowedFields = ['full_name'];
            $updateFields = [];
            $values = [];

            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updateFields[] = "{$field} = ?";
                    $values[] = $data[$field];
                }
            }

            if (empty($updateFields)) {
                throw new Exception("No valid fields to update");
            }

            $values[] = $adminId;
            $sql = "UPDATE admins SET " . implode(', ', $updateFields) . " WHERE id = ?";

            $stmt = $this->db->getConnection()->prepare($sql);
            $stmt->execute($values);

            return [
                'success' => true,
                'message' => 'Admin profile updated successfully'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}
