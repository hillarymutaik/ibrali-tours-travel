# Ibrali Tours & Travel — Backend (XAMPP)

PHP 8 + MySQL/MariaDB REST API for the React frontend.

| | |
|---|---|
| Database | `ibrali` |
| DB username | `ibrali` |
| DB password | set your own — see setup step 2 |
| API base URL | `http://localhost/ibrali-api` |
| Demo login | `demo@example.com` / `password123` |
| Admin login | `ibralitoureskenya@gmail.com` / `admin2026` — local demo credential; change it if this backend ever faces the internet |

The admin dashboard is a standalone app at **/#/admin** — it has its own
login screen and its own session, completely separate from the public
website. Use it to manage bookings, packages, contact messages,
subscribers and user roles.

## Setup (one time)

1. **Start XAMPP** — Apache and MySQL modules.

2. **Pick a database password.** Edit `backend/database/ibrali.sql` and
   replace `CHANGE_ME_PASSWORD` with your own password. Then copy
   `backend/api/config.local.example.php` to `backend/api/config.local.php`
   and put the same password there. (`config.local.php` is gitignored —
   credentials never get committed.)

3. **Import the database** (creates the `ibrali` database, the `ibrali`
   MySQL account, all tables, and seed data):

   ```
   C:\xampp\mysql\bin\mysql.exe -u root < backend\database\ibrali.sql
   ```

   …or open phpMyAdmin → Import → choose `backend/database/ibrali.sql`.

4. **Expose the API through Apache.** Either copy `backend/api` to
   `C:\xampp\htdocs\ibrali-api`, or (better — stays in sync with the repo)
   create a junction:

   ```powershell
   New-Item -ItemType Junction -Path "C:\xampp\htdocs\ibrali-api" -Target "<repo>\backend\api"
   ```

5. **Verify** — open <http://localhost/ibrali-api/>. You should see
   `"database": "connected"` and the endpoint list.

The React app points at `http://localhost/ibrali-api` by default
(`src/utils/constants.js`); override with a `VITE_API_URL` env var.
When the API is unreachable (e.g. the static GitHub Pages demo), the
frontend automatically falls back to its original localStorage mock.

## Endpoints

All responses are JSON: `{ "ok": true, "data": … }` or `{ "ok": false, "error": "…" }`.
Authenticated calls send `Authorization: Bearer <token>` (token returned by login/register, valid 30 days).

| Method | Endpoint | Auth | Body / notes |
|---|---|---|---|
| POST | `auth.php?action=register` | — | `{name, email, phone, password}` → user + token |
| POST | `auth.php?action=login` | — | `{email, password}` → user + token |
| POST | `auth.php?action=logout` | Bearer | revokes the token |
| GET | `auth.php?action=me` | Bearer | current user |
| POST | `auth.php?action=change-password` | Bearer | `{currentPassword, newPassword}` — revokes other sessions |
| POST | `auth.php?action=forgot-password` | — | `{email}` → 6-digit reset code, 15-min expiry (returned in the response locally; emailed in production) |
| POST | `auth.php?action=reset-password` | — | `{email, code, newPassword}` |
| GET | `packages.php` | — | all active packages |
| GET | `packages.php?id=1` | — | one package |
| GET | `bookings.php` | Bearer | the signed-in user's bookings |
| POST | `bookings.php` | optional | `{packageId, fullName, email, phone, travelers, startDate, specialRequests}` — guests allowed; total price computed server-side |
| POST | `bookings.php?action=cancel` | Bearer | `{id: "IBR-…"}` — own pending/confirmed bookings only |
| POST | `contact.php` | — | `{name, email, phone, message}` |
| POST | `newsletter.php` | — | `{email}` (idempotent) |
| GET/POST | `admin.php?action=…` | Bearer (admin role) | `stats`, `bookings`, `booking-status`, `messages`, `message-read`, `message-delete`, `subscribers`, `users`, `packages`, `package-save`, `package-toggle` |

## Tables

`users`, `auth_tokens`, `packages`, `bookings`, `contact_messages`,
`newsletter_subscribers` — see `database/ibrali.sql`. Passwords are
bcrypt-hashed; session tokens are stored as SHA-256 hashes.

Use **phpMyAdmin** (<http://localhost/phpmyadmin>, database `ibrali`) to
review bookings, contact messages, and newsletter subscribers.
