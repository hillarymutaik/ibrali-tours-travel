<?php
/**
 * Auth endpoints:
 *   POST auth.php?action=register  {name, email, phone, password}
 *   POST auth.php?action=login     {email, password}
 *   POST auth.php?action=logout    (Bearer token)
 *   GET  auth.php?action=me        (Bearer token)
 */

require __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'register':
        $b = body();
        $name     = trim($b['name'] ?? '');
        $email    = strtolower(trim($b['email'] ?? ''));
        $phone    = trim($b['phone'] ?? '');
        $password = (string)($b['password'] ?? '');

        if ($name === '' || $email === '' || $password === '') {
            fail('Name, email and password are required');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            fail('Invalid email address');
        }
        if (strlen($password) < 6) {
            fail('Password must be at least 6 characters');
        }

        $exists = db()->prepare('SELECT id FROM users WHERE email = ?');
        $exists->execute([$email]);
        if ($exists->fetch()) {
            fail('User already exists', 409);
        }

        $stmt = db()->prepare(
            'INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([$name, $email, $phone, password_hash($password, PASSWORD_DEFAULT)]);
        $id = (int)db()->lastInsertId();

        ok([
            'user'  => ['id' => $id, 'name' => $name, 'email' => $email, 'phone' => $phone, 'role' => 'customer'],
            'token' => issueToken($id),
        ], 201);

    case 'login':
        $b = body();
        $email    = strtolower(trim($b['email'] ?? ''));
        $password = (string)($b['password'] ?? '');

        $stmt = db()->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            fail('Invalid email or password', 401);
        }

        ok([
            'user' => [
                'id'    => (int)$user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'role'  => $user['role'],
            ],
            'token' => issueToken((int)$user['id']),
        ]);

    case 'logout':
        $token = bearerToken();
        if ($token) {
            $stmt = db()->prepare('DELETE FROM auth_tokens WHERE token_hash = ?');
            $stmt->execute([hash('sha256', $token)]);
        }
        ok(['loggedOut' => true]);

    case 'me':
        ok(['user' => requireUser()]);

    default:
        fail('Unknown action. Use register, login, logout or me.', 404);
}
