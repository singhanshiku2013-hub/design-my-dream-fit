import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Quote } from "@/components/site/SiteNav";
import { QUOTES } from "@/lib/design/options";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thank You — DesignMyDress" },
      {
        name: "description",
        content: "Your custom garment is in production. Thank you for designing with us.",
      },
      { property: "og:title", content: "Thank You — DesignMyDress" },
      { property: "og:description", content: "Confidence is the finest fabric we work with." },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  return (
    <PageShell className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
      <svg viewBox="0 0 240 200" className="h-48 w-60" role="img" aria-label="Celebration illustration">
        <defs>
          <linearGradient id="ty-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-blush)" />
            <stop offset="100%" stopColor="var(--color-sage)" />
          </linearGradient>
        </defs>
        <circle cx="120" cy="100" r="76" fill="url(#ty-g)" opacity="0.55" />
        <path
          d="M120 44 c26 0 34 26 34 48 0 30 -14 62 -34 62 s-34 -32 -34 -62 c0 -22 8 -48 34 -48 Z"
          fill="var(--color-card)"
          stroke="var(--color-primary)"
          strokeWidth="2.5"
        />
        <path d="M86 154 q34 16 68 0" stroke="var(--color-primary)" strokeWidth="2.5" fill="none" />
        <path d="M92 92 q28 18 56 0" stroke="var(--color-gold)" strokeWidth="3" fill="none" />
        <g fill="var(--color-gold)">
          <circle cx="42" cy="52" r="4" />
          <circle cx="200" cy="40" r="5" />
          <circle cx="212" cy="140" r="4" />
          <circle cx="30" cy="132" r="5" />
        </g>
      </svg>

      <div className="space-y-3">
        <h1 className="font-display text-4xl sm:text-5xl">Thank you for designing with us</h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          Your pieces are now with our cutters. We&apos;ll keep you posted at every stitch — and
          we&apos;ll be waiting for the next thing you dream up.
        </p>
      </div>

      <Quote text={QUOTES[0]!} className="max-w-2xl" />

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/gender"
          className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Continue Shopping
        </Link>
        <Link
          to="/"
          className="rounded-full border border-border px-6 py-3 transition-colors hover:bg-secondary"
        >
          Return Home
        </Link>
      </div>
    </PageShell>
  );
}
