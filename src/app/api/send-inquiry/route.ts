// src/app/api/send-inquiry/route.ts
import { type NextRequest, NextResponse } from 'next/server'; // ISPRAVLJEN IMPORT: NextResponse se uvozi kao vrijednost
import nodemailer from 'nodemailer';

// Helper function to create a response
function createResponse(body: any, status: number): NextResponse {
  return new NextResponse(JSON.stringify(body), { 
    status,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      name, 
      email, 
      phone, 
      selectedDate, 
      numGuests, 
      message, 
      trip 
    } = body;

    // Basic validation
    if (!name || !email || !message || !trip || !selectedDate) {
      return createResponse({ error: 'Nedostaju obavezna polja za upit.' }, 400);
    }

    // Nodemailer transporter setup - ensure these ENV variables are set on Vercel
    // Ensure your environment variables are correctly named and set in Vercel.
    // For Gmail, common settings are:
    // SMTP_HOST=smtp.gmail.com
    // SMTP_PORT=465
    // SMTP_SECURE=true
    // EMAIL_USER=your-gmail-address@gmail.com
    // EMAIL_PASS=your-gmail-app-password (not your regular password)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465, // Default to 465 for Gmail if secure
      secure: process.env.SMTP_SECURE === 'true', 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Determine the recipient email address
    const partnerEmail = process.env.PARTNER_SAN_LUCA_MAGNO_EMAIL || process.env.EMAIL_RECEIVER;
    if (!partnerEmail) {
        console.error("Email adresa primatelja (PARTNER_SAN_LUCA_MAGNO_EMAIL ili EMAIL_RECEIVER) nije postavljena u environment varijablama.");
        return createResponse({ error: 'Interna greška servera - email primatelja nije konfiguriran.' }, 500);
    }

    const mailOptions = {
      from: `"Croatia360 Upiti Partnera" <${process.env.EMAIL_USER}>`,
      to: partnerEmail, 
      replyTo: email, 
      subject: `Novi upit za izlet: ${trip} - ${name}`,
      text: `
        Novi upit za izlet "${trip}" je stigao:

        Ime i Prezime: ${name}
        Email: ${email}
        Telefon: ${phone || 'Nije naveden'}
        Željeni datum: ${selectedDate}
        Broj osoba: ${numGuests || 'Nije navedeno'}

        Poruka:
        ${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #0056b3;">Novi upit za izlet: ${trip}</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px; font-weight: bold;">Ime i Prezime:</td><td style="padding: 8px;">${name}</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px; font-weight: bold;">Telefon:</td><td style="padding: 8px;">${phone || 'Nije naveden'}</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px; font-weight: bold;">Željeni datum:</td><td style="padding: 8px;">${selectedDate}</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px; font-weight: bold;">Broj osoba:</td><td style="padding: 8px;">${numGuests || 'Nije navedeno'}</td></tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-weight: bold;">Poruka:</p>
          <p style="white-space: pre-wrap; padding: 10px; background-color: #f9f9f9; border-radius: 4px;">${message}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.9em; color: #777;"><em>Ovaj email je poslan s Croatia360 partnerske stranice.</em></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Upit uspješno poslan na:", partnerEmail);

    return createResponse({ message: 'Upit uspješno poslan!' }, 200);

  } catch (error) {
    console.error("Greška prilikom slanja upita (catch block):", error);
    // It's good practice to avoid sending raw error messages to the client in production
    let userFriendlyErrorMessage = 'Neuspješno slanje upita. Molimo pokušajte kasnije ili nas kontaktirajte direktno.';
    
    // You can log more specific details on the server for debugging
    if (error instanceof Error) {
        console.error("Nodemailer error details:", error.message);
    }

    return createResponse({ error: userFriendlyErrorMessage }, 500);
  }
}
