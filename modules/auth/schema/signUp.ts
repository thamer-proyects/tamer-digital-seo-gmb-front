import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
  email: z.string().email('Invalid email address').nonempty('Email is required'),
  phone: z.string().optional(), // You can add validation for phone if needed
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .nonempty('Password is required'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
