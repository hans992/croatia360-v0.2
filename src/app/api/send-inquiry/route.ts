// Legacy partner inquiry endpoint kept for backwards compatibility.
import { type NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { BRAND } from '@/lib/brand';

function createResponse(body: Record<string, unknown> | { error: string } | { message: string }, status: number): NextResponse {
  return new NextResponse(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

interface InquiryRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  selectedDate?: string;
  numGuests?: number;
  message?: string;
  trip?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as InquiryRequestBody;
    const { name, email, phone, selectedDate, numGuests, message, trip } = body;

    if (!name || !email || !message || !trip || !selectedDate) {
      return createResponse({ error: 'Nedostaju obavezna polja za upit.' }, 400);
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const partnerEmail = process.env.PARTNER_SAN_LUCA_MAGNO_EMAIL || process.env.EMAIL_RECEIVER;
    if (!partnerEmail) {
      console.error('Partner inquiry email recipient is not configured.');
      return createResponse({ error: 'Interna greška servera - email primatelja nije konfiguriran.' }, 500);
    }

    await transporter.sendMail({
      from: `"${BRAND.name}" <${process.env.EMAIL_USER}>`,
      to: partnerEmail,
      replyTo: email,
      subject: `Novi ${BRAND.name} upit za izlet: ${trip} - ${name}`,
      text: `Novi upit za izlet "${trip}" je stigao preko ${BRAND.name}.\n\nIme i prezime: ${name}\nEmail: ${email}\nTelefon: ${phone || 'Nije naveden'}\nŽeljeni datum: ${selectedDate}\nBroj osoba: ${numGuests || 'Nije navedeno'}\n\nPoruka:\n${message}`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#333"><p style="font-size:13px;color:#64748b">${BRAND.name} partner inquiry</p><h2>Novi upit za izlet: ${trip}</h2><p><strong>Ime i prezime:</strong> ${name}<br/><strong>Email:</strong> ${email}<br/><strong>Telefon:</strong> ${phone || 'Nije naveden'}<br/><strong>Željeni datum:</strong> ${selectedDate}<br/><strong>Broj osoba:</strong> ${numGuests || 'Nije navedeno'}</p><p><strong>Poruka:</strong></p><p style="white-space:pre-wrap">${message}</p></div>`,
    });

    return createResponse({ message: 'Upit uspješno poslan!' }, 200);
  } catch (error) {
    console.error('[legacy partner inquiry] email failed', error);
    return createResponse({ error: 'Neuspješno slanje upita. Molimo pokušajte kasnije ili nas kontaktirajte direktno.' }, 500);
  }
}
