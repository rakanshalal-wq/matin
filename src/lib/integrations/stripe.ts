/**
 * src/lib/integrations/stripe.ts
 * تكامل Stripe للدفع الدولي
 * المتغيرات المطلوبة: STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET
 */

export { createStripePaymentIntent, getStripePaymentIntent } from '@/lib/integrations-advanced';
