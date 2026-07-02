import z from "zod";

export const orderSchema = z.object({
  clientId: z.string().min(1, "Select Client"),
  slug: z.string().min(1, "Select Service"),
  planId: z.string().min(1, "Select Plan"),
  discount: z.number().optional().nullable().default(0),
  payment: z.string().min(1, "Payment is required"),
  amount: z.number().optional().nullable().default(0),
  paymentMethod: z.string().optional().nullable(),
});
