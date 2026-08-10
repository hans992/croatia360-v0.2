'use client';

import { useCallback, useEffect, useState } from 'react';
import { CreditCard, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

type Booking = {
  id: string; experience_id: string; booking_reference: string | null; customer_name: string; service_date: string; guests: number;
  total_cents: number | null; currency: string; status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  payment_status: 'unpaid' | 'deposit_paid' | 'paid' | 'refunded' | 'partially_refunded'; quote_status: 'pending' | 'quoted' | 'approved';
  deposit_cents: number | null; payment_requested_at: string | null;
};
type Experience = { id: string; title: string };

export default function OperatorBookingsPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]); const [experiences, setExperiences] = useState<Experience[]>([]); const [hasOperator, setHasOperator] = useState(false);
  const [loading, setLoading] = useState(true); const [busyId, setBusyId] = useState<string | null>(null); const [error, setError] = useState<string | null>(null); const [notice, setNotice] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Record<string, string>>({}); const [checkoutLinks, setCheckoutLinks] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const { data: userData } = await supabase.auth.getUser(); const user = userData.user;
    if (!user) { setHasOperator(false); setLoading(false); return; }
    const { data: operatorData, error: operatorError } = await supabase.from('operators').select('id').eq('owner_user_id', user.id).maybeSingle();
    if (operatorError) { setError(operatorError.message); setLoading(false); return; }
    if (!operatorData) { setHasOperator(false); setLoading(false); return; }
    setHasOperator(true);
    const { data: experienceData, error: experienceError } = await supabase.from('experiences').select('id,title').eq('operator_id', operatorData.id).order('created_at', { ascending: true });
    if (experienceError) { setError(experienceError.message); setLoading(false); return; }
    const ownedExperiences = (experienceData ?? []) as Experience[]; setExperiences(ownedExperiences); const ids = ownedExperiences.map((item) => item.id);
    if (!ids.length) { setBookings([]); setLoading(false); return; }
    const { data, error: loadError } = await supabase.from('bookings').select('id,experience_id,booking_reference,customer_name,service_date,guests,total_cents,currency,status,payment_status,quote_status,deposit_cents,payment_requested_at').in('experience_id', ids).order('service_date', { ascending: true });
    if (loadError) setError(loadError.message); else setBookings((data ?? []) as Booking[]); setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function saveQuote(booking: Booking) {
    const raw = quotes[booking.id] ?? (booking.total_cents !== null ? String(booking.total_cents / 100) : ''); const amount = Number.parseFloat(raw.replace(',', '.'));
    if (!Number.isFinite(amount) || amount < 0) { setError('Enter a valid quote amount.'); return; }
    setBusyId(booking.id); setError(null); setNotice(null);
    const { error: quoteError } = await supabase.rpc('operator_quote_booking', { p_booking_id: booking.id, p_total_cents: Math.round(amount * 100) });
    if (quoteError) setError(quoteError.message); else { setNotice(`Quote saved for ${booking.booking_reference ?? 'booking'}.`); await load(); } setBusyId(null);
  }

  async function requestDeposit(booking: Booking) {
    setBusyId(`pay-${booking.id}`); setError(null); setNotice(null);
    const { data: sessionData } = await supabase.auth.getSession(); const token = sessionData.session?.access_token;
    if (!token) { setError('Your session expired. Please sign in again.'); setBusyId(null); return; }
    try {
      const response = await fetch('/api/marketplace/operator/bookings/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ bookingId: booking.id }) });
      const result = await response.json();
      if (!response.ok) setError(result.error ?? 'Could not create deposit checkout.');
      else {
        if (result.checkoutUrl) setCheckoutLinks((current) => ({ ...current, [booking.id]: result.checkoutUrl }));
        setNotice(result.emailWarning ?? `Deposit request created${result.emailSent ? ' and emailed to the customer' : ''}.`); await load();
      }
    } catch { setError('Network error while creating deposit checkout.'); }
    setBusyId(null);
  }

  if (loading) return <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8"><div className="flex items-center gap-2 border-t pt-8 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading bookings…</div></section>;
  if (!hasOperator) return null;
  const experienceNames = new Map(experiences.map((item) => [item.id, item.title]));

  return <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8"><div className="border-t pt-10">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-primary">Bookings</p><h2 className="mt-1 text-2xl font-semibold">Accepted requests, quotes & deposits</h2><p className="mt-2 text-sm text-muted-foreground">Set the final quote, then send the customer a secure Stripe deposit checkout.</p></div><button onClick={() => void load()} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"><RefreshCw className="h-4 w-4" /> Refresh</button></div>
    {error && <div className="mt-5 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}{notice && <div className="mt-5 rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-400">{notice}</div>}
    {bookings.length ? <div className="mt-6 grid gap-4 lg:grid-cols-2">{bookings.map((booking) => <article key={booking.id} className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{booking.booking_reference ?? 'Booking'}</p><h3 className="mt-1 text-lg font-semibold">{booking.customer_name}</h3><p className="mt-1 text-sm text-muted-foreground">{experienceNames.get(booking.experience_id) ?? 'Experience'}</p></div><span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize">{booking.payment_status.replace('_', ' ')}</span></div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-muted-foreground">Date</dt><dd className="font-medium">{booking.service_date}</dd></div><div><dt className="text-muted-foreground">Guests</dt><dd className="font-medium">{booking.guests}</dd></div><div><dt className="text-muted-foreground">Booking</dt><dd className="font-medium capitalize">{booking.status}</dd></div><div><dt className="text-muted-foreground">Quote</dt><dd className="font-medium capitalize">{booking.quote_status}</dd></div></dl>
      <div className="mt-5 border-t pt-4"><label className="text-sm font-medium">Final quote ({booking.currency})<div className="mt-2 flex gap-2"><input inputMode="decimal" value={quotes[booking.id] ?? (booking.total_cents !== null ? String(booking.total_cents / 100) : '')} onChange={(event) => setQuotes((current) => ({ ...current, [booking.id]: event.target.value }))} placeholder="e.g. 650.00" disabled={booking.payment_status !== 'unpaid'} className="min-w-0 flex-1 rounded-xl border bg-background px-3 py-2" /><button onClick={() => void saveQuote(booking)} disabled={busyId === booking.id || booking.payment_status !== 'unpaid'} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{busyId === booking.id ? 'Saving…' : 'Save quote'}</button></div></label>
        <button onClick={() => void requestDeposit(booking)} disabled={busyId === `pay-${booking.id}` || booking.quote_status !== 'quoted' || booking.total_cents === null || booking.total_cents <= 0 || booking.payment_status !== 'unpaid'} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold disabled:opacity-50"><CreditCard className="h-4 w-4" />{busyId === `pay-${booking.id}` ? 'Creating Stripe checkout…' : booking.payment_requested_at ? 'Send new deposit checkout' : 'Send deposit request'}</button>
        {booking.deposit_cents ? <p className="mt-2 text-xs text-muted-foreground">Requested deposit: {new Intl.NumberFormat('en', { style: 'currency', currency: booking.currency }).format(booking.deposit_cents / 100)}</p> : null}
        {checkoutLinks[booking.id] ? <a href={checkoutLinks[booking.id]} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs font-medium text-primary hover:underline">Open generated Stripe Checkout link ↗</a> : null}
        <p className="mt-2 text-xs text-muted-foreground">Only a verified Stripe webhook can change payment status.</p>
      </div>
    </article>)}</div> : <div className="mt-6 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">No accepted bookings yet.</div>}
  </div></section>;
}
