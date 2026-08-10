import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error('STRIPE_SECRET_KEY is not configured');
  if (!stripeClient) stripeClient = new Stripe(secretKey);
  return stripeClient;
}

export function getDepositPercent() {
  const raw = process.env.STRIPE_DEPOSIT_PERCENT;
  if (!raw) throw new Error('STRIPE_DEPOSIT_PERCENT is not configured');
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < 1 || value > 100) {
    throw new Error('STRIPE_DEPOSIT_PERCENT must be an integer from 1 to 100');
  }
  return value;
}
