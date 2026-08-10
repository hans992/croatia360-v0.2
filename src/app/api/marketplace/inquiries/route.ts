import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { sendOperatorNewInquiryEmail } from '@/lib/marketplace/notifications';

const inquirySchema = z.object({
  experienceSlug: z.string().min(1).max(180),
  customerName: z.string().trim().min(2).max(120),
  customerEmail: z.string().trim().email().max(254),
  customerPhone: z.string().trim().max(50).optional().or(z.literal('')),
  requestedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.coerce.number().int().min(1).max(50),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  website: z.string().max(0).optional(),
});

type ExperienceContext = {
  id: string;
  title: string;
  max_guests: number | null;
  status: string;
  operators: { name: string; email: string | null } | null;
};

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Booking requests are not configured yet.' }, { status: 503 });
  }

  let parsed: z.infer<typeof inquirySchema>;
  try {
    parsed = inquirySchema.parse(await request.json());
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Please check the booking request details.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (parsed.website) return NextResponse.json({ ok: true }, { status: 202 });

  const requested = new Date(`${parsed.requestedDate}T00:00:00Z`);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (Number.isNaN(requested.getTime()) || requested < today) {
    return NextResponse.json({ error: 'Please choose a future date.' }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: experienceData, error: experienceError } = await supabase
    .from('experiences')
    .select('id,title,max_guests,status,operators!experiences_operator_id_fkey(name,email)')
    .eq('slug', parsed.experienceSlug)
    .eq('status', 'active')
    .maybeSingle();

  if (experienceError) {
    console.error('[marketplace/inquiries] experience lookup failed', experienceError);
    return NextResponse.json({ error: 'Could not verify this experience.' }, { status: 500 });
  }

  if (!experienceData) {
    return NextResponse.json({ error: 'This experience is not currently available.' }, { status: 404 });
  }

  const experience = experienceData as unknown as ExperienceContext;
  if (experience.max_guests && parsed.guests > experience.max_guests) {
    return NextResponse.json({ error: `This experience supports up to ${experience.max_guests} guests.` }, { status: 400 });
  }

  const { data: inquiry, error: insertError } = await supabase
    .from('booking_inquiries')
    .insert({
      experience_id: experience.id,
      customer_name: parsed.customerName,
      customer_email: parsed.customerEmail.toLowerCase(),
      customer_phone: parsed.customerPhone || null,
      requested_date: parsed.requestedDate,
      guests: parsed.guests,
      message: parsed.message || null,
      status: 'new',
    })
    .select('id,status,created_at')
    .single();

  if (insertError) {
    console.error('[marketplace/inquiries] insert failed', insertError);
    return NextResponse.json({ error: 'Could not save your booking request.' }, { status: 500 });
  }

  let operatorNotified = false;
  if (experience.operators?.email) {
    try {
      const result = await sendOperatorNewInquiryEmail({
        to: experience.operators.email,
        operatorName: experience.operators.name,
        experienceTitle: experience.title,
        customerName: parsed.customerName,
        customerEmail: parsed.customerEmail.toLowerCase(),
        customerPhone: parsed.customerPhone || null,
        requestedDate: parsed.requestedDate,
        guests: parsed.guests,
        message: parsed.message || null,
      });
      operatorNotified = result.sent;
    } catch (error) {
      console.error('[marketplace/inquiries] operator notification failed', error);
    }
  }

  return NextResponse.json({
    ok: true,
    inquiryId: inquiry.id,
    status: inquiry.status,
    operatorNotified,
    message: 'Your request was received. The operator can now confirm availability and price.',
  }, { status: 201 });
}
