'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

type Booking = {
  id: string;
  experience_id: string;
  booking_reference: string | null;
  customer_name: string;
  customer_email: string;
  service_date: string;
  guests: number;
  total_cents: number | null;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  payment_status: 'unpaid' | 'deposit_paid' | 'paid' | 'refunded' | 'partially_refunded';
  quote_status: 'pending' | 'quoted' | 'approved';
};

type Experience = { id: string; title: string };

export default function OperatorBookingsPanel({ experiences }: { experiences: Experience[] }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const ids = experiences.map((item) => item.id);
    if (!ids.length) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const { data, error: loadError } = await supabase
      .from('bookings')
      .select('id,experience_id,booking_reference,customer_name,customer_email,service_date,guests,total_cents,currency,status,payment_status,quote_status')
      .in('experience_id', ids)
      .order('service_date', { ascending: true });

    if (loadError) setError(loadError.message);
    else setBookings((data ?? []) as Booking[]);
    setLoading(false);
  }, [experiences]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    const handler = () => void load();
    window.addEventListener('croatia360:booking-changed', handler);
    return () => window.removeEventListener('croatia360:booking-changed', handler);
  }, [load]);

  async function saveQuote(booking: Booking) {
    const raw = quotes[booking.id] ?? (booking.total_cents !== null ? String(booking.total_cents / 100) : '');
    const amount = Number.parseFloat(raw.replace(',', '.'));
    if (!Number.isFinite(amount) || amount < 0) {
      setError('Enter a valid quote amount.');
      return;
    }

    setBusyId(booking.id);
    setError(null);
    setNotice(null);
    const totalCents = Math.round(amount * 100);
    const { error: quoteError } = await supabase.rpc('operator_quote_booking', {
      p_booking_id: booking.id,
      p_total_cents: totalCents,
    });

    if (quoteError) setError(quoteError.message);
    else {
      setNotice(`Quote saved for ${booking.booking_reference ?? 'booking'}.`);
      await load();
    }
    setBusyId(null);
  }

  const experienceNames = new Map(experiences.map((item) => [item.id, item.title]));

  return (
    <section className="mt-12 border-t pt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Bookings</p>
          <h2 className="mt-1 text-2xl font-semibold">Accepted requests & quotes</h2>
          <p className="mt-2 text-sm text-muted-foreground">Accepted requests become booking records here. Set the final quote before a payment step is created.</p>
        </div>
        <button onClick={() => void load()} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"><RefreshCw className="h-4 w-4" /> Refresh</button>
      </div>

      {error && <div className="mt-5 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
      {notice && <div className="mt-5 rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-400">{notice}</div>}

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading bookings…</div>
      ) : bookings.length ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {bookings.map((booking) => (
            <article key={booking.id} className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{booking.booking_reference ?? 'Booking'}</p>
                  <h3 className="mt-1 text-lg font-semibold">{booking.customer_name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{experienceNames.get(booking.experience_id) ?? 'Experience'}</p>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize">{booking.quote_status}</span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-muted-foreground">Date</dt><dd className="font-medium">{booking.service_date}</dd></div>
                <div><dt className="text-muted-foreground">Guests</dt><dd className="font-medium">{booking.guests}</dd></div>
                <div><dt className="text-muted-foreground">Booking</dt><dd className="font-medium capitalize">{booking.status}</dd></div>
                <div><dt className="text-muted-foreground">Payment</dt><dd className="font-medium capitalize">{booking.payment_status.replace('_', ' ')}</dd></div>
              </dl>

              <div className="mt-5 border-t pt-4">
                <label className="text-sm font-medium">Final quote ({booking.currency})
                  <div className="mt-2 flex gap-2">
                    <input
                      inputMode="decimal"
                      value={quotes[booking.id] ?? (booking.total_cents !== null ? String(booking.total_cents / 100) : '')}
                      onChange={(event) => setQuotes((current) => ({ ...current, [booking.id]: event.target.value }))}
                      placeholder="e.g. 650.00"
                      disabled={booking.payment_status !== 'unpaid'}
                      className="min-w-0 flex-1 rounded-xl border bg-background px-3 py-2"
                    />
                    <button
                      onClick={() => void saveQuote(booking)}
                      disabled={busyId === booking.id || booking.payment_status !== 'unpaid'}
                      className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                    >
                      {busyId === booking.id ? 'Saving…' : 'Save quote'}
                    </button>
                  </div>
                </label>
                <p className="mt-2 text-xs text-muted-foreground">Saving a quote does not charge the customer or mark the booking paid.</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">No accepted bookings yet.</div>
      )}
    </section>
  );
}
