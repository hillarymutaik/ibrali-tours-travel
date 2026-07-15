<?php
/**
 * Booking endpoints:
 *   GET  bookings.php                 (Bearer) → the signed-in user's bookings
 *   POST bookings.php                 create a booking (Bearer optional; guests allowed)
 *        {packageId, fullName, email, phone, travelers, startDate, specialRequests}
 *   POST bookings.php?action=cancel   (Bearer) {id} → cancel own pending booking
 */

require __DIR__ . '/config.php';

/** Maps a DB row to the camelCase shape the React app expects. */
function mapBooking(array $row): array
{
    return [
        'id'              => $row['booking_ref'],
        'userId'          => $row['user_id'] !== null ? (int)$row['user_id'] : null,
        'packageId'       => (int)$row['package_id'],
        'packageTitle'    => $row['package_title'],
        'fullName'        => $row['full_name'],
        'email'           => $row['email'],
        'phone'           => $row['phone'],
        'travelers'       => (int)$row['travelers'],
        'startDate'       => $row['start_date'],
        'specialRequests' => $row['special_requests'],
        'totalPrice'      => (float)$row['total_price'],
        'status'          => $row['status'],
        'createdAt'       => $row['created_at'],
    ];
}

const BOOKING_SELECT =
    'SELECT b.*, p.title AS package_title
       FROM bookings b JOIN packages p ON p.id = b.package_id';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

/* ── List my bookings ─────────────────────────────────────────────── */
if ($method === 'GET') {
    $user = requireUser();
    $stmt = db()->prepare(BOOKING_SELECT . ' WHERE b.user_id = ? ORDER BY b.created_at DESC');
    $stmt->execute([$user['id']]);
    ok(array_map('mapBooking', $stmt->fetchAll()));
}

/* ── Cancel ───────────────────────────────────────────────────────── */
if ($method === 'POST' && $action === 'cancel') {
    $user = requireUser();
    $ref  = trim(body()['id'] ?? '');
    if ($ref === '') {
        fail('Booking id is required');
    }
    $stmt = db()->prepare(
        "UPDATE bookings SET status = 'cancelled'
          WHERE booking_ref = ? AND user_id = ? AND status IN ('pending','confirmed')"
    );
    $stmt->execute([$ref, $user['id']]);
    $stmt->rowCount()
        ? ok(['cancelled' => $ref])
        : fail('Booking not found or cannot be cancelled', 404);
}

/* ── Create ───────────────────────────────────────────────────────── */
if ($method === 'POST') {
    $b = body();
    $packageId = (int)($b['packageId'] ?? 0);
    $fullName  = trim($b['fullName'] ?? '');
    $email     = strtolower(trim($b['email'] ?? ''));
    $phone     = trim($b['phone'] ?? '');
    $travelers = max(1, (int)($b['travelers'] ?? 1));
    $startDate = trim($b['startDate'] ?? '');
    $requests  = trim($b['specialRequests'] ?? '');

    if (!$packageId || $fullName === '' || $email === '' || $phone === '' || $startDate === '') {
        fail('packageId, fullName, email, phone and startDate are required');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        fail('Invalid email address');
    }
    $date = DateTime::createFromFormat('Y-m-d', $startDate);
    if (!$date || $date->format('Y-m-d') !== $startDate) {
        fail('startDate must be YYYY-MM-DD');
    }

    $pkg = db()->prepare('SELECT id, title, price FROM packages WHERE id = ? AND is_active = 1');
    $pkg->execute([$packageId]);
    $package = $pkg->fetch() ?: fail('Package not found', 404);

    $user = currentUser(); // optional — guests may book too
    $ref  = 'IBR-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(2)));

    $stmt = db()->prepare(
        'INSERT INTO bookings
           (booking_ref, user_id, package_id, full_name, email, phone,
            travelers, start_date, special_requests, total_price)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $ref,
        $user['id'] ?? null,
        $packageId,
        $fullName,
        $email,
        $phone,
        $travelers,
        $startDate,
        $requests,
        (float)$package['price'] * $travelers,
    ]);

    $fetch = db()->prepare(BOOKING_SELECT . ' WHERE b.booking_ref = ?');
    $fetch->execute([$ref]);
    ok(mapBooking($fetch->fetch()), 201);
}

fail('Method not allowed', 405);
