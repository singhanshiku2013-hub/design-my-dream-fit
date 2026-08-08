import { z } from "zod";

const hex = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
  .optional();

export const suggestionSchema = z.object({
  reply: z.string(),
  suggestionName: z.string().optional(),
  reasons: z.array(z.string()).optional(),
  patch: z
    .object({
      category: z.enum(["dress", "separates", "suit"]).optional(),
      fabric: z.string().optional(),
      size: z.string().optional(),
      bodyShape: z.string().optional(),
      dress: z
        .object({
          neckline: z.string().optional(),
          sleeve: z.string().optional(),
          collar: z.string().optional(),
          waistline: z.string().optional(),
          skirt: z.string().optional(),
          hemline: z.string().optional(),
          color: hex,
        })
        .optional(),
      shirt: z
        .object({
          collar: z.string().optional(),
          cuff: z.string().optional(),
          placket: z.string().optional(),
          yoke: z.string().optional(),
          color: hex,
        })
        .optional(),
      pants: z
        .object({
          waistband: z.string().optional(),
          fly: z.string().optional(),
          hem: z.string().optional(),
          color: hex,
        })
        .optional(),
      jacket: z
        .object({
          enabled: z.boolean().optional(),
          lapel: z.string().optional(),
          vent: z.string().optional(),
          pocket: z.string().optional(),
          color: hex,
        })
        .optional(),
      pattern: z
        .object({
          name: z.string().optional(),
          primary: hex,
          secondary: hex,
        })
        .optional(),
    })
    .optional(),
});

export type StylistSuggestion = z.infer<typeof suggestionSchema>;

export const stylistInputSchema = z.object({
  prompt: z.string().trim().min(2).max(600),
  design: z.unknown(),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(12)
    .optional(),
});

export type StylistInput = z.infer<typeof stylistInputSchema>;
