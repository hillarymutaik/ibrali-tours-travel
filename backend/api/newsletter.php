<?php
/**
 * Newsletter endpoint:
 *   POST newsletter.php  {email}
 */

require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Method not allowed', 405);
}

$email = strtolower(trim(body()['email'] ?? ''));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('Invalid email address');
}

// INSERT IGNORE keeps re-subscribing idempotent
$stmt = db()->prepare('INSERT IGNORE INTO newsletter_subscribers (email) VALUES (?)');
$stmt->execute([$email]);

ok(['subscribed' => $email], 201);
