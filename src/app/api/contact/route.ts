import type { NextRequest } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { ime, prezime, email, poruka } = await req.json();

  if (!ime || !email || !poruka) {
    return new Response(JSON.stringify({ error: 'Nedostaju obavezna polja.' }), { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Croatia360 Obavijesti" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER,
      subject: `Nova poruka - Croatia360 od ${ime} ${prezime || ''}`,
      text: `
        Ime: ${ime}
        Prezime: ${prezime}
        Email: ${email}
        
        Poruka:
        ${poruka}
      `,
    });

    return new Response(JSON.stringify({ message: 'Poruka poslana!' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Neuspješno slanje poruke.' }), { status: 500 });
  }
}