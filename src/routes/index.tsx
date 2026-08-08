import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Ruler, Sparkle, Gem, HeartHandshake } from "lucide-react";
import { PageShell, Quote } from "@/components/site/SiteNav";
import { GarmentPreview } from "@/components/preview/GarmentPreview";
import { QUOTES, defaultDesign } from "@/lib/design/options";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chic Canvas — Luxury Made-To-Measure Clothing" },
      {
        name: "description",
        content:
          "Design luxury clothing that fits your body, personality and mood. Custom necklines, silhouettes, fabrics and AI styling.",
      },
      { property: "og:title", content: "Chic Canvas — Luxury Made-To-Measure Clothing" },
      {
        property: "og:description",
        content: "We make dresses suit people—not force people to suit dresses.",
      },
    ],
  }),
  component: Home,
});

const BENEFITS = [
  {
    icon: Ruler,
    title: "Fit for your body",
    body: "Every silhouette adapts to your body shape and size, so seams fall exactly where they flatter.",
  },
  {
    icon: Gem,
    title: "Premium fabrics",
    body: "Cotton, silk, chiffon and satin — each with its own drape, sheen and personality.",
  },
  {
    icon: Sparkle,
    title: "AI styling",
    body: "A personal stylist reads your occasion and composes a complete look, then explains why it works.",
  },
  {
    icon: HeartHandshake,
    title: "Total customization",
    body: "Necklines, sleeves, collars, waistlines, hems, patterns and colours — down to the hex code.",
  },
];

function Home() {
  const hero = defaultDesign("female");

  return (
    <PageShell className="space-y-24">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div className="animate-rise space-y-6">
          <p className="eyebrow">Luxury personalized clothing</p>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl">
            Clothes that <span className="text-luxe-gradient">suit you</span> — not the other way
            around.
          </h1>
          <p className="max-w-xl text-base text-muted-foreground">
            Chic Canvas is an atelier in your browser. Choose the neckline, the fall of the skirt,
            the sheen of the fabric and the exact shade — then watch it come alive on a model shaped
            like you.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/gender"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-luxe transition-transform hover:scale-[1.03]"
            >
              Start Designing
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-base transition-colors hover:bg-secondary"
            >
              View cart
            </Link>
          </div>
          <Quote text={QUOTES[0]!} className="border-l-2 border-gold pl-5" />
        </div>

        <div className="surface-luxe mx-auto h-[520px] w-full max-w-[420px] rounded-[2rem] border border-border p-6 shadow-luxe">
          <GarmentPreview design={hero} />
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl border border-border bg-card p-8 shadow-soft lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          <p className="eyebrow">Our mission</p>
          <h2 className="font-display text-3xl">
            We make dresses suit people—not force people to suit dresses.
          </h2>
        </div>
        <p className="text-muted-foreground">
          Fashion houses chase trends. Local tailors are limited by their pattern books. We built the
          middle path: atelier-grade construction, an endless catalogue of cuts and patterns, and a
          fit derived from your own proportions. Nothing here asks you to change shape — the garment
          does the changing.
        </p>
      </section>

      <section className="space-y-8">
        <div className="space-y-2 text-center">
          <p className="eyebrow">Why personalized</p>
          <h2 className="font-display text-3xl">Benefits of clothing made for one person</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <article
              key={b.title}
              className="space-y-3 rounded-2xl border border-border bg-card p-5 transition-transform hover:-translate-y-1"
            >
              <span className="grid size-10 place-items-center rounded-full bg-secondary text-secondary-foreground">
                <b.icon className="size-5" aria-hidden />
              </span>
              <h3 className="font-display text-xl">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {QUOTES.slice(1).map((q) => (
          <Quote key={q} text={q} className="rounded-2xl border border-border bg-card p-5 text-lg sm:text-lg" />
        ))}
      </section>

      <section className="surface-luxe space-y-5 rounded-3xl border border-border p-10 text-center shadow-luxe">
        <h2 className="font-display text-3xl">Ready to be measured by your imagination?</h2>
        <p className="mx-auto max-w-xl text-muted-foreground">
          Pick your fit, open the customizer and let the AI stylist do the rest.
        </p>
        <Link
          to="/gender"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Start Designing <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>
    </PageShell>
  );
}
