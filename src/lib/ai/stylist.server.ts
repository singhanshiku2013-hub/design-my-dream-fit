import {
  ALL_PATTERNS,
  CUFFS,
  DISABILITIES,
  DRESS_COLLARS,
  FABRICS,
  HEMLINES,
  LAPELS,
  NECKLINES,
  PANT_HEMS,
  PLACKETS,
  SHIRT_COLLARS,
  SHIRT_SLEEVES,
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
import { suggestionSchema, type StylistInput, type StylistSuggestion } from "./stylist.schema";

function catalogue(design: DesignState) {
  return {
    bodyShape: bodyShapesFor(design.gender).map((b) => b.id),
    size: [...SIZES],
    fabric: FABRICS.map((f) => f.id),
    pattern: ALL_PATTERNS,
    pantsPattern: ALL_PATTERNS,
    disability: DISABILITIES.map((d) => d.id),
    dress: {
      neckline: NECKLINES,
      sleeve: SLEEVES,
      collar: DRESS_COLLARS,
      waistline: WAISTLINES,
      skirt: SKIRTS,
      hemline: HEMLINES,
    },
    shirt: { collar: SHIRT_COLLARS, sleeve: SHIRT_SLEEVES, cuff: CUFFS, placket: PLACKETS, yoke: YOKES },
    pants: { waistband: WAISTBANDS, fly: ["Zipper", "Button"], hem: PANT_HEMS },
    jacket: { lapel: LAPELS, vent: VENTS, pocket: BREAST_POCKETS },
  };
}

function systemPrompt(design: DesignState) {
  return `You are the head stylist at Chic Canvas, a luxury made-to-measure atelier.
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
}

type Message = { role: "user" | "assistant"; content: string };

function statusError(status: number): Error {
  if (status === 429) return new Error("The stylist is busy right now — please retry in a moment.");
  if (status === 402 || status === 403)
    return new Error("AI credits are exhausted. Add credits to keep styling with AI.");
  if (status === 401)
    return new Error("The AI stylist key was rejected. Check your provider API key.");
  return new Error(`Stylist unavailable (${status}).`);
}

/** Chat-completions shape (OpenAI + Lovable AI Gateway). */
async function chatCompletions(opts: {
  url: string;
  headers: Record<string, string>;
  model: string;
  system: string;
  messages: Message[];
}): Promise<string> {
  const res = await fetch(opts.url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...opts.headers },
    body: JSON.stringify({
      model: opts.model,
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: opts.system }, ...opts.messages],
    }),
  });
  if (!res.ok) throw statusError(res.status);
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return json.choices?.[0]?.message?.content ?? "";
}

async function anthropicMessages(opts: {
  apiKey: string;
  model: string;
  system: string;
  messages: Message[];
}): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": opts.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: 1500,
      system: `${opts.system}\n\nRespond with a single raw JSON object and nothing else.`,
      messages: opts.messages.length
        ? opts.messages
        : [{ role: "user", content: "Suggest a look." }],
    }),
  });
  if (!res.ok) throw statusError(res.status);
  const json = (await res.json()) as { content?: { type: string; text?: string }[] };
  return json.content?.map((c) => c.text ?? "").join("") ?? "";
}

export async function generateStylistSuggestion(
  data: StylistInput,
): Promise<StylistSuggestion> {
  const design = data.design as DesignState;
  const system = systemPrompt(design);
  const messages: Message[] = [...(data.history ?? []), { role: "user", content: data.prompt }];

  const openai = process.env["OPENAI_API_KEY"];
  const anthropic = process.env["ANTHROPIC_API_KEY"];
  const lovable = process.env["LOVABLE_API_KEY"];

  let raw = "";
  if (openai) {
    raw = await chatCompletions({
      url: "https://api.openai.com/v1/chat/completions",
      headers: { Authorization: `Bearer ${openai}` },
      model: process.env["OPENAI_MODEL"] ?? "gpt-4o-mini",
      system,
      messages,
    });
  } else if (anthropic) {
    raw = await anthropicMessages({
      apiKey: anthropic,
      model: process.env["ANTHROPIC_MODEL"] ?? "claude-sonnet-4-5",
      system,
      messages,
    });
  } else if (lovable) {
    raw = await chatCompletions({
      url: "https://ai.gateway.lovable.dev/v1/chat/completions",
      headers: { "Lovable-API-Key": lovable, "X-Lovable-AIG-SDK": "fetch" },
      model: process.env["LOVABLE_MODEL"] ?? "google/gemini-3.6-flash",
      system,
      messages,
    });
  } else {
    throw new Error(
      "AI stylist is not configured. Set OPENAI_API_KEY (or ANTHROPIC_API_KEY / LOVABLE_API_KEY) — see .env.example.",
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.replace(/^```json\s*|```$/g, "").trim());
  } catch {
    return { reply: raw || "I couldn't put that look together — try rephrasing." };
  }
  const result = suggestionSchema.safeParse(parsed);
  if (!result.success) return { reply: typeof parsed === "string" ? parsed : raw };
  return result.data;
}
