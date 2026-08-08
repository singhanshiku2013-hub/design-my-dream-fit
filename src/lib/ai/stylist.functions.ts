import { createServerFn } from "@tanstack/react-start";
import { stylistInputSchema } from "./stylist.schema";
import type { StylistSuggestion } from "./stylist.schema";

export type { StylistSuggestion };

export const askStylist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => stylistInputSchema.parse(data))
  .handler(async ({ data }): Promise<StylistSuggestion> => {
    const { generateStylistSuggestion } = await import("./stylist.server");
    return generateStylistSuggestion(data);
  });
