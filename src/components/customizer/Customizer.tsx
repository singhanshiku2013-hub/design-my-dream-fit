import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { RotateCcw, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { GarmentPreview } from "@/components/preview/GarmentPreview";
import { ColorField, OptionRow } from "@/components/customizer/Controls";
import { StylistPanel } from "@/components/customizer/StylistPanel";
import { useStore, type DeepPartial } from "@/lib/design/store";
import {
  BREAST_POCKETS,
  CUFFS,
  DISABILITIES,
  DRESS_COLLARS,
  FABRICS,
  FLIES,
  HEMLINES,
  LAPELS,
  NECKLINES,
  PANT_HEMS,
  PATTERN_GROUPS,
  PLACKETS,
  SHIRT_COLLARS,
  SHIRT_SLEEVES,
  SIZES,
  SKIRTS,
  SLEEVES,
  VENTS,
  WAISTBANDS,
  WAISTLINES,
  YOKES,
  bodyShapesFor,
  PANT_LENGTHS,
  designPrice,
  designTitle,
  formatMoney,
  presetsFor,
  type DesignState,
  type Gender,
  type Size,
} from "@/lib/design/options";
import { cn } from "@/lib/utils";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <h3 className="font-display text-lg">{title}</h3>
      {children}
    </section>
  );
}

