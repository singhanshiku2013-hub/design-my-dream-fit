import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { PageShell, Quote } from "@/components/site/SiteNav";
import { GarmentPreview } from "@/components/preview/GarmentPreview";
import { useStore } from "@/lib/design/store";
import { CUSTOMS_NOTICE, QUOTES, designSummary, formatMoney } from "@/lib/design/options";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Chic Canvas" },
      {
        name: "description",
        content: "Review your custom garments, adjust quantities and continue to checkout.",
      },
      { property: "og:title", content: "Your Cart — Chic Canvas" },
      { property: "og:description", content: "Your made-to-measure pieces, ready for checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, removeFromCart, setQty, totals, shippingMethod, clearCart, hydrated, currency } =
    useStore();
  const navigate = useNavigate();

  if (!hydrated) {
    return (
      <PageShell className="space-y-8">
        <div className="space-y-2">
          <p className="eyebrow">Your selection</p>
          <h1 className="font-display text-4xl">Cart</h1>
        </div>
        <div className="h-40 animate-pulse rounded-3xl border border-dashed border-border" />
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-8">
      <div className="space-y-2">
        <p className="eyebrow">Your selection</p>
        <h1 className="font-display text-4xl">Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="space-y-4 rounded-3xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">Nothing here yet — your atelier awaits.</p>
          <Link
            to="/gender"
            className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Start designing
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-4">
            {cart.map((item) => (
              <article
                key={item.id}
                className="flex flex-wrap gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft"
              >
                <div className="surface-luxe h-40 w-28 shrink-0 rounded-xl border border-border p-1">
                  <GarmentPreview design={item.design} />
                </div>
                <div className="min-w-[200px] flex-1 space-y-2">
                  <h2 className="font-display text-xl">{item.title}</h2>
                  <p className="text-xs text-muted-foreground">
                    Size {item.size} · {item.design.fabric} · {item.design.pattern.name} pattern
                  </p>
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      Customization details
                    </summary>
                    <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                      {designSummary(item.design).map((r) => (
                        <div key={r.label} className="flex justify-between gap-2">
                          <dt className="text-muted-foreground">{r.label}</dt>
                          <dd>{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center rounded-full border border-border">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQty(item.id, item.qty - 1)}
                        className="grid size-8 place-items-center rounded-full hover:bg-secondary"
                      >
                        <Minus className="size-3.5" aria-hidden />
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums">{item.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQty(item.id, item.qty + 1)}
                        className="grid size-8 place-items-center rounded-full hover:bg-secondary"
                      >
                        <Plus className="size-3.5" aria-hidden />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" aria-hidden /> Remove
                    </button>
                    <span className="ml-auto font-display text-lg">{formatMoney(item.price * item.qty, currency)}</span>
                  </div>
                </div>
              </article>
            ))}
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Clear cart
            </button>
          </div>

          <aside className="space-y-4 self-start rounded-2xl border border-border bg-card p-5 shadow-soft lg:sticky lg:top-24">
            <h2 className="font-display text-xl">Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Base cost (fabric, labour, add-ons)</dt>
                <dd className="tabular-nums">{formatMoney(totals.cost, currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Atelier markup (1.6×)</dt>
                <dd className="tabular-nums">{formatMoney(totals.markup, currency)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <dt className="text-muted-foreground">Price</dt>
                <dd className="tabular-nums">{formatMoney(totals.subtotal, currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  GST ({Math.round(totals.gstRate * 100)}% slab)
                </dt>
                <dd className="tabular-nums">{formatMoney(totals.gst, currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Shipping ({shippingMethod === "domestic" ? "domestic" : "international"})
                </dt>
                <dd className="tabular-nums">{formatMoney(totals.shipping, currency)}</dd>
              </div>
            </dl>
            {shippingMethod === "international" ? (
              <p className="rounded-xl border border-border bg-secondary/60 p-3 text-xs text-muted-foreground">
                {CUSTOMS_NOTICE}
              </p>
            ) : null}
            <div className="flex justify-between border-t border-border pt-3 font-display text-2xl">
              <span>Total</span>
              <span className="tabular-nums">{formatMoney(totals.total, currency)}</span>
            </div>
            {currency === "INR" ? (
              <p className="text-xs text-muted-foreground">
                {formatMoney(totals.total, "USD")} approx. — charges are made in INR.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Charged as {formatMoney(totals.total)} (INR).
              </p>
            )}
            <button
              type="button"
              onClick={() => void navigate({ to: "/checkout" })}
              className="w-full rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Proceed to checkout
            </button>
            <Link
              to="/gender"
              className="block text-center text-xs text-muted-foreground hover:text-foreground"
            >
              Keep designing
            </Link>
          </aside>
        </div>
      )}

      <Quote text={QUOTES[4]!} className="text-center" />
    </PageShell>
  );
}
