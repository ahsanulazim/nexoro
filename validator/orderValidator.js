import { z } from "zod";

export const orderSchema = z
  .object({
    clientId: z.string().min(1, "Select Client"),
    slug: z.string().min(1, "Select Service"),
    planId: z.string().optional().nullable(),
    serviceName: z.string().optional().nullable(),
    servicePrice: z.number().optional().nullable(),
    discount: z.number().optional().nullable().default(0),
    payment: z.string().min(1, "Payment is required"),
    amount: z.number().optional().nullable().default(0),
    paymentMethod: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.slug === "custom") {
      if (!data.serviceName || data.serviceName.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Service Name is required",
          path: ["serviceName"],
        });
      }
      if (
        data.servicePrice === undefined ||
        data.servicePrice === null ||
        data.servicePrice <= 0
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Service Price is required",
          path: ["servicePrice"],
        });
      }
    } else {
      if (!data.planId || data.planId.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Select Plan",
          path: ["planId"],
        });
      }
    }
  });
