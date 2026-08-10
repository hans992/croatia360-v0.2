'use client';

import { FormEvent, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getMarketplaceCopy } from '@/lib/marketplace/copy';

interface RequestBookingFormProps {
  experienceSlug: string;
  maxGuests: number;
  locale: string;
  initialDate?: string;
  initialGuests?: number;
}

export default function RequestBookingForm({
  experienceSlug,
  maxGuests,
  locale,
  initialDate,
  initialGuests,
}: RequestBookingFormProps) {
  const copy = getMarketplaceCopy(locale);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      experienceSlug,
      customerName: formData.get('customerName'),
      customerEmail: formData.get('customerEmail'),
      customerPhone: formData.get('customerPhone'),
      requestedDate: formData.get('requestedDate'),
      guests: formData.get('guests'),
      message: formData.get('message'),
      website: formData.get('website'),
    };

    try {
      const response = await fetch('/api/marketplace/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? copy.genericError);
        return;
      }

      setSuccess(copy.success);
      form.reset();
    } catch {
      setError(copy.networkError);
    } finally {
      setSubmitting(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const safeDate = initialDate && initialDate >= today ? initialDate : undefined;
  const safeGuests = initialGuests && initialGuests >= 1 && initialGuests <= maxGuests ? initialGuests : 2;

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <Field label={copy.name} name="customerName" type="text" required />
        <Field label={copy.email} name="customerEmail" type="email" required />
        <Field label={copy.phone} name="customerPhone" type="tel" />
        <Field label={copy.desiredDate} name="requestedDate" type="date" required min={today} defaultValue={safeDate} />
      </div>

      <label className="block text-sm font-medium">
        {copy.guestCount}
        <input
          name="guests"
          type="number"
          min={1}
          max={maxGuests}
          defaultValue={safeGuests}
          required
          className="mt-1 w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>

      <label className="block text-sm font-medium">
        {copy.operatorMessage}
        <textarea
          name="message"
          rows={3}
          maxLength={2000}
          placeholder={copy.operatorMessagePlaceholder}
          className="mt-1 w-full resize-none rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>

      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      {success && <p className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-400">{success}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitting ? copy.sending : copy.requestBooking}
      </button>
      <p className="text-xs text-muted-foreground">{copy.noCharge}</p>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required = false,
  min,
  defaultValue,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  min?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        min={min}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}