export function Customizer({ gender }: { gender: Gender }) {
  const { designs, updateDesign, resetDesign, addToCart, currency } = useStore();
  const design = designs[gender];
  const set = (patch: DeepPartial<DesignState>) => updateDesign(gender, patch);
  const shapes = bodyShapesFor(gender);
  const presets = presetsFor(gender);
  const price = useMemo(() => designPrice(design), [design]);

  const isDress = design.category === "dress";
  const categories: { id: DesignState["category"]; label: string }[] =
    gender === "female"
      ? [
          { id: "dress", label: "Dresses" },
          { id: "separates", label: "Tops & Bottoms" },
          { id: "suit", label: "Suit & Jacket" },
        ]
      : [
          { id: "separates", label: "Shirt & Trousers" },
          { id: "suit", label: "Jacket / Suit" },
        ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)_minmax(0,0.85fr)]">
      {/* ---------- live preview ---------- */}
      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="surface-luxe relative overflow-hidden rounded-3xl border border-border p-4 shadow-luxe">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="eyebrow">Live preview</p>
              <p className="font-display text-lg">{designTitle(design)}</p>
            </div>
            <div className="flex rounded-full border border-border bg-background p-0.5">
              {(["front", "back"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => set({ view: v })}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs capitalize transition-colors",
                    design.view === v
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v} view
                </button>
              ))}
            </div>
          </div>
          <div className="mx-auto h-[460px] w-full max-w-[340px] sm:h-[540px]">
            <GarmentPreview design={design} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-3">
            <div>
              <p className="eyebrow">Atelier price</p>
              <p className="font-display text-2xl">{formatMoney(price, currency)}</p>
              {currency === "INR" ? (
                <p className="text-[0.7rem] text-muted-foreground">approx. from {formatMoney(price)}</p>
              ) : null}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  resetDesign(gender);
                  toast.info("Design reset");
                }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-sm transition-colors hover:bg-secondary"
              >
                <RotateCcw className="size-4" aria-hidden /> Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  addToCart(design);
                  toast.success("Added to cart");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                <ShoppingBag className="size-4" aria-hidden /> Add to Cart
              </button>
            </div>
          </div>
        </div>
        <Link
          to="/cart"
          className="block rounded-2xl border border-dashed border-border px-4 py-3 text-center text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          Go to cart & checkout →
        </Link>
      </div>

      {/* ---------- options ---------- */}
      <div className="space-y-5">
        <Section title="Starter presets">
          <div className="grid gap-2 sm:grid-cols-2">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  set(p.patch as DeepPartial<DesignState>);
                  toast.success(`${p.name} applied`);
                }}
                className="rounded-xl border border-border bg-background p-3 text-left transition-all hover:border-primary/60 hover:shadow-soft"
              >
                <p className="font-display text-base">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.blurb}</p>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Body shape">
          <div className="grid gap-2 sm:grid-cols-2">
            {shapes.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => set({ bodyShape: s.id })}
                aria-pressed={design.bodyShape === s.id}
                className={cn(
                  "rounded-xl border p-3 text-left transition-all",
                  design.bodyShape === s.id
                    ? "border-primary bg-secondary shadow-soft"
                    : "border-border bg-background hover:border-primary/50",
                )}
              >
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.description}</p>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Adaptive fit">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Choose a limb difference and the live preview, garment length and
              sleeve construction adapt to it.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {DISABILITIES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => set({ disability: d.id })}
                  aria-pressed={design.disability === d.id}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-all",
                    design.disability === d.id
                      ? "border-primary bg-secondary shadow-soft"
                      : "border-border bg-background hover:border-primary/50",
                  )}
                >
                  <p className="text-sm font-medium">{d.label}</p>
                  <p className="text-xs text-muted-foreground">{d.description}</p>
                </button>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Size">
          <OptionRow
            label="Measurement"
            options={SIZES}
            value={design.size}
            onChange={(v) => set({ size: v as Size })}
            hint="Preview scales with your size"
          />
        </Section>

        <Section title="Clothing category">
          <OptionRow
            label="Garment type"
            options={categories.map((c) => c.label)}
            value={categories.find((c) => c.id === design.category)?.label ?? categories[0]!.label}
            onChange={(label) => {
              const found = categories.find((c) => c.label === label);
              if (!found) return;
              set({
                category: found.id,
                jacket: { enabled: found.id === "suit" },
              });
            }}
          />
        </Section>

        {isDress ? (
          <Section title="Dress construction">
            <div className="space-y-4">
              <OptionRow label="Neckline" options={NECKLINES} value={design.dress.neckline} onChange={(v) => set({ dress: { neckline: v } })} />
              <OptionRow label="Sleeves" options={SLEEVES} value={design.dress.sleeve} onChange={(v) => set({ dress: { sleeve: v } })} />
              <OptionRow label="Collar" options={DRESS_COLLARS} value={design.dress.collar} onChange={(v) => set({ dress: { collar: v } })} />
              <OptionRow label="Waistline" options={WAISTLINES} value={design.dress.waistline} onChange={(v) => set({ dress: { waistline: v } })} />
              <OptionRow label="Skirt silhouette" options={SKIRTS} value={design.dress.skirt} onChange={(v) => set({ dress: { skirt: v } })} />
              <OptionRow label="Hemline" options={HEMLINES} value={design.dress.hemline} onChange={(v) => set({ dress: { hemline: v } })} />
              <ColorField label="Dress color" value={design.dress.color} onChange={(v) => set({ dress: { color: v } })} />
            </div>
          </Section>
        ) : (
          <>
            <Section title={gender === "female" ? "Shirt construction" : "Shirt"}>
              <div className="space-y-4">
                <OptionRow label="Collar" options={SHIRT_COLLARS} value={design.shirt.collar} onChange={(v) => set({ shirt: { collar: v } })} />
                <OptionRow label="Sleeve length" options={SHIRT_SLEEVES} value={design.shirt.sleeve} onChange={(v) => set({ shirt: { sleeve: v } })} hint="Cuffs follow the sleeve end" />
                <OptionRow label="Cuffs" options={CUFFS} value={design.shirt.cuff} onChange={(v) => set({ shirt: { cuff: v } })} />
                <OptionRow label="Placket" options={PLACKETS} value={design.shirt.placket} onChange={(v) => set({ shirt: { placket: v } })} />
                <OptionRow label="Yoke" options={YOKES} value={design.shirt.yoke} onChange={(v) => set({ shirt: { yoke: v }, view: "back" })} hint="Back-view detail — preview flips automatically" />
                <ColorField label="Shirt color" value={design.shirt.color} onChange={(v) => set({ shirt: { color: v } })} />
              </div>
            </Section>

            <Section title={gender === "female" ? "Pants" : "Trousers"}>
              <div className="space-y-4">
                <OptionRow label="Waistband" options={WAISTBANDS} value={design.pants.waistband} onChange={(v) => set({ pants: { waistband: v } })} />
                <OptionRow label="Fly" options={FLIES} value={design.pants.fly} onChange={(v) => set({ pants: { fly: v } })} />
                <OptionRow label="Cuff / hem" options={PANT_HEMS} value={design.pants.hem} onChange={(v) => set({ pants: { hem: v } })} />
                <OptionRow
                  label="Inseam length"
                  options={PANT_LENGTHS.map((l) => l.id)}
                  labels={PANT_LENGTHS.reduce<Record<string, string>>((acc, l) => {
                    acc[l.id] = l.label;
                    return acc;
                  }, {})}
                  value={design.pants.length}
                  onChange={(v) => set({ pants: { length: v } })}
                />
                <ColorField label="Bottoms color" value={design.pants.color} onChange={(v) => set({ pants: { color: v } })} />
              </div>
            </Section>

            {design.category === "suit" ? (
              <Section title="Jacket / suit">
                <div className="space-y-4">
                  <OptionRow label="Lapels" options={LAPELS} value={design.jacket.lapel} onChange={(v) => set({ jacket: { lapel: v, enabled: true } })} />
                  <OptionRow label="Vents" options={VENTS} value={design.jacket.vent} onChange={(v) => set({ jacket: { vent: v }, view: "back" })} hint="Back-view detail — preview flips automatically" />
                  <OptionRow label="Breast pocket" options={BREAST_POCKETS} value={design.jacket.pocket} onChange={(v) => set({ jacket: { pocket: v }, view: "front" })} hint="Front-view detail — preview flips automatically" />
                  <ColorField label="Jacket color" value={design.jacket.color} onChange={(v) => set({ jacket: { color: v } })} />
                </div>
              </Section>
            ) : null}
          </>
        )}

        <Section title="Fabric">
          <div className="grid gap-2 sm:grid-cols-2">
            {FABRICS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => set({ fabric: f.id })}
                aria-pressed={design.fabric === f.id}
                className={cn(
                  "rounded-xl border p-3 text-left transition-all",
                  design.fabric === f.id
                    ? "border-primary bg-secondary shadow-soft"
                    : "border-border bg-background hover:border-primary/50",
                )}
              >
                <p className="text-sm font-medium">
                  {f.id}{" "}
                  <span className="text-muted-foreground">₹{f.ratePerMetre}/m</span>
                </p>
                <p className="text-xs text-muted-foreground">{f.note}</p>
              </button>
            ))}
          </div>
        </Section>

        <Section title={isDress ? "Pattern library" : "Pattern — top"}>
          <div className="space-y-4">
            {PATTERN_GROUPS.map((g) => (
              <OptionRow
                key={g.group}
                label={g.group}
                options={g.patterns}
                value={design.pattern.name}
                onChange={(v) => set({ pattern: { name: v } })}
              />
            ))}
            <div className="grid gap-2 sm:grid-cols-2">
              <ColorField label="Pattern primary" value={design.pattern.primary} onChange={(v) => set({ pattern: { primary: v } })} />
              <ColorField label="Pattern secondary" value={design.pattern.secondary} onChange={(v) => set({ pattern: { secondary: v } })} />
            </div>
          </div>
        </Section>

        {isDress ? null : (
          <Section title="Pattern — bottoms">
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Patterned separately from the top, so you can print only one half.
              </p>
              {PATTERN_GROUPS.map((g) => (
                <OptionRow
                  key={g.group}
                  label={g.group}
                  options={g.patterns}
                  value={design.pantsPattern.name}
                  onChange={(v) => set({ pantsPattern: { name: v } })}
                />
              ))}
              <div className="grid gap-2 sm:grid-cols-2">
                <ColorField label="Bottoms pattern primary" value={design.pantsPattern.primary} onChange={(v) => set({ pantsPattern: { primary: v } })} />
                <ColorField label="Bottoms pattern secondary" value={design.pantsPattern.secondary} onChange={(v) => set({ pantsPattern: { secondary: v } })} />
              </div>
            </div>
          </Section>
        )}
      </div>

      {/* ---------- AI stylist ---------- */}
      <div className="xl:sticky xl:top-24 xl:self-start">
        <StylistPanel design={design} onApply={(patch) => set(patch)} />
      </div>
    </div>
  );
}
