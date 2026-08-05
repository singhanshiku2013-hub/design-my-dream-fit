import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  ALL_PATTERNS,
  CUFFS,
  DRESS_COLLARS,
  FABRICS,
  HEMLINES,
  LAPELS,
  NECKLINES,
  PANT_HEMS,
  PLACKETS,
  SHIRT_COLLARS,
  SIZES,
  SKIRTS,
  SLEEVES,
  VENTS,
  BREAST_POCKETS,
  WAISTBANDS,
  WAISTLINES,
  YOKES,
  bodyShapesFor,
  type DesignState,
} from "@/lib/design/options";

const hex = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
  .optional();

const suggestionSchema = z.object({
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

const inputSchema = z.object({
  prompt: z.string().trim().min(2).max(600),
  design: z.unknown(),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(12)
    .optional(),
});

function catalogue(design: DesignState) {
  return {
    bodyShape: bodyShapesFor(design.gender).map((b) => b.id),
    size: [...SIZES],
    fabric: FABRICS.map((f) => f.id),
    pattern: ALL_PATTERNS,
    dress: {
      neckline: NECKLINES,
      sleeve: SLEEVES,
      collar: DRESS_COLLARS,
      waistline: WAISTLINES,
      skirt: SKIRTS,
      hemline: HEMLINES,
    },
    shirt: { collar: SHIRT_COLLARS, cuff: CUFFS, placket: PLACKETS, yoke: YOKES },
    pants: { waistband: WAISTBANDS, fly: ["Zipper", "Button"], hem: PANT_HEMS },
    jacket: { lapel: LAPELS, vent: VENTS, pocket: BREAST_POCKETS },
  };
}

export const askStylist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<StylistSuggestion> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI stylist is not configured yet.");

    const design = data.design as DesignState;
    const system = `You are the head stylist at DesignMyDress, a luxury made-to-measure atelier.
Philosophy: "We make dresses suit people—not force people to suit dresses."
You advise warmly and specifically: recommend complete outfits, colors, flattering cuts for the client's body shape, fabrics, patterns, seasonal and occasion-appropriate choices, luxury combinations and alternatives, and always explain WHY it works.

Return JSON only, shaped exactly as:
{"reply": string (2-5 short paragraphs of markdown-free styling advice, mention alternatives),
 "suggestionName": string (short outfit name),
 "reasons": string[] (2-4 crisp bullet reasons),
 "patch": object (only keys you want to change)}

The patch MUST use values from this catalogue verbatim, colors as hex strings:
${JSON.stringify(catalogue(design))}

Current design of the client:
${JSON.stringify(design)}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          ...(data.history ?? []),
          { role: "user", content: data.prompt },
        ],
      }),
    });

    if (res.status === 429) throw new Error("The stylist is busy right now — please retry in a moment.");
    if (res.status === 402)
      throw new Error("AI credits are exhausted. Add credits to keep styling with AI.");
    if (!res.ok) throw new Error(`Stylist unavailable (${res.status}).`);

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = json.choices?.[0]?.message?.content ?? "";
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw.replace(/^```json\s*|```$/g, ""));
    } catch {
      return { reply: raw || "I couldn't put that look together — try rephrasing." };
    }
    const result = suggestionSchema.safeParse(parsed);
    if (!result.success) {
      return { reply: typeof parsed === "string" ? parsed : raw };
    }
    return result.data;
  });
