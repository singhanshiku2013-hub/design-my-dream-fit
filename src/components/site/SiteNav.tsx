import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useStore } from "@/lib/design/store";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/gender", label: "Gender" },
  { to: "/customize/$gender", label: "Customizer", params: { gender: "female" } },
  { to: "/cart", label: "Cart" },
  { to: "/checkout", label: "Checkout" },
  { to: "/order-confirmation", label: "Confirmation" },
  { to: "/thank-you", label: "Thank You" },
] as const;

function CurrencyToggle() {
  const { currency, setCurrency } = useStore();
  return (
    <div
      className="order-2 flex shrink-0 rounded-full border border-border bg-background p-0.5 sm:order-3"
      role="group"
      aria-label="Display currency"
    >
      {(["USD", "INR"] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCurrency(c)}
          aria-pressed={currency === c}
          className={cn(
            "rounded-full px-2.5 py-1 text-[0.75rem] font-medium transition-colors",
            currency === c
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {c === "USD" ? "$ USD" : "₹ INR"}
        </button>
      ))}
    </div>
  );
}

export function SiteNav() {
  const { cart } = useStore();
  const count = cart.reduce((n, i) => n + i.qty, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight">
          Chic <span className="text-luxe-gradient">Canvas</span>
        </Link>

        <nav className="order-3 -mx-1 flex w-full items-center gap-1 overflow-x-auto pb-1 sm:order-2 sm:mx-0 sm:w-auto sm:overflow-visible sm:pb-0">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              to={l.to as any}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {...("params" in l ? ({ params: l.params } as any) : {})}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-[0.8rem] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
              )}
              activeProps={{ className: "bg-secondary text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="order-2 ml-auto sm:order-3">
          <CurrencyToggle />
        </div>

        <Link
          to="/cart"
          className="order-2 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:bg-secondary sm:order-3"
        >
          <ShoppingBag className="size-4" aria-hidden />
          <span className="tabular-nums">{count}</span>
          <span className="sr-only">items in cart</span>
        </Link>
      </div>
    </header>
  );
}

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className={cn("mx-auto max-w-7xl px-4 py-10 sm:px-6", className)}>{children}</main>
      <footer className="border-t border-border/70 py-8 text-center text-xs text-muted-foreground">
        Chic Canvas: made-to-measure luxury. We make dresses suit people, not the other way around.
      </footer>
    </div>
  );
}

export function Quote({ text, className }: { text: string; className?: string }) {
  return (
    <blockquote
      className={cn(
        "font-display text-xl leading-relaxed text-foreground/90 italic sm:text-2xl",
        className,
      )}
    >
      <span className="text-gold">“</span>
      {text}
      <span className="text-gold">”</span>
    </blockquote>
  );
}
