<?php

class UserRepository
{
    private $db;

    public function __construct($database)
    {
        $this->db = $database;
    }

    public function getById(int $userId): ?array
    {
        $stmt = $this->db->getConnection()->prepare(
            "SELECT id, username, email, full_name, phone, address, status, created_at 
             FROM users WHERE id = ? AND status = 'active'"
        );
        $stmt->execute([$userId]);

        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function getByEmail(string $email): ?array
    {
        $stmt = $this->db->getConnection()->prepare(
            "SELECT id, username, email, password, full_name, phone, address, status 
             FROM users WHERE email = ?"
        );
        $stmt->execute([$email]);

        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

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
                throw new Exception("No valid fields to update");
            }

            $values[] = $userId;
            $sql = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = ?";

            $stmt = $this->db->getConnection()->prepare($sql);
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

    public function getAll(int $page = 1, int $limit = 10): array
    {
        $offset = ($page - 1) * $limit;

        // Get total count
        $totalStmt = $this->db->getConnection()->prepare("SELECT COUNT(*) as total FROM users");
        $totalStmt->execute();
        $total = $totalStmt->fetch(PDO::FETCH_ASSOC)['total'];

        // Get users
        $limit = (int)$limit;
        $offset = (int)$offset;
        $stmt = $this->db->getConnection()->prepare(
            "SELECT id, username, email, full_name, phone, status, created_at 
             FROM users ORDER BY created_at DESC LIMIT $limit OFFSET $offset"
        );
        $stmt->execute();

        return [
            'users' => $stmt->fetchAll(PDO::FETCH_ASSOC),
            'pagination' => [
                'current_page' => $page,
                'total_pages' => ceil($total / $limit),
                'total_items' => $total,
                'items_per_page' => $limit
            ]
        ];
    }
}