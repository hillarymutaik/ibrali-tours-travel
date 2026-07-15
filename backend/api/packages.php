<?php
/**
 * Package endpoints:
 *   GET packages.php          → all active packages
 *   GET packages.php?id=3     → one package
 */

require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    fail('Method not allowed', 405);
}

/** Maps a DB row to the camelCase shape the React app expects. */
function mapPackage(array $row): array
{
    return [
        'id'           => (int)$row['id'],
        'title'        => $row['title'],
        'destination'  => $row['destination'],
        'duration'     => (int)$row['duration_days'],
        'price'        => (float)$row['price'],
        'image'        => $row['image'],
        'rating'       => (float)$row['rating'],
        'reviews'      => (int)$row['reviews'],
        'category'     => $row['category'],
        'description'  => $row['description'],
        'highlights'   => json_decode($row['highlights'] ?? '[]', true) ?: [],
        'inclusions'   => json_decode($row['inclusions'] ?? '[]', true) ?: [],
        'maxTravelers' => (int)$row['max_travelers'],
        'difficulty'   => $row['difficulty'],
        'bestTime'     => $row['best_time'],
    ];
}

if (isset($_GET['id'])) {
    $stmt = db()->prepare('SELECT * FROM packages WHERE id = ? AND is_active = 1');
    $stmt->execute([(int)$_GET['id']]);
    $row = $stmt->fetch();
    $row ? ok(mapPackage($row)) : fail('Package not found', 404);
}

$rows = db()->query('SELECT * FROM packages WHERE is_active = 1 ORDER BY id')->fetchAll();
ok(array_map('mapPackage', $rows));
