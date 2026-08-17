# AdriaticByBoat

**Boat trips, private tours and rentals from trusted local operators on the Adriatic.**

AdriaticByBoat is a request-to-book marketplace starting in Zadar. Travelers can discover real boat experiences, request a date, receive operator confirmation and a final quote, and pay a secure deposit through Stripe when required. SARA AI remains available as a concierge for choosing the right experience and planning the coastal part of a Croatia trip.

Production domain: `https://adriaticbyboat.com`

## Core product

- **Zadar boat discovery** – Filter boat tours, private charters and rentals by date, group size and experience type.
- **Request-to-book** – Customers submit a request without being charged upfront.
- **Operator portal** – Local operators manage incoming requests and availability, accept/decline inquiries and prepare final quotes.
- **Booking records** – Accepted requests become durable booking records with human-readable references.
- **Stripe deposits** – Operators can send secure hosted Stripe Checkout links after the final quote is set. Payment state changes only from verified Stripe webhooks.
- **Transactional email** – Operators receive new-request notifications; customers receive decision and payment emails.
- **SARA AI concierge** – Helps users narrow down boat experiences without inventing availability or prices.
- **Multi-language UI** – Croatian, English, German, Italian, French, Czech, Polish and Hungarian.

## Tech stack

- Next.js 16 / React 19 / TypeScript
- Tailwind CSS + Radix/shadcn patterns
- Supabase Auth + Postgres + RLS
- Stripe Checkout + verified webhooks
- Vercel AI SDK + Google Gemini
- react-i18next
- Nodemailer / SMTP
- Vercel Analytics

## Environment

```env
# AI
GOOGLE_GENERATIVE_AI_API_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Transactional email
SMTP_HOST=
SMTP_PORT=465
SMTP_SECURE=true
EMAIL_USER=
EMAIL_PASS=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_DEPOSIT_PERCENT=20
```

`STRIPE_DEPOSIT_PERCENT` must be explicitly configured between 1 and 100. The application intentionally does not choose a hidden default deposit percentage.

Stripe webhook endpoint:

```text
https://adriaticbyboat.com/api/stripe/webhook
```

Subscribe at minimum to:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`

## Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Database migrations

Marketplace schema and workflow changes live under `supabase/migrations/`. Apply migrations in order before enabling the corresponding UI in production.

The AdriaticByBoat rebrand preserves historical `C360-*` booking references. New bookings use `ABB-*` references after the rebrand migration is applied.

## Repository note

The repository is still named `croatia360-v0.2` for continuity with its project history. The public product and canonical domain are AdriaticByBoat / `adriaticbyboat.com`.

## License

Private project. All rights reserved.
