<?php
/**
 * Auth endpoints:
 *   POST auth.php?action=register         {name, email, phone, password}
 *   POST auth.php?action=login            {email, password}
 *   POST auth.php?action=logout           (Bearer token)
 *   GET  auth.php?action=me               (Bearer token)
 *   POST auth.php?action=change-password  (Bearer) {currentPassword, newPassword}
 *   POST auth.php?action=forgot-password  {email} → issues a 6-digit reset code
 *   POST auth.php?action=reset-password   {email, code, newPassword}
 *
 * Local XAMPP has no mail server, so forgot-password returns the reset
 * code in the response (a production deployment would email it instead).
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

    case 'change-password':
        $user = requireUser();
        $b = body();
        $current = (string)($b['currentPassword'] ?? '');
        $new     = (string)($b['newPassword'] ?? '');
        if (strlen($new) < 6) {
            fail('New password must be at least 6 characters');
        }

        $stmt = db()->prepare('SELECT password_hash FROM users WHERE id = ?');
        $stmt->execute([$user['id']]);
        $hash = $stmt->fetchColumn();
        if (!$hash || !password_verify($current, $hash)) {
            fail('Current password is incorrect', 401);
        }

        db()->prepare('UPDATE users SET password_hash = ? WHERE id = ?')
            ->execute([password_hash($new, PASSWORD_DEFAULT), $user['id']]);

        // Revoke every other session; keep the one making this request
        db()->prepare('DELETE FROM auth_tokens WHERE user_id = ? AND token_hash <> ?')
            ->execute([$user['id'], hash('sha256', bearerToken())]);

        ok(['changed' => true]);

    case 'forgot-password':
        $email = strtolower(trim(body()['email'] ?? ''));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            fail('Invalid email address');
        }

        $stmt = db()->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$email]);
        if (!$stmt->fetch()) {
            // Do not reveal whether the account exists
            ok(['sent' => true]);
        }

        $code = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        db()->prepare('DELETE FROM password_resets WHERE email = ?')->execute([$email]);
        db()->prepare(
            'INSERT INTO password_resets (email, token_hash, expires_at)
             VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))'
        )->execute([$email, hash('sha256', $code)]);

        // No mail server on local XAMPP — return the code so the flow works.
        ok(['sent' => true, 'resetCode' => $code, 'expiresInMinutes' => 15]);

    case 'reset-password':
        $b = body();
        $email = strtolower(trim($b['email'] ?? ''));
        $code  = trim($b['code'] ?? '');
        $new   = (string)($b['newPassword'] ?? '');
        if (strlen($new) < 6) {
            fail('New password must be at least 6 characters');
        }

        $stmt = db()->prepare(
            'SELECT id FROM password_resets
              WHERE email = ? AND token_hash = ? AND expires_at > NOW()'
        );
        $stmt->execute([$email, hash('sha256', $code)]);
        if (!$stmt->fetch()) {
            fail('Invalid or expired reset code', 401);
        }

        db()->prepare('UPDATE users SET password_hash = ? WHERE email = ?')
            ->execute([password_hash($new, PASSWORD_DEFAULT), $email]);
        db()->prepare('DELETE FROM password_resets WHERE email = ?')->execute([$email]);
        db()->prepare(
            'DELETE t FROM auth_tokens t JOIN users u ON u.id = t.user_id WHERE u.email = ?'
        )->execute([$email]);

        ok(['reset' => true]);

    default:
        fail('Unknown action. Use register, login, logout, me, change-password, forgot-password or reset-password.', 404);
}
