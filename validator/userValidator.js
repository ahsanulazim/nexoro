import z from "zod";

export const regSchema = z.object({
  userName: z.string().min(1, "Name is required").min(3, "Name is too short"),
  email: z.string().min(1, "Email is required").email("Email is invalid"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password is too short")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number"),
});

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is invalid"),
  password: z.string().min(1, "Password is required"),
});

export const resetSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is invalid"),
});
