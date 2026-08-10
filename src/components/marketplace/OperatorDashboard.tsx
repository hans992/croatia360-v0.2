'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, Loader2, ShipWheel, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

type Operator = { id: string; name: string; slug: string; status: string };
type Experience = { id: string; title: string; slug: string; max_guests: number | null; status: string };
type InquiryStatus = 'new' | 'contacted' | 'accepted' | 'declined' | 'expired' | 'converted';
type Inquiry = {
  id: string;
  experience_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  requested_date: string;
  guests: number;
  message: string | null;
  status: InquiryStatus;
  created_at: string;
};
type AvailabilityStatus = 'available' | 'on_request' | 'sold_out' | 'blocked';
type Availability = { id: string; experience_id: string; service_date: string; status: AvailabilityStatus; notes: string | null };

export default function OperatorDashboard({ locale }: { locale: string }) {
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [availabilityDate, setAvailabilityDate] = useState(new Date().toISOString().slice(0, 10));
  const [availabilityExperienceId, setAvailabilityExperienceId] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('available');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setOperator(null);
      setLoading(false);
      return;
    }

    const { data: operatorData, error: operatorError } = await supabase
      .from('operators')
      .select('id,name,slug,status')
      .eq('owner_user_id', user.id)
      .maybeSingle();

    if (operatorError) {
      setError(operatorError.message);
      setLoading(false);
      return;
    }

    if (!operatorData) {
      setOperator(null);
      setLoading(false);
      return;
    }

    setOperator(operatorData as Operator);

    const { data: experienceData, error: experienceError } = await supabase
      .from('experiences')
      .select('id,title,slug,max_guests,status')
      .eq('operator_id', operatorData.id)
      .order('created_at', { ascending: true });

    if (experienceError) {
      setError(experienceError.message);
      setLoading(false);
      return;
    }

    const ownedExperiences = (experienceData ?? []) as Experience[];
    setExperiences(ownedExperiences);
    setAvailabilityExperienceId((current) => current || ownedExperiences[0]?.id || '');

    const ids = ownedExperiences.map((item) => item.id);
    if (!ids.length) {
      setInquiries([]);
      setAvailability([]);
      setLoading(false);
      return;
    }

    const [{ data: inquiryData, error: inquiryError }, { data: availabilityData, error: availabilityError }] = await Promise.all([
      supabase
        .from('booking_inquiries')
        .select('id,experience_id,customer_name,customer_email,customer_phone,requested_date,guests,message,status,created_at')
        .in('experience_id', ids)
        .order('created_at', { ascending: false }),
      supabase
        .from('availability')
        .select('id,experience_id,service_date,status,notes')
        .in('experience_id', ids)
        .gte('service_date', new Date().toISOString().slice(0, 10))
        .order('service_date', { ascending: true })
        .limit(30),
    ]);

    if (inquiryError || availabilityError) {
      setError(inquiryError?.message ?? availabilityError?.message ?? 'Unable to load operator data.');
    } else {
      setInquiries((inquiryData ?? []) as Inquiry[]);
      setAvailability((availabilityData ?? []) as Availability[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const experienceNames = useMemo(() => new Map(experiences.map((item) => [item.id, item.title])), [experiences]);
  const openCount = inquiries.filter((item) => item.status === 'new' || item.status === 'contacted').length;

  async function updateInquiry(id: string, status: 'accepted' | 'declined' | 'contacted') {
    setBusyId(id);
    setError(null);

    const { error: decisionError } = await supabase.rpc('operator_decide_inquiry', {
      p_inquiry_id: id,
      p_decision: status,
    });

    if (decisionError) {
      setError(decisionError.message);
    } else if (status === 'accepted') {
      await load();
    } else {
      setInquiries((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    }

    setBusyId(null);
  }

  async function saveAvailability(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!availabilityExperienceId || !availabilityDate) return;
    setBusyId('availability');
    setError(null);

    const { error: saveError } = await supabase.from('availability').upsert({
      experience_id: availabilityExperienceId,
      service_date: availabilityDate,
      status: availabilityStatus,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'experience_id,service_date' });

    if (saveError) setError(saveError.message);
    else await load();
    setBusyId(null);
  }

  if (loading) {
    return <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!operator) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border bg-card p-8 text-center shadow-sm">
          <ShipWheel className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 text-3xl font-bold">Operator portal</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Sign in with the account linked to your Croatia360 operator profile. Operator access is granted only after your Supabase user is assigned to an approved operator record.
          </p>
          <Link href={`/${locale}/login`} className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">Sign in</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Croatia360 operator portal</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">{operator.name}</h1>
          <p className="mt-2 text-muted-foreground">Manage incoming booking requests and the dates customers can discover.</p>
        </div>
        <div className="rounded-2xl border bg-card px-5 py-3 text-sm"><span className="font-semibold">{openCount}</span> open requests</div>
      </div>

      {error && <div className="mt-6 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Booking requests</h2>
            <button onClick={() => void load()} className="text-sm font-medium text-primary hover:underline">Refresh</button>
          </div>
          <div className="space-y-4">
            {inquiries.length ? inquiries.map((inquiry) => (
              <article key={inquiry.id} className="rounded-2xl border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{experienceNames.get(inquiry.experience_id)}</p>
                    <h3 className="mt-1 text-lg font-semibold">{inquiry.customer_name}</h3>
                    <p className="mt-1 text-sm">{inquiry.requested_date} · {inquiry.guests} guests</p>
                    <p className="mt-1 text-sm text-muted-foreground">{inquiry.customer_email}{inquiry.customer_phone ? ` · ${inquiry.customer_phone}` : ''}</p>
                  </div>
                  <StatusBadge status={inquiry.status} />
                </div>
                {inquiry.message && <p className="mt-4 rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">{inquiry.message}</p>}
                <div className="mt-5 flex flex-wrap gap-2">
                  <button disabled={busyId === inquiry.id || inquiry.status === 'accepted'} onClick={() => void updateInquiry(inquiry.id, 'accepted')} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"><Check className="h-4 w-4" /> Accept</button>
                  <button disabled={busyId === inquiry.id || inquiry.status === 'declined'} onClick={() => void updateInquiry(inquiry.id, 'declined')} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-50"><X className="h-4 w-4" /> Decline</button>
                  <button disabled={busyId === inquiry.id || inquiry.status === 'contacted'} onClick={() => void updateInquiry(inquiry.id, 'contacted')} className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-50">Mark contacted</button>
                </div>
              </article>
            )) : <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">No booking requests yet.</div>}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Availability</h2>
          <form onSubmit={saveAvailability} className="mt-4 space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
            <label className="block text-sm font-medium">Experience
              <select value={availabilityExperienceId} onChange={(event) => setAvailabilityExperienceId(event.target.value)} className="mt-1 w-full rounded-xl border bg-background px-3 py-2">
                {experiences.map((experience) => <option key={experience.id} value={experience.id}>{experience.title}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium">Date
              <input type="date" min={new Date().toISOString().slice(0, 10)} value={availabilityDate} onChange={(event) => setAvailabilityDate(event.target.value)} className="mt-1 w-full rounded-xl border bg-background px-3 py-2" />
            </label>
            <label className="block text-sm font-medium">Status
              <select value={availabilityStatus} onChange={(event) => setAvailabilityStatus(event.target.value as AvailabilityStatus)} className="mt-1 w-full rounded-xl border bg-background px-3 py-2">
                <option value="available">Available</option>
                <option value="on_request">On request</option>
                <option value="sold_out">Sold out</option>
                <option value="blocked">Blocked</option>
              </select>
            </label>
            <button disabled={busyId === 'availability' || !availabilityExperienceId} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50">
              {busyId === 'availability' && <Loader2 className="h-4 w-4 animate-spin" />} Save availability
            </button>
          </form>

          <div className="mt-6 space-y-2">
            <h3 className="font-semibold">Upcoming overrides</h3>
            {availability.length ? availability.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3 text-sm">
                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-muted-foreground" /><span>{item.service_date}</span></div>
                <span className="capitalize text-muted-foreground">{item.status.replace('_', ' ')}</span>
              </div>
            )) : <p className="text-sm text-muted-foreground">No upcoming overrides. Experiences remain request-to-book by default.</p>}
          </div>
        </div>
      </section>
    </main>
  );
}

function StatusBadge({ status }: { status: InquiryStatus }) {
  return <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize">{status.replace('_', ' ')}</span>;
}
