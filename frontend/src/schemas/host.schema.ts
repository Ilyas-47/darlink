import { z } from 'zod';

export const hostRegistrationSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  location: z.string().min(3, "L'adresse est requise"),
  price: z.number().min(1, "Le prix doit être supérieur à 0"),
  rooms: z.number().min(1, "Au moins 1 chambre est requise"),
  capacity: z.number().min(1, "La capacité doit être d'au moins 1 personne"),
  image: z.string().url("Veuillez fournir une URL valide pour l'image"),
});

export type HostRegistrationFormData = z.infer<typeof hostRegistrationSchema>;
