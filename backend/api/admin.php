<?php
/**
 * Admin endpoints — every action requires a Bearer token whose user has
 * role = 'admin'.
 *
 *   GET  admin.php?action=stats            dashboard counters
 *   GET  admin.php?action=bookings         all bookings, newest first
 *   POST admin.php?action=booking-status   {id, status}
 *   GET  admin.php?action=messages         all contact messages
 *   POST admin.php?action=message-read     {id}
 *   POST admin.php?action=message-delete   {id}
 *   GET  admin.php?action=subscribers      newsletter subscribers
 *   GET  admin.php?action=users            registered users
 *   GET  admin.php?action=packages         all packages (incl. inactive)
 *   POST admin.php?action=package-save     {id?, title, destination, price, duration, category, difficulty, maxTravelers, bestTime, image, description, isActive}
 *   POST admin.php?action=package-toggle   {id}
 */

require __DIR__ . '/config.php';

requireAdmin();

$action = $_GET['action'] ?? '';

switch ($action) {
    /* ── Dashboard ────────────────────────────────────────────────── */
    case 'stats':
        $one = fn(string $sql) => (float)db()->query($sql)->fetchColumn();
        ok([
            'bookingsTotal'   => (int)$one('SELECT COUNT(*) FROM bookings'),
            'bookingsPending' => (int)$one("SELECT COUNT(*) FROM bookings WHERE status = 'pending'"),
            'revenue'         => $one("SELECT COALESCE(SUM(total_price),0) FROM bookings WHERE status IN ('confirmed','completed')"),
            'pipeline'        => $one("SELECT COALESCE(SUM(total_price),0) FROM bookings WHERE status = 'pending'"),
            'users'           => (int)$one('SELECT COUNT(*) FROM users'),
            'subscribers'     => (int)$one('SELECT COUNT(*) FROM newsletter_subscribers'),
            'messagesUnread'  => (int)$one('SELECT COUNT(*) FROM contact_messages WHERE is_read = 0'),
            'packagesActive'  => (int)$one('SELECT COUNT(*) FROM packages WHERE is_active = 1'),
        ]);

    /* ── Bookings ─────────────────────────────────────────────────── */
    case 'bookings':
        $rows = db()->query(
            'SELECT b.*, p.title AS package_title
               FROM bookings b JOIN packages p ON p.id = b.package_id
              ORDER BY b.created_at DESC'
        )->fetchAll();
        ok(array_map(fn($r) => [
            'id'           => $r['booking_ref'],
            'packageTitle' => $r['package_title'],
            'fullName'     => $r['full_name'],
            'email'        => $r['email'],
            'phone'        => $r['phone'],
            'travelers'    => (int)$r['travelers'],
            'startDate'    => $r['start_date'],
            'totalPrice'   => (float)$r['total_price'],
            'status'       => $r['status'],
            'createdAt'    => $r['created_at'],
            'isGuest'      => $r['user_id'] === null,
        ], $rows));

    case 'booking-status':
        $b      = body();
        $ref    = trim($b['id'] ?? '');
        $status = $b['status'] ?? '';
        if (!in_array($status, ['pending', 'confirmed', 'completed', 'cancelled'], true)) {
            fail('Invalid status');
        }
        $stmt = db()->prepare('UPDATE bookings SET status = ? WHERE booking_ref = ?');
        $stmt->execute([$status, $ref]);
        $stmt->rowCount() ? ok(['id' => $ref, 'status' => $status]) : fail('Booking not found', 404);

    /* ── Contact messages ─────────────────────────────────────────── */
    case 'messages':
        $rows = db()->query('SELECT * FROM contact_messages ORDER BY created_at DESC')->fetchAll();
        ok(array_map(fn($r) => [
            'id'        => (int)$r['id'],
            'name'      => $r['name'],
            'email'     => $r['email'],
            'phone'     => $r['phone'],
            'message'   => $r['message'],
            'isRead'    => (bool)$r['is_read'],
            'createdAt' => $r['created_at'],
        ], $rows));

    case 'message-read':
        $stmt = db()->prepare('UPDATE contact_messages SET is_read = 1 WHERE id = ?');
        $stmt->execute([(int)(body()['id'] ?? 0)]);
        ok(['updated' => $stmt->rowCount() > 0]);

    case 'message-delete':
        $stmt = db()->prepare('DELETE FROM contact_messages WHERE id = ?');
        $stmt->execute([(int)(body()['id'] ?? 0)]);
        ok(['deleted' => $stmt->rowCount() > 0]);

    /* ── Newsletter ───────────────────────────────────────────────── */
    case 'subscribers':
        $rows = db()->query('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC')->fetchAll();
        ok(array_map(fn($r) => [
            'id'        => (int)$r['id'],
            'email'     => $r['email'],
            'createdAt' => $r['created_at'],
        ], $rows));

    /* ── Users ────────────────────────────────────────────────────── */
    case 'users':
        $rows = db()->query(
            'SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC'
        )->fetchAll();
        ok(array_map(fn($r) => [
            'id'        => (int)$r['id'],
            'name'      => $r['name'],
            'email'     => $r['email'],
            'phone'     => $r['phone'],
            'role'      => $r['role'],
            'createdAt' => $r['created_at'],
        ], $rows));

    /* ── Packages ─────────────────────────────────────────────────── */
    case 'packages':
        $rows = db()->query('SELECT * FROM packages ORDER BY id')->fetchAll();
        ok(array_map(fn($r) => [
            'id'           => (int)$r['id'],
            'title'        => $r['title'],
            'destination'  => $r['destination'],
            'duration'     => (int)$r['duration_days'],
            'price'        => (float)$r['price'],
            'image'        => $r['image'],
            'category'     => $r['category'],
            'difficulty'   => $r['difficulty'],
            'maxTravelers' => (int)$r['max_travelers'],
            'bestTime'     => $r['best_time'],
            'description'  => $r['description'],
            'isActive'     => (bool)$r['is_active'],
        ], $rows));

    case 'package-save':
        $b = body();
        $fields = [
            'title'       => trim($b['title'] ?? ''),
            'destination' => trim($b['destination'] ?? ''),
            'price'       => (float)($b['price'] ?? 0),
            'duration'    => max(1, (int)($b['duration'] ?? 1)),
        ];
        if ($fields['title'] === '' || $fields['destination'] === '' || $fields['price'] <= 0) {
            fail('title, destination and a positive price are required');
        }
        $difficulty = in_array($b['difficulty'] ?? '', ['Easy', 'Medium', 'Hard'], true)
            ? $b['difficulty'] : 'Easy';
        $common = [
            $fields['title'],
            $fields['destination'],
            $fields['duration'],
            $fields['price'],
            trim($b['image'] ?? ''),
            trim($b['category'] ?? 'safari'),
            $difficulty,
            max(1, (int)($b['maxTravelers'] ?? 10)),
            trim($b['bestTime'] ?? 'Year-round'),
            trim($b['description'] ?? ''),
            !empty($b['isActive']) ? 1 : 0,
        ];

        $id = (int)($b['id'] ?? 0);
        if ($id > 0) {
            $stmt = db()->prepare(
                'UPDATE packages SET title=?, destination=?, duration_days=?, price=?, image=?,
                        category=?, difficulty=?, max_travelers=?, best_time=?, description=?, is_active=?
                  WHERE id=?'
            );
            $stmt->execute([...$common, $id]);
        } else {
            $stmt = db()->prepare(
                'INSERT INTO packages
                    (title, destination, duration_days, price, image, category, difficulty,
                     max_travelers, best_time, description, is_active, highlights, inclusions)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "[]", "[]")'
            );
            $stmt->execute($common);
            $id = (int)db()->lastInsertId();
        }
        ok(['id' => $id, 'saved' => true]);

    case 'package-toggle':
        $stmt = db()->prepare('UPDATE packages SET is_active = 1 - is_active WHERE id = ?');
        $stmt->execute([(int)(body()['id'] ?? 0)]);
        ok(['toggled' => $stmt->rowCount() > 0]);

    default:
        fail('Unknown admin action', 404);
}
