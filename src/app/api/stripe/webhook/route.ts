import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';
import { getStripeClient } from '@/lib/marketplace/stripe';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!webhookSecret || !supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });

  let event: Stripe.Event;
  try {
    const payload = await request.text();
    event = getStripeClient().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('[stripe/webhook] signature verification failed', error);
    return NextResponse.json({ error: 'Invalid Stripe signature.' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed' && event.type !== 'checkout.session.async_payment_succeeded') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== 'paid') return NextResponse.json({ received: true, paymentPending: true });

  const bookingId = session.metadata?.booking_id;
  if (!bookingId) return NextResponse.json({ received: true, ignored: 'missing_booking_id' });

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: booking, error: loadError } = await supabase
    .from('bookings')
    .select('id,total_cents,deposit_cents,currency,stripe_checkout_session_id,payment_status')
    .eq('id', bookingId)
    .maybeSingle();

  if (loadError || !booking) {
    console.error('[stripe/webhook] booking lookup failed', loadError);
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }

  if (booking.stripe_checkout_session_id !== session.id) {
    return NextResponse.json({ error: 'Checkout session does not match booking.' }, { status: 409 });
  }

  const expectedAmount = booking.deposit_cents;
  const paidAmount = session.amount_total;
  if (!expectedAmount || paidAmount !== expectedAmount) {
    console.error('[stripe/webhook] amount mismatch', { bookingId, expectedAmount, paidAmount });
    return NextResponse.json({ error: 'Payment amount does not match booking deposit.' }, { status: 409 });
  }

  if (session.currency?.toUpperCase() !== booking.currency.toUpperCase()) {
    return NextResponse.json({ error: 'Payment currency does not match booking.' }, { status: 409 });
  }

  if (booking.payment_status === 'deposit_paid' || booking.payment_status === 'paid') {
    return NextResponse.json({ received: true, duplicate: true });
  }

  const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null;
  const fullPayment = booking.total_cents !== null && expectedAmount >= booking.total_cents;
  const { error: updateError } = await supabase
    .from('bookings')
    .update({
      payment_status: fullPayment ? 'paid' : 'deposit_paid',
      status: 'confirmed',
      quote_status: 'approved',
      external_payment_id: paymentIntentId,
      payment_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', booking.id)
    .eq('stripe_checkout_session_id', session.id);

  if (updateError) {
    console.error('[stripe/webhook] booking update failed', updateError);
    return NextResponse.json({ error: 'Could not persist payment.' }, { status: 500 });
  }

  return NextResponse.json({ received: true, bookingId: booking.id, paymentStatus: fullPayment ? 'paid' : 'deposit_paid' });
}
