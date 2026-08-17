import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { BRAND } from '@/lib/brand';

export default async function PaymentCancelledPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-16 sm:px-6">
      <div className="w-full rounded-3xl border bg-card p-8 text-center shadow-sm">
        <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="text-sm font-medium text-primary">{BRAND.name}</p>
        <h1 className="mt-3 text-3xl font-bold">Payment was not completed</h1>
        <p className="mt-3 text-muted-foreground">Your booking has not been marked paid. You can return to the secure payment link from your {BRAND.name} email when you are ready.</p>
        <Link href={`/${locale}`} className="mt-7 inline-flex rounded-xl border px-5 py-3 font-semibold">Back to {BRAND.name}</Link>
      </div>
    </main>
  );
}
