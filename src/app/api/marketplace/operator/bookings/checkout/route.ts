import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { getDepositPercent, getStripeClient } from '@/lib/marketplace/stripe';
import { sendCustomerPaymentLinkEmail } from '@/lib/marketplace/notifications';

const schema = z.object({ bookingId: z.string().uuid() });

type BookingRow = {
  id: string;
  booking_reference: string | null;
  customer_name: string;
  customer_email: string;
  service_date: string;
  total_cents: number | null;
  currency: string;
  quote_status: 'pending' | 'quoted' | 'approved';
  payment_status: string;
  status: string;
  experiences: { title: string } | null;
};

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return NextResponse.json({ error: 'Operator payments are not configured.' }, { status: 503 });

  let payload: z.infer<typeof schema>;
  try { payload = schema.parse(await request.json()); }
  catch { return NextResponse.json({ error: 'Invalid booking.' }, { status: 400 }); }

  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const token = authorization.slice(7);

  const supabase = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: authorization } },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) return NextResponse.json({ error: 'Invalid operator session.' }, { status: 401 });

  const { data, error: bookingError } = await supabase
    .from('bookings')
    .select('id,booking_reference,customer_name,customer_email,service_date,total_cents,currency,quote_status,payment_status,status,experiences!bookings_experience_id_fkey(title)')
    .eq('id', payload.bookingId)
    .maybeSingle();

  if (bookingError || !data) return NextResponse.json({ error: 'Booking not found or access denied.' }, { status: 404 });
  const booking = data as unknown as BookingRow;
  if (booking.total_cents === null || booking.quote_status !== 'quoted') return NextResponse.json({ error: 'Set the final quote before requesting payment.' }, { status: 400 });
  if (booking.payment_status !== 'unpaid') return NextResponse.json({ error: 'Payment has already been recorded.' }, { status: 400 });
  if (['cancelled', 'completed', 'refunded'].includes(booking.status)) return NextResponse.json({ error: 'This booking cannot accept payment.' }, { status: 400 });

  let depositPercent: number;
  try { depositPercent = getDepositPercent(); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Deposit configuration is invalid.' }, { status: 503 }); }

  const depositCents = Math.max(1, Math.round((booking.total_cents * depositPercent) / 100));
  const bookingReference = booking.booking_reference ?? `C360-${booking.id.slice(0, 8).toUpperCase()}`;

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: booking.customer_email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: booking.currency.toLowerCase(),
          unit_amount: depositCents,
          product_data: { name: `Deposit — ${booking.experiences?.title ?? 'Croatia360 booking'}`, description: `Booking ${bookingReference} · ${booking.service_date}` },
        },
      }],
      metadata: { booking_id: booking.id, booking_reference: bookingReference, deposit_cents: String(depositCents) },
      payment_intent_data: { metadata: { booking_id: booking.id, booking_reference: bookingReference } },
      success_url: `${request.nextUrl.origin}/en/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/en/payment/cancelled?booking=${encodeURIComponent(bookingReference)}`,
    });

    if (!session.url) return NextResponse.json({ error: 'Stripe did not return a checkout URL.' }, { status: 502 });

    const { error: startError } = await supabase.rpc('operator_start_booking_payment', {
      p_booking_id: booking.id,
      p_checkout_session_id: session.id,
      p_deposit_cents: depositCents,
    });

    if (startError) {
      try { await stripe.checkout.sessions.expire(session.id); } catch { /* best effort */ }
      return NextResponse.json({ error: startError.message || 'Could not attach payment session to booking.' }, { status: 400 });
    }

    let emailSent = false;
    let emailWarning: string | undefined;
    try {
      const result = await sendCustomerPaymentLinkEmail({
        to: booking.customer_email,
        customerName: booking.customer_name,
        experienceTitle: booking.experiences?.title ?? 'Croatia360 experience',
        bookingReference,
        serviceDate: booking.service_date,
        depositCents,
        currency: booking.currency,
        checkoutUrl: session.url,
      });
      emailSent = result.sent;
      if (!result.sent) emailWarning = 'Checkout created, but customer email is not configured.';
    } catch (error) {
      console.error('[operator/bookings/checkout] payment email failed', error);
      emailWarning = 'Checkout created, but the customer email could not be sent.';
    }

    return NextResponse.json({ ok: true, checkoutUrl: session.url, depositCents, depositPercent, emailSent, emailWarning });
  } catch (error) {
    console.error('[operator/bookings/checkout] Stripe error', error);
    return NextResponse.json({ error: 'Could not create Stripe Checkout.' }, { status: 502 });
  }
}
