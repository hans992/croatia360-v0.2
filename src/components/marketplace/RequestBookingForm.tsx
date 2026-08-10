'use client';

import { FormEvent, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface RequestBookingFormProps {
  experienceSlug: string;
  maxGuests: number;
}

export default function RequestBookingForm({ experienceSlug, maxGuests }: RequestBookingFormProps) {
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
        setError(result.error ?? 'Upit nije moguće poslati. Pokušajte ponovno.');
        return;
      }

      setSuccess('Upit je zaprimljen. Operator sada može potvrditi dostupnost i konačnu cijenu.');
      form.reset();
    } catch {
      setError('Došlo je do mrežne greške. Pokušajte ponovno.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <Field label="Ime i prezime" name="customerName" type="text" required />
        <Field label="Email" name="customerEmail" type="email" required />
        <Field label="Telefon" name="customerPhone" type="tel" />
        <Field label="Željeni datum" name="requestedDate" type="date" required min={new Date().toISOString().slice(0, 10)} />
      </div>

      <label className="block text-sm font-medium">
        Broj gostiju
        <input
          name="guests"
          type="number"
          min={1}
          max={maxGuests}
          defaultValue={2}
          required
          className="mt-1 w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>

      <label className="block text-sm font-medium">
        Poruka operatoru
        <textarea
          name="message"
          rows={3}
          maxLength={2000}
          placeholder="Posebne želje, vrijeme polaska ili pitanje..."
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
        {submitting ? 'Šaljem upit…' : 'Zatraži rezervaciju'}
      </button>
      <p className="text-xs text-muted-foreground">Nema naplate dok operator ne potvrdi termin i konačnu cijenu.</p>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required = false,
  min,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        min={min}
        className="mt-1 w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}
