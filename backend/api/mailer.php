<?php
/**
 * Admin email notifications (bookings, contact messages, newsletter
 * signups) — sent over SMTP via PHPMailer, since XAMPP's local mail()
 * has no MTA configured and won't reach a real inbox.
 *
 * Configure under the 'smtp' key in config.local.php (see
 * config.local.example.php). Sending is best-effort: a failure here
 * never blocks the booking/message/subscription itself from being
 * saved — it's logged with error_log() and swallowed.
 */

require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

/**
 * Sends a notification email to the admin inbox.
 *
 * @param string      $subject
 * @param string      $htmlBody
 * @param string|null $replyToEmail set so the admin can hit "Reply" and reach the customer directly
 * @param string|null $replyToName
 * @return bool true on success, false if unsent (never throws)
 */
function notifyAdmin(string $subject, string $htmlBody, ?string $replyToEmail = null, ?string $replyToName = null): bool
{
    $cfg = $GLOBALS['DB_CONFIG']['smtp'] ?? null;
    if (!is_array($cfg) || empty($cfg['host']) || empty($cfg['user']) || empty($cfg['pass'])) {
        error_log('notifyAdmin: SMTP not configured — skipping email for "' . $subject . '"');
        return false;
    }

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = $cfg['host'];
        $mail->Port       = (int)($cfg['port'] ?? 587);
        $mail->SMTPAuth   = true;
        $mail->Username   = $cfg['user'];
        $mail->Password   = $cfg['pass'];
        $mail->SMTPSecure = $mail->Port === 465 ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom($cfg['from_email'] ?? $cfg['user'], $cfg['from_name'] ?? 'Ibrali Tours & Travel website');
        $mail->addAddress($cfg['admin_email'] ?? $cfg['user']);
        if ($replyToEmail) {
            $mail->addReplyTo($replyToEmail, $replyToName ?: $replyToEmail);
        }

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $htmlBody;
        $mail->AltBody  = trim(strip_tags(str_replace(['<br>', '<br/>', '<br />', '</p>'], "\n", $htmlBody)));

        $mail->send();
        return true;
    } catch (PHPMailerException | Exception $e) {
        error_log('notifyAdmin: send failed for "' . $subject . '" — ' . $e->getMessage());
        return false;
    }
}

/** Small helper to keep the notification templates consistent and escape user input. */
function notifyRow(string $label, string $value): string
{
    return '<tr><td style="padding:4px 12px 4px 0;color:#6B6560;white-space:nowrap;vertical-align:top">' . htmlspecialchars($label) . '</td>'
        . '<td style="padding:4px 0;color:#1C1A17;font-weight:600">' . nl2br(htmlspecialchars($value)) . '</td></tr>';
}
