import { z } from 'zod';

export const bookingSchema = z.object({
  paymentMethod: z.enum(['paypal', 'card', 'bank_transfer']),
  fullName: z.string().min(2, "Le nom complet est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Le numéro de téléphone est requis"),
  specialRequests: z.string().optional(),
  agreeToRules: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter le règlement intérieur"
  }),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
