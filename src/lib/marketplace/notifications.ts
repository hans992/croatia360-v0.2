import nodemailer from 'nodemailer';

type Decision = 'accepted' | 'declined' | 'contacted';

interface CustomerDecisionEmailInput {
  to: string;
  customerName: string;
  experienceTitle: string;
  requestedDate: string;
  decision: Decision;
  operatorName: string;
}

export async function sendCustomerDecisionEmail(input: CustomerDecisionEmailInput) {
  if (input.decision === 'contacted') return { sent: false as const, reason: 'not_required' as const };

  const host = process.env.SMTP_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    return { sent: false as const, reason: 'smtp_not_configured' as const };
  }

  const accepted = input.decision === 'accepted';
  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });

  const subject = accepted
    ? `Your Croatia360 request is available: ${input.experienceTitle}`
    : `Update on your Croatia360 request: ${input.experienceTitle}`;

  const headline = accepted ? 'Your requested date is available' : 'Your requested date is not available';
  const detail = accepted
    ? `${input.operatorName} has accepted your request for ${input.requestedDate}. No payment has been taken yet. The operator can now coordinate the final booking details with you.`
    : `${input.operatorName} cannot accept your request for ${input.requestedDate}. You can return to Croatia360 to search another date or experience.`;

  await transporter.sendMail({
    from: `"Croatia360" <${user}>`,
    to: input.to,
    subject,
    text: `${headline}\n\nHi ${input.customerName},\n\n${detail}\n\nCroatia360`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033;max-width:620px;margin:0 auto">
        <p style="font-size:13px;color:#64748b;margin-bottom:8px">Croatia360 booking request</p>
        <h1 style="font-size:24px;margin:0 0 16px">${escapeHtml(headline)}</h1>
        <p>Hi ${escapeHtml(input.customerName)},</p>
        <p>${escapeHtml(detail)}</p>
        <div style="margin-top:24px;padding:16px;border:1px solid #e2e8f0;border-radius:12px">
          <strong>${escapeHtml(input.experienceTitle)}</strong><br />
          Requested date: ${escapeHtml(input.requestedDate)}<br />
          Operator: ${escapeHtml(input.operatorName)}
        </div>
        <p style="margin-top:24px;color:#64748b;font-size:13px">Croatia360 does not charge you until a later payment step explicitly confirms a booking.</p>
      </div>
    `,
  });

  return { sent: true as const };
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
