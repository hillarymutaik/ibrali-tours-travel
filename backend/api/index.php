<?php
/**
 * API root — quick health check.
 *   GET http://localhost/ibrali-api/
 */

require __DIR__ . '/config.php';

$dbOk = true;
try {
    db()->query('SELECT 1');
} catch (Throwable) {
    $dbOk = false;
}

ok([
    'service'   => 'Ibrali Tours & Travel API',
    'database'  => $dbOk ? 'connected' : 'unavailable',
    'endpoints' => [
        'POST auth.php?action=register',
        'POST auth.php?action=login',
        'POST auth.php?action=logout',
        'GET  auth.php?action=me',
        'GET  packages.php',
        'GET  packages.php?id={id}',
        'GET  bookings.php',
        'POST bookings.php',
        'POST bookings.php?action=cancel',
        'POST contact.php',
        'POST newsletter.php',
    ],
]);
