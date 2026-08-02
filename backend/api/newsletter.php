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

// Only notify on a genuinely new subscription, not a repeat submission
if ($stmt->rowCount() > 0) {
    notifyAdmin(
        'New newsletter subscriber',
        '<h2 style="font-family:sans-serif">New newsletter subscriber</h2>'
            . '<table style="font-family:sans-serif;font-size:14px">'
            . notifyRow('Email', $email)
            . '</table>'
    );
}

ok(['subscribed' => $email], 201);
