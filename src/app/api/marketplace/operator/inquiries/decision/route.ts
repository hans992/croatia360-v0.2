import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { sendCustomerDecisionEmail } from '@/lib/marketplace/notifications';

const schema = z.object({
  inquiryId: z.string().uuid(),
  decision: z.enum(['accepted', 'declined', 'contacted']),
});

type InquiryContext = {
  customer_name: string;
  customer_email: string;
  requested_date: string;
  experiences: {
    title: string;
    operators: { name: string } | null;
  } | null;
};

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return NextResponse.json({ error: 'Operator actions are not configured.' }, { status: 503 });

  let payload: z.infer<typeof schema>;
  try {
    payload = schema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid operator decision.' }, { status: 400 });
  }

  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const token = authorization.slice(7);
  const supabase = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: authorization } },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) return NextResponse.json({ error: 'Invalid operator session.' }, { status: 401 });

  const { data: context, error: contextError } = await supabase
    .from('booking_inquiries')
    .select(`customer_name,customer_email,requested_date,experiences!booking_inquiries_experience_id_fkey(title,operators!experiences_operator_id_fkey(name))`)
    .eq('id', payload.inquiryId)
    .maybeSingle();

  if (contextError || !context) return NextResponse.json({ error: 'Booking request not found or access denied.' }, { status: 404 });

  const { data: decided, error: decisionError } = await supabase.rpc('operator_decide_inquiry', {
    p_inquiry_id: payload.inquiryId,
    p_decision: payload.decision,
  });

  if (decisionError) {
    console.error('[operator/inquiries/decision] RPC failed', decisionError);
    return NextResponse.json({ error: decisionError.message || 'Could not update booking request.' }, { status: 400 });
  }

  let notificationSent = false;
  let notificationWarning: string | undefined;
  if (payload.decision !== 'contacted') {
    const row = context as unknown as InquiryContext;
    try {
      const result = await sendCustomerDecisionEmail({
        to: row.customer_email,
        customerName: row.customer_name,
        experienceTitle: row.experiences?.title ?? 'Croatia360 experience',
        requestedDate: row.requested_date,
        decision: payload.decision,
        operatorName: row.experiences?.operators?.name ?? 'Croatia360 operator',
      });
      notificationSent = result.sent;
      if (!result.sent) notificationWarning = 'Decision saved, but customer email is not configured.';
    } catch (error) {
      console.error('[operator/inquiries/decision] customer email failed', error);
      notificationWarning = 'Decision saved, but customer email could not be sent.';
    }
  }

  return NextResponse.json({ ok: true, inquiry: decided, notificationSent, notificationWarning });
}
