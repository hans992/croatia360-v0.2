import type { NextRequest } from 'next/server';
import nodemailer from 'nodemailer';

// Ensure this route runs on the Node.js runtime (required for nodemailer)
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  
  const { email } = await req.json();

 
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return new Response(JSON.stringify({ error: 'Neispravna email adresa.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
     });
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
      subject: `Nova prijava na Newsletter - Croatia360`, 
      text: `Nova osoba se prijavila na newsletter s email adresom: ${email}`,
      html: `<p>Nova osoba se prijavila na newsletter s email adresom:</p><p><b>${email}</b></p>`, 
    });

    console.log(`Newsletter subscription notification sent for: ${email}`);
   
    return new Response(JSON.stringify({ message: 'Prijava uspješna!' }), {
       status: 200,
       headers: { 'Content-Type': 'application/json' },
      });

  } catch (error) {
    console.error('Greška kod slanja emaila za newsletter:', error);
    
    return new Response(JSON.stringify({ error: 'Neuspješna prijava na newsletter.' }), {
       status: 500,
       headers: { 'Content-Type': 'application/json' },
      });
  }
}
