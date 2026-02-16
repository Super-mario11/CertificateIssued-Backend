function getResetEmailHtml(resetUrl, expiryMinutes) {
  return `
    <p>Your admin password reset was requested.</p>
    <p>This link will expire in ${expiryMinutes} minutes.</p>
    <p><a href="${resetUrl}">Reset password</a></p>
    <p>If you did not request this, you can ignore this email.</p>
  `;
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
  expiryMinutes
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error(
      "Email service not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL."
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Admin password reset",
      html: getResetEmailHtml(resetUrl, expiryMinutes)
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Failed to send reset email: ${details}`);
  }
}

