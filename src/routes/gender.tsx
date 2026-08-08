import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageShell, Quote } from "@/components/site/SiteNav";
import { GarmentPreview } from "@/components/preview/GarmentPreview";
import { QUOTES, defaultDesign, type Gender } from "@/lib/design/options";

export const Route = createFileRoute("/gender")({
  head: () => ({
    meta: [
      { title: "Choose Your Fit — Chic Canvas" },
      {
        name: "description",
        content:
          "Select a female or male fit to open the Chic Canvas customizer and start building your made-to-measure garment.",
      },
      { property: "og:title", content: "Choose Your Fit — Chic Canvas" },
      {
        property: "og:description",
        content: "Two elegant starting points: female or male made-to-measure tailoring.",
      },
    ],
  }),
  component: GenderSelection,
});

const CARDS: { gender: Gender; title: string; blurb: string }[] = [
  {
    gender: "female",
    title: "Female",
    blurb:
      "Dresses with every neckline, sleeve and silhouette — or shirts and tailored bottoms with the same detail as menswear.",
  },
  {
    gender: "male",
    title: "Male",
    blurb:
      "Shirts, trousers and jackets built collar-up: lapels, vents, plackets, yokes, cuffs and waistbands.",
  },
];

function GenderSelection() {
  return (
    <PageShell className="space-y-12">
      <div className="space-y-3 text-center">
        <p className="eyebrow">Step one</p>
        <h1 className="font-display text-4xl sm:text-5xl">Which fit should we cut for?</h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          Your choice only sets the starting block and body-shape library. Everything else stays
          fully yours to change.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {CARDS.map((c) => (
          <article
            key={c.gender}
            className="surface-luxe animate-rise group space-y-4 rounded-3xl border border-border p-6 shadow-soft transition-shadow hover:shadow-luxe"
          >
            <div className="mx-auto h-[380px] w-full max-w-[280px]">
              <GarmentPreview design={defaultDesign(c.gender)} />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="font-display text-2xl">{c.title}</h2>
              <p className="text-sm text-muted-foreground">{c.blurb}</p>
            </div>
            <Link
              to="/customize/$gender"
              params={{ gender: c.gender }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground transition-transform group-hover:scale-[1.02]"
            >
              Continue <ArrowRight className="size-4" aria-hidden />
            </Link>
          </article>
        ))}
      </div>

      <Quote text={QUOTES[2]!} className="text-center" />
    </PageShell>
  );
}
