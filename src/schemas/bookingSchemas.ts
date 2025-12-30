import { z } from 'zod';

export const CreateBookingSchema = z.object({
  eventId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  paymentMethod: z.enum(['CARD', 'APPLE_PAY', 'PAYPAL']),
});

export const CancelBookingParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});