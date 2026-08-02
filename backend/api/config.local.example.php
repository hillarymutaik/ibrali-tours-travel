<?php
/**
 * Copy this file to config.local.php and fill in your real values.
 * config.local.php is gitignored and must never be committed.
 */
return [
    'host' => '127.0.0.1',
    'name' => 'ibrali',
    'user' => 'ibrali',
    'pass' => 'YOUR_DB_PASSWORD',

    /**
     * Outgoing email for admin notifications (new booking, contact
     * message, newsletter signup) — sent over SMTP via PHPMailer.
     * XAMPP's local mail() has no mail server behind it, so this is
     * required for notifications to actually reach an inbox.
     *
     * Quickest setup with a Gmail account (e.g. mutaihillary01@gmail.com):
     *   1. Turn on 2-Step Verification: https://myaccount.google.com/security
     *   2. Create an App Password: https://myaccount.google.com/apppasswords
     *      (choose "Mail" as the app) — Google gives you a 16-character code.
     *   3. Put that code below as 'pass' (not your normal Gmail password).
     *
     * Leave 'host' empty to disable email sending — bookings, messages
     * and subscriptions still save to the database either way.
     */
    'smtp' => [
        'host'        => 'smtp.gmail.com',
        'port'        => 587,
        'user'        => 'YOUR_GMAIL_ADDRESS@gmail.com',
        'pass'        => 'YOUR_16_CHARACTER_APP_PASSWORD',
        'from_email'  => 'YOUR_GMAIL_ADDRESS@gmail.com',
        'from_name'   => 'Ibrali Tours & Travel Website',
        'admin_email' => 'mutaihillary01@gmail.com',
    ],
];
