import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Clock } from "lucide-react";
import { PageShell, Quote } from "@/components/site/SiteNav";
import { GarmentPreview } from "@/components/preview/GarmentPreview";
import { useStore } from "@/lib/design/store";
import { QUOTES, designSummary, formatMoney } from "@/lib/design/options";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "Order Confirmation — Chic Canvas" },
      {
        name: "description",
        content:
          "Your complete customization summary, delivery details and estimated atelier production timeline.",
      },
      { property: "og:title", content: "Order Confirmation — Chic Canvas" },
      { property: "og:description", content: "Everything we will hand-make for you, confirmed." },
    ],
  }),
  component: OrderConfirmation,
});

function OrderConfirmation() {
  const { order, hydrated, clearCart, currency } = useStore();
  const navigate = useNavigate();

  if (!hydrated) return <PageShell>{null}</PageShell>;

  if (!order) {
    return (
      <PageShell className="space-y-6">
        <h1 className="font-display text-4xl">No order yet</h1>
        <p className="text-muted-foreground">Place an order at checkout to see its confirmation.</p>
        <Link
          to="/gender"
          className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Start designing
        </Link>
      </PageShell>
    );
  }

  const placed = new Date(order.placedAt);
  const ready = new Date(placed.getTime() + 12 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });

  return (
    <PageShell className="space-y-8">
      <div className="surface-luxe space-y-3 rounded-3xl border border-border p-8 text-center shadow-luxe">
        <CheckCircle2 className="mx-auto size-10 text-primary" aria-hidden />
        <h1 className="font-display text-4xl">Order {order.id} confirmed</h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          Thank you, {order.customer.name}. Our atelier has received your specifications and pattern
          cutting begins within 48 hours.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-4">
          {order.items.map((item) => (
            <article key={item.id} className="flex flex-wrap gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <div className="surface-luxe h-48 w-32 shrink-0 rounded-xl border border-border p-1">
                <GarmentPreview design={item.design} />
              </div>
              <div className="min-w-[220px] flex-1 space-y-2">
                <h2 className="font-display text-xl">{item.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Quantity {item.qty} · {formatMoney(item.price * item.qty, currency)}
                </p>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-1 text-xs sm:grid-cols-2">
                  {designSummary(item.design).map((r) => (
                    <div key={r.label} className="flex justify-between gap-2 border-b border-border/60 py-0.5">
                      <dt className="text-muted-foreground">{r.label}</dt>
                      <dd className="text-right">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-5 self-start rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="space-y-1.5">
            <p className="eyebrow">Customer</p>
            <p className="text-sm">{order.customer.name}</p>
            <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
            <p className="text-sm text-muted-foreground">{order.customer.address}</p>
            <p className="text-sm">Payment: {order.customer.payment}</p>
          </div>
          <div className="space-y-1.5 border-t border-border pt-4">
            <p className="eyebrow flex items-center gap-2">
              <Clock className="size-3.5" aria-hidden /> Production timeline
            </p>
            <p className="text-sm">Ordered {fmt(placed)}</p>
            <p className="text-sm">Pattern & cutting: 2–4 days</p>
            <p className="text-sm">Hand finishing: 5–7 days</p>
            <p className="text-sm font-medium">Estimated delivery {fmt(ready)}</p>
          </div>
          <dl className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Base cost</dt>
              <dd className="tabular-nums">{formatMoney(order.cost, currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Markup (1.6×)</dt>
              <dd className="tabular-nums">{formatMoney(order.markup, currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Price</dt>
              <dd className="tabular-nums">{formatMoney(order.subtotal, currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">GST ({Math.round(order.gstRate * 100)}% slab)</dt>
              <dd className="tabular-nums">{formatMoney(order.gst, currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping ({order.shippingMethod})</dt>
              <dd className="tabular-nums">{formatMoney(order.shipping, currency)}</dd>
            </div>
          </dl>
          <div className="flex justify-between border-t border-border pt-3 font-display text-2xl">
            <span>Total</span>
            <span className="tabular-nums">{formatMoney(order.total, currency)}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              clearCart();
              void navigate({ to: "/thank-you" });
            }}
            className="w-full rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Finish
          </button>
        </aside>
      </div>

      <Quote text={QUOTES[1]!} className="text-center" />
    </PageShell>
  );
}
