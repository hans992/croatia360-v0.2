import nodemailer from 'nodemailer';

type Decision = 'accepted' | 'declined';
type SmtpConfig = { host: string; user: string; pass: string; port: number; secure: boolean };

export async function sendOperatorNewInquiryEmail(input: { to: string; operatorName: string; experienceTitle: string; customerName: string; customerEmail: string; customerPhone?: string | null; requestedDate: string; guests: number; message?: string | null }) {
  const smtp = getSmtpConfig();
  if (!smtp) return { sent: false as const, reason: 'smtp_not_configured' as const };
  const transporter = createTransporter(smtp);
  await transporter.sendMail({
    from: `"Croatia360" <${smtp.user}>`, to: input.to, replyTo: input.customerEmail,
    subject: `New Croatia360 booking request: ${input.experienceTitle}`,
    text: [`Hi ${input.operatorName},`, '', `You received a new booking request for ${input.experienceTitle}.`, `Date: ${input.requestedDate}`, `Guests: ${input.guests}`, `Customer: ${input.customerName}`, `Email: ${input.customerEmail}`, `Phone: ${input.customerPhone || 'Not provided'}`, input.message ? `Message: ${input.message}` : '', '', 'Open the Croatia360 operator portal to accept, decline or contact the customer.'].filter(Boolean).join('\n'),
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033;max-width:640px;margin:0 auto"><p style="font-size:13px;color:#64748b">Croatia360 operator notification</p><h1 style="font-size:24px">New booking request</h1><p>Hi ${escapeHtml(input.operatorName)},</p><p>You received a new request for <strong>${escapeHtml(input.experienceTitle)}</strong>.</p><div style="margin:20px 0;padding:16px;border:1px solid #e2e8f0;border-radius:12px">Date: <strong>${escapeHtml(input.requestedDate)}</strong><br />Guests: <strong>${input.guests}</strong><br />Customer: ${escapeHtml(input.customerName)}<br />Email: ${escapeHtml(input.customerEmail)}<br />Phone: ${escapeHtml(input.customerPhone || 'Not provided')}</div>${input.message ? `<p><strong>Message</strong></p><p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>` : ''}<p>Open the Croatia360 operator portal to accept, decline or contact the customer.</p></div>`,
  });
  return { sent: true as const };
}

export async function sendCustomerDecisionEmail(input: { to: string; customerName: string; experienceTitle: string; requestedDate: string; decision: Decision; operatorName: string }) {
  const smtp = getSmtpConfig();
  if (!smtp) return { sent: false as const, reason: 'smtp_not_configured' as const };
  const accepted = input.decision === 'accepted';
  const headline = accepted ? 'Your requested date is available' : 'Your booking request was declined';
  const detail = accepted ? `${input.operatorName} accepted your request for ${input.requestedDate}. No payment has been taken yet. The operator can now coordinate the final booking details with you.` : `${input.operatorName} cannot accept your request for ${input.requestedDate}. You can return to Croatia360 to search another date or experience.`;
  const transporter = createTransporter(smtp);
  await transporter.sendMail({ from: `"Croatia360" <${smtp.user}>`, to: input.to, subject: accepted ? `Your Croatia360 request was accepted: ${input.experienceTitle}` : `Update on your Croatia360 request: ${input.experienceTitle}`, text: `${headline}\n\nHi ${input.customerName},\n\n${detail}\n\nCroatia360`, html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033;max-width:620px;margin:0 auto"><p style="font-size:13px;color:#64748b">Croatia360 booking request</p><h1 style="font-size:24px">${escapeHtml(headline)}</h1><p>Hi ${escapeHtml(input.customerName)},</p><p>${escapeHtml(detail)}</p><div style="margin-top:24px;padding:16px;border:1px solid #e2e8f0;border-radius:12px"><strong>${escapeHtml(input.experienceTitle)}</strong><br />Requested date: ${escapeHtml(input.requestedDate)}<br />Operator: ${escapeHtml(input.operatorName)}</div><p style="margin-top:24px;color:#64748b;font-size:13px">Croatia360 does not charge you until a later payment step explicitly confirms a booking.</p></div>` });
  return { sent: true as const };
}

export async function sendCustomerPaymentLinkEmail(input: { to: string; customerName: string; experienceTitle: string; bookingReference: string; serviceDate: string; depositCents: number; currency: string; checkoutUrl: string }) {
  const smtp = getSmtpConfig();
  if (!smtp) return { sent: false as const, reason: 'smtp_not_configured' as const };
  const amount = new Intl.NumberFormat('en', { style: 'currency', currency: input.currency }).format(input.depositCents / 100);
  const transporter = createTransporter(smtp);
  await transporter.sendMail({
    from: `"Croatia360" <${smtp.user}>`, to: input.to,
    subject: `Secure your Croatia360 booking ${input.bookingReference}`,
    text: `Hi ${input.customerName},\n\nYour final quote is ready. Pay the ${amount} deposit securely through Stripe to confirm your booking for ${input.experienceTitle} on ${input.serviceDate}.\n\n${input.checkoutUrl}\n\nBooking reference: ${input.bookingReference}\n\nCroatia360`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033;max-width:620px;margin:0 auto"><p style="font-size:13px;color:#64748b">Croatia360 secure payment</p><h1 style="font-size:24px">Your deposit is ready</h1><p>Hi ${escapeHtml(input.customerName)},</p><p>Your final quote is ready. Pay the <strong>${escapeHtml(amount)}</strong> deposit securely through Stripe to confirm your booking.</p><div style="margin:20px 0;padding:16px;border:1px solid #e2e8f0;border-radius:12px"><strong>${escapeHtml(input.experienceTitle)}</strong><br />Date: ${escapeHtml(input.serviceDate)}<br />Reference: ${escapeHtml(input.bookingReference)}</div><p><a href="${escapeHtml(input.checkoutUrl)}" style="display:inline-block;background:#0f766e;color:white;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700">Pay deposit securely</a></p><p style="font-size:12px;color:#64748b;margin-top:20px">Payment status is confirmed by Croatia360 only after Stripe verifies the payment.</p></div>`,
  });
  return { sent: true as const };
}

function getSmtpConfig(): SmtpConfig | null { const host = process.env.SMTP_HOST; const user = process.env.EMAIL_USER; const pass = process.env.EMAIL_PASS; if (!host || !user || !pass) return null; return { host, user, pass, port: Number(process.env.SMTP_PORT) || 465, secure: process.env.SMTP_SECURE === 'true' }; }
function createTransporter(config: SmtpConfig) { return nodemailer.createTransport({ host: config.host, port: config.port, secure: config.secure, auth: { user: config.user, pass: config.pass } }); }
function escapeHtml(value: string) { return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;'); }
