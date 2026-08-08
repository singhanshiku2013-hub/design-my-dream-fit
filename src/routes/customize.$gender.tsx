import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell, Quote } from "@/components/site/SiteNav";
import { Customizer } from "@/components/customizer/Customizer";
import { QUOTES, type Gender } from "@/lib/design/options";

export const Route = createFileRoute("/customize/$gender")({
  head: ({ params }) => {
    const label = params.gender === "male" ? "Menswear" : "Womenswear";
    return {
      meta: [
        { title: `${label} Customizer — DesignMyDress` },
        {
          name: "description",
          content: `Design ${label.toLowerCase()} live: necklines, sleeves, silhouettes, fabrics, patterns and colours with an AI stylist beside you.`,
        },
        { property: "og:title", content: `${label} Customizer — DesignMyDress` },
        {
          property: "og:description",
          content: "Layered live preview that updates instantly with every choice you make.",
        },
      ],
    };
  },
  beforeLoad: ({ params }): never | void => {
    if (params.gender !== "female" && params.gender !== "male") throw notFound();
  },
  component: CustomizePage,
});

function CustomizePage() {
  const { gender } = Route.useParams();

  return (
    <PageShell className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="eyebrow">{gender === "male" ? "Menswear atelier" : "Womenswear atelier"}</p>
          <h1 className="font-display text-4xl">Design your garment</h1>
        </div>
        <div className="flex gap-2 text-sm">
          <Link
            to="/customize/$gender"
            params={{ gender: gender === "male" ? "female" : "male" }}
            className="rounded-full border border-border px-4 py-2 transition-colors hover:bg-secondary"
          >
            Switch to {gender === "male" ? "female" : "male"} fit
          </Link>
          <Link
            to="/gender"
            className="rounded-full border border-border px-4 py-2 transition-colors hover:bg-secondary"
          >
            Back to fit
          </Link>
        </div>
      </div>

      <Customizer gender={gender as Gender} />

      <Quote text={QUOTES[3]!} className="text-center" />
    </PageShell>
  );
}
