import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default async function PaymentSuccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-16 sm:px-6">
      <div className="w-full rounded-3xl border bg-card p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
        <h1 className="mt-5 text-3xl font-bold">Payment received by Stripe</h1>
        <p className="mt-3 text-muted-foreground">Croatia360 confirms the booking only after the verified Stripe webhook updates the payment record. This normally happens automatically.</p>
        <Link href={`/${locale}`} className="mt-7 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">Back to Croatia360</Link>
      </div>
    </main>
  );
}
