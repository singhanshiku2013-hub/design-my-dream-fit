import { cn } from "@/lib/utils";
import { PASTEL_SWATCHES } from "@/lib/design/options";

export function OptionRow({
  label,
  options,
  value,
  onChange,
  hint,
  labels,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  /** Optional display labels keyed by option value. */
  labels?: Record<string, string>;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="eyebrow">{label}</span>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            aria-pressed={value === o}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[0.78rem] transition-all duration-200",
              value === o
                ? "border-primary bg-primary text-primary-foreground shadow-soft"
                : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
            )}
          >
            {labels?.[o] ?? o}
          </button>
        ))}
      </div>
    </div>
  );
}

function hexToRgb(hex: string) {
  const v = hex.replace("#", "");
  const full = v.length === 3 ? v.split("").map((c) => c + c).join("") : v;
  const n = Number.parseInt(full, 16);
  if (Number.isNaN(n)) return { r: 0, g: 0, b: 0 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
const toHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((c) => clamp(c).toString(16).padStart(2, "0")).join("")}`.toUpperCase();

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const rgb = hexToRgb(value);

  return (
    <div className="space-y-2 rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-3">
        <input
          type="color"
          aria-label={`${label} color wheel`}
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="size-10 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent"
        />
        <div className="min-w-0 flex-1">
          <div className="eyebrow truncate">{label}</div>
          <input
            aria-label={`${label} hex value`}
            value={value}
            onChange={(e) => {
              const next = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
              if (/^#([0-9a-fA-F]{0,6})$/.test(next)) onChange(next.toUpperCase());
            }}
            className="mt-0.5 w-full bg-transparent font-mono text-sm outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(["r", "g", "b"] as const).map((k) => (
          <label key={k} className="text-[0.65rem] tracking-wide text-muted-foreground uppercase">
            {k}
            <input
              type="number"
              min={0}
              max={255}
              value={rgb[k]}
              onChange={(e) => {
                const next = { ...rgb, [k]: Number(e.target.value) };
                onChange(toHex(next.r, next.g, next.b));
              }}
              className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
            />
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PASTEL_SWATCHES.map((s) => (
          <button
            key={s}
            type="button"
            title={s}
            aria-label={`Use pastel ${s}`}
            onClick={() => onChange(s)}
            className="size-6 rounded-full border border-border transition-transform hover:scale-110"
            style={{ backgroundColor: s }}
          />
        ))}
      </div>
    </div>
  );
}
