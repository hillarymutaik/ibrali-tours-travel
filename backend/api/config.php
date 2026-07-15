<?php
/**
 * Ibrali Tours & Travel API — shared config & helpers.
 * Runs on XAMPP (Apache + PHP 8 + MariaDB/MySQL).
 */

declare(strict_types=1);

const TOKEN_TTL_DAYS = 30;

/* Database credentials live in config.local.php (gitignored, never
   committed). Copy config.local.example.php to config.local.php and
   fill in your values. */
$GLOBALS['DB_CONFIG'] = is_file(__DIR__ . '/config.local.php')
    ? require __DIR__ . '/config.local.php'
    : null;

/* ── CORS (the React dev server runs on another port) ─────────────── */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/* ── Database ──────────────────────────────────────────────────────── */
function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $cfg = $GLOBALS['DB_CONFIG'];
        if (!is_array($cfg)) {
            fail('Missing backend/api/config.local.php — copy config.local.example.php and set your database credentials.', 500);
        }
        try {
            $pdo = new PDO(
                'mysql:host=' . $cfg['host'] . ';dbname=' . $cfg['name'] . ';charset=utf8mb4',
                $cfg['user'],
                $cfg['pass'],
                [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]
            );
        } catch (PDOException $e) {
            fail('Database connection failed. Import backend/database/ibrali.sql and check config.local.php.', 500);
        }
    }
    return $pdo;
}

/* ── JSON responses ────────────────────────────────────────────────── */
function ok(mixed $data = null, int $code = 200): never
{
    http_response_code($code);
    echo json_encode(['ok' => true, 'data' => $data]);
    exit;
}

function fail(string $message, int $code = 400): never
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

/* ── Request body ──────────────────────────────────────────────────── */
function body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '[]', true);
    return is_array($data) ? $data : [];
}

/* ── Bearer-token auth ─────────────────────────────────────────────── */
function bearerToken(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION']
        ?? apache_request_headers()['Authorization']
        ?? '';
    return preg_match('/Bearer\s+(\S+)/i', $header, $m) ? $m[1] : null;
}

/** Returns the authenticated user row, or null. */
function currentUser(): ?array
{
    $token = bearerToken();
    if (!$token) {
        return null;
    }
    $stmt = db()->prepare(
        'SELECT u.id, u.name, u.email, u.phone, u.role
           FROM auth_tokens t
           JOIN users u ON u.id = t.user_id
          WHERE t.token_hash = ? AND t.expires_at > NOW()'
    );
    $stmt->execute([hash('sha256', $token)]);
    return $stmt->fetch() ?: null;
}

/** Like currentUser() but responds 401 when not signed in. */
function requireUser(): array
{
    return currentUser() ?? fail('Authentication required', 401);
}

/** Issues a fresh token for a user and returns the raw value. */
function issueToken(int $userId): string
{
    $raw = bin2hex(random_bytes(32));
    $stmt = db()->prepare(
        'INSERT INTO auth_tokens (user_id, token_hash, expires_at)
         VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ' . TOKEN_TTL_DAYS . ' DAY))'
    );
    $stmt->execute([$userId, hash('sha256', $raw)]);
    return $raw;
}
