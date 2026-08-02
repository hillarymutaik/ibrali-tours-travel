<?php
/**
 * Contact endpoint:
 *   POST contact.php  {name, email, phone, message}
 */

require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail('Method not allowed', 405);
}

$b       = body();
$name    = trim($b['name'] ?? '');
$email   = strtolower(trim($b['email'] ?? ''));
$phone   = trim($b['phone'] ?? '');
$message = trim($b['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    fail('Name, email and message are required');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('Invalid email address');
}

$stmt = db()->prepare(
    'INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)'
);
$stmt->execute([$name, $email, $phone, $message]);

notifyAdmin(
    'New contact message from ' . $name,
    '<h2 style="font-family:sans-serif">New contact message</h2>'
        . '<table style="font-family:sans-serif;font-size:14px">'
        . notifyRow('Name', $name)
        . notifyRow('Email', $email)
        . notifyRow('Phone', $phone ?: '—')
        . notifyRow('Message', $message)
        . '</table>',
    $email,
    $name
);

ok(['received' => true], 201);
