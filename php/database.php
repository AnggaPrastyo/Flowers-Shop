<?php
// ===============================================
// STEP 1.2: ENHANCED DATABASE CLASS
// File: php/database.php
// Upgrade dari database.php yang sudah ada
// ===============================================

class Database
{
    private $host = 'localhost';
    private $username = 'root';
    private $password = '';
    private $database = 'flowers_shop';

    // Make $pdo public so it can be accessed from Auth class
    public $pdo;

    // Singleton pattern - hanya satu instance database
    private static $instance = null;

    public function __construct()
    {
        try {
            // Create PDO connection
            $this->pdo = new PDO(
                "mysql:host={$this->host};dbname={$this->database};charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_PERSISTENT => true // Persistent connection
                ]
            );
        } catch (PDOException $e) {
            // Improved error handling
            error_log("Database Connection Error: " . $e->getMessage());
            die("Database connection failed. Please try again later.");
        }
    }

    // ===============================================
    // SINGLETON PATTERN - NEW FEATURE
    // ===============================================
    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    // ===============================================
    // EXISTING METHODS - UNCHANGED
    // ===============================================

    // Getter method untuk PDO (alternative)
    public function getPdo()
    {
        return $this->pdo;
    }

    // Get host info
    public function getHost()
    {
        return $this->host;
    }

    // Get database name
    public function getDatabase()
    {
        return $this->database;
    }

    // Test connection - IMPROVED
    public function testConnection()
    {
        try {
            $stmt = $this->pdo->query("SELECT 1");
            $result = $stmt->fetch();
            return $result ? true : false;
        } catch (Exception $e) {
            return false;
        }
    }

    // ===============================================
    // NEW ENHANCED METHODS
    // ===============================================

    /**
     * Execute a prepared statement with parameters
     * @param string $query SQL query with placeholders
     * @param array $params Parameters to bind
     * @return PDOStatement
     */
    public function execute($query, $params = [])
    {
        try {
            $stmt = $this->pdo->prepare($query);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Database Execute Error: " . $e->getMessage());
            throw new Exception("Database operation failed");
        }
    }

    /**
     * Fetch single row
     * @param string $query SQL query
     * @param array $params Parameters
     * @return array|false
     */
    public function fetchOne($query, $params = [])
    {
        $stmt = $this->execute($query, $params);
        return $stmt->fetch();
    }

    /**
     * Fetch all rows
     * @param string $query SQL query
     * @param array $params Parameters
     * @return array
     */
    public function fetchAll($query, $params = [])
    {
        $stmt = $this->execute($query, $params);
        return $stmt->fetchAll();
    }

    /**
     * Insert data and return last insert ID
     * @param string $table Table name
     * @param array $data Associative array of data
     * @return string Last insert ID
     */
    public function insert($table, $data)
    {
        $columns = implode(',', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));

        $query = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})";
        $this->execute($query, $data);

        return $this->pdo->lastInsertId();
    }

    /**
     * Update data
     * @param string $table Table name
     * @param array $data Data to update
     * @param string $where WHERE clause
     * @param array $whereParams WHERE parameters
     * @return int Number of affected rows
     */
    public function update($table, $data, $where, $whereParams = [])
    {
        $set = [];
        foreach (array_keys($data) as $key) {
            $set[] = "{$key} = :{$key}";
        }
        $setClause = implode(', ', $set);

        $query = "UPDATE {$table} SET {$setClause} WHERE {$where}";
        $params = array_merge($data, $whereParams);

        $stmt = $this->execute($query, $params);
        return $stmt->rowCount();
    }

    /**
     * Delete data
     * @param string $table Table name
     * @param string $where WHERE clause
     * @param array $params WHERE parameters
     * @return int Number of affected rows
     */
    public function delete($table, $where, $params = [])
    {
        $query = "DELETE FROM {$table} WHERE {$where}";
        $stmt = $this->execute($query, $params);
        return $stmt->rowCount();
    }

    /**
     * Begin transaction
     */
    public function beginTransaction()
    {
        return $this->pdo->beginTransaction();
    }

    /**
     * Commit transaction
     */
    public function commit()
    {
        return $this->pdo->commit();
    }

    /**
     * Rollback transaction
     */
    public function rollback()
    {
        return $this->pdo->rollback();
    }

    /**
     * Check if record exists
     * @param string $table Table name
     * @param string $where WHERE clause
     * @param array $params Parameters
     * @return bool
     */
    public function exists($table, $where, $params = [])
    {
        $query = "SELECT 1 FROM {$table} WHERE {$where} LIMIT 1";
        $result = $this->fetchOne($query, $params);
        return $result ? true : false;
    }

    /**
     * Count records
     * @param string $table Table name
     * @param string $where WHERE clause (optional)
     * @param array $params Parameters (optional)
     * @return int
     */
    public function count($table, $where = '', $params = [])
    {
        $query = "SELECT COUNT(*) as count FROM {$table}";
        if ($where) {
            $query .= " WHERE {$where}";
        }

        $result = $this->fetchOne($query, $params);
        return (int) $result['count'];
    }

    /**
     * Get database info for debugging
     * @return array
     */
    public function getInfo()
    {
        return [
            'host' => $this->host,
            'database' => $this->database,
            'connection_status' => $this->testConnection() ? 'Connected' : 'Disconnected',
            'server_info' => $this->pdo->getAttribute(PDO::ATTR_SERVER_INFO),
            'driver_name' => $this->pdo->getAttribute(PDO::ATTR_DRIVER_NAME),
            'server_version' => $this->pdo->getAttribute(PDO::ATTR_SERVER_VERSION)
        ];
    }

    // ===============================================
    // DESTRUCTOR
    // ===============================================
    public function __destruct()
    {
        $this->pdo = null;
    }
}
