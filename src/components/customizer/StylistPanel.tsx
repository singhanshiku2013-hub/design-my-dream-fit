import { useEffect, useRef, useState } from "react";
import { Loader2, Send, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { askStylist, type StylistSuggestion } from "@/lib/ai/stylist.functions";
import type { DesignState } from "@/lib/design/options";
import type { DeepPartial } from "@/lib/design/store";
import { cn } from "@/lib/utils";

type Msg = {
  role: "user" | "assistant";
  content: string;
  suggestion?: StylistSuggestion;
};

const PROMPTS = [
  "Something for a summer wedding.",
  "Luxury office wear.",
  "Elegant evening dress.",
  "Minimalist pastel outfit.",
  "Formal interview outfit.",
  "Streetwear look.",
  "Outfit for someone with a pear body shape.",
  "Accessories to match with this outfit",
];

export function StylistPanel({
  design,
  onApply,
}: {
  design: DesignState;
  onApply: (patch: DeepPartial<DesignState>) => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const prompt = text.trim();
    if (!prompt || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: prompt }]);
    setBusy(true);
    try {
      const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
      const result = await askStylist({ data: { prompt, design, history } });
      setMessages((m) => [
        ...m,
        { role: "assistant", content: result.reply, suggestion: result },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "The stylist could not be reached.";
      toast.error(message);
      setMessages((m) => [...m, { role: "assistant", content: message }]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex h-[640px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="grid size-9 place-items-center rounded-full bg-secondary text-secondary-foreground">
          <Wand2 className="size-4" aria-hidden />
        </span>
        <div>
          <p className="font-display text-lg leading-none">AI Stylist</p>
          <p className="text-xs text-muted-foreground">Your personal atelier consultant</p>
        </div>
      </div>

      <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Describe the occasion, mood or body concern and I&apos;ll compose a complete look —
              cut, colour, fabric and pattern — then explain why it flatters you.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => void send(p)}
                  className="rounded-full border border-border px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {messages.map((m, i) => (
          <div key={i} className={cn("space-y-2", m.role === "user" && "flex justify-end")}>
            {m.role === "user" ? (
              <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                {m.content}
              </p>
            ) : (
              <div className="space-y-2.5">
                {m.suggestion?.suggestionName ? (
                  <p className="font-display text-base text-foreground">
                    {m.suggestion.suggestionName}
                  </p>
                ) : null}
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                  {m.content}
                </p>
                {m.suggestion?.reasons?.length ? (
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {m.suggestion.reasons.map((r, ri) => (
                      <li key={ri} className="flex gap-2">
                        <span className="text-gold">◆</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {m.suggestion?.patch && Object.keys(m.suggestion.patch).length > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      onApply(m.suggestion!.patch as DeepPartial<DesignState>);
                      toast.success("AI suggestion applied to your design");
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-3.5 py-2 text-xs font-medium text-gold-foreground transition-transform hover:scale-[1.03]"
                  >
                    <Wand2 className="size-3.5" aria-hidden />
                    Apply AI Suggestion
                  </button>
                ) : null}
              </div>
            )}
          </div>
        ))}

        {busy ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Styling your look…
          </p>
        ) : null}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="border-t border-border p-3"
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            rows={2}
            placeholder="Ask your stylist anything…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            className="max-h-32 min-h-[46px] flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/60"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send to stylist"
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Send className="size-4" aria-hidden />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
