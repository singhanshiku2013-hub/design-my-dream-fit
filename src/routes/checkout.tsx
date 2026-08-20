import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { PageShell } from "@/components/site/SiteNav";
import { useStore, type Customer } from "@/lib/design/store";
import {
  CUSTOMS_NOTICE,
  SHIPPING_LABEL,
  SIZES,
  formatMoney,
  type ShippingMethod,
  type Size,
} from "@/lib/design/options";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Chic Canvas" },
      {
        name: "description",
        content:
          "Enter delivery details, choose a payment method and confirm your made-to-measure order.",
      },
      { property: "og:title", content: "Checkout — Chic Canvas" },
      { property: "og:description", content: "Delivery details for your custom garments." },
    ],
  }),
  component: CheckoutPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  address: z.string().trim().min(8, "Please enter a complete address").max(300),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9 ()-]{7,20}$/, "Enter a valid phone number"),
  payment: z.enum(["Cash on Delivery", "Card", "Online Payment"]),
});

const PAYMENTS: Customer["payment"][] = ["Cash on Delivery", "Card", "Online Payment"];

function CheckoutPage() {
  const { cart, totals, shippingMethod, setShippingMethod, placeOrder, updateCartItemSize, hydrated, currency } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState<Customer>({
    name: "",
    address: "",
    phone: "",
    payment: "Cash on Delivery",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setErrors({});
    placeOrder(parsed.data);
    void navigate({ to: "/order-confirmation" });
  }

  const field = (
    key: "name" | "address" | "phone",
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <label className="block space-y-1.5">
      <span className="eyebrow">{label}</span>
      <input
        {...props}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary/60"
      />
      {errors[key] ? <span className="text-xs text-destructive">{errors[key]}</span> : null}
    </label>
  );

  if (!hydrated) {
    return (
      <PageShell className="space-y-8">
        <div className="space-y-2">
          <p className="eyebrow">Almost yours</p>
          <h1 className="font-display text-4xl">Checkout</h1>
        </div>
        <div className="h-40 animate-pulse rounded-3xl border border-dashed border-border" />
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-8">
      <div className="space-y-2">
        <p className="eyebrow">Almost yours</p>
        <h1 className="font-display text-4xl">Checkout</h1>
      </div>

      {cart.length === 0 ? (
        <div className="space-y-4 rounded-3xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">Add a garment before checking out.</p>
          <Link
            to="/gender"
            className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Start designing
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-soft">
            {field("name", "Full name", { placeholder: "Ayesha Rahman", maxLength: 100, autoComplete: "name" })}
            {field("phone", "Phone number", { placeholder: "+880 1XXX XXXXXX", maxLength: 20, autoComplete: "tel" })}
            <label className="block space-y-1.5">
              <span className="eyebrow">Delivery address</span>
              <textarea
                value={form.address}
                rows={3}
                maxLength={300}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary/60"
                placeholder="House, road, area, city, postal code"
              />
              {errors["address"] ? (
                <span className="text-xs text-destructive">{errors["address"]}</span>
              ) : null}
            </label>

            <div className="space-y-2">
              <span className="eyebrow">Method of payment</span>
              <div className="flex flex-wrap gap-2">
                {PAYMENTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, payment: p }))}
                    aria-pressed={form.payment === p}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-colors",
                      form.payment === p
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                No live payment is processed — your order is confirmed with the atelier.
              </p>
            </div>
          </div>

          <aside className="space-y-4 self-start rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="font-display text-xl">Order</h2>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="space-y-1.5 border-b border-border pb-3 last:border-0">
                  <div className="flex justify-between gap-3 text-sm">
                    <span>{item.title}</span>
                    <span className="tabular-nums">{formatMoney(item.price * item.qty, currency)}</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    Selected size
                    <select
                      value={item.size}
                      onChange={(e) => updateCartItemSize(item.id, e.target.value as Size)}
                      className="rounded-md border border-border bg-background px-2 py-1 text-foreground"
                    >
                      {SIZES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <span>× {item.qty}</span>
                  </label>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-border pt-3">
              <span className="eyebrow">Shipping method</span>
              <div className="flex flex-col gap-2">
                {(["domestic", "international"] as ShippingMethod[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setShippingMethod(m)}
                    aria-pressed={shippingMethod === m}
                    className={cn(
                      "rounded-xl border px-3.5 py-2 text-left text-sm transition-colors",
                      shippingMethod === m
                        ? "border-primary bg-secondary"
                        : "border-border bg-background text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {SHIPPING_LABEL[m]}
                  </button>
                ))}
              </div>
            </div>

            {shippingMethod === "international" ? (
              <p
                role="note"
                className="rounded-xl border border-primary/40 bg-secondary/60 p-3 text-xs text-muted-foreground"
              >
                {CUSTOMS_NOTICE}
              </p>
            ) : null}

            <dl className="space-y-2 border-t border-border pt-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Base cost</dt>
                <dd className="tabular-nums">{formatMoney(totals.cost, currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Markup (1.6×)</dt>
                <dd className="tabular-nums">{formatMoney(totals.markup, currency)}</dd>
              </div>
              <div className="flex justify-between">
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
                <dt className="text-muted-foreground">Shipping ({shippingMethod})</dt>
                <dd className="tabular-nums">{formatMoney(totals.shipping, currency)}</dd>
              </div>
            </dl>
            <div className="flex justify-between border-t border-border pt-3 font-display text-2xl">
              <span>Total</span>
              <span className="tabular-nums">{formatMoney(totals.total, currency)}</span>
            </div>
            {currency === "INR" ? (
              <p className="text-xs text-muted-foreground">
                {formatMoney(totals.total, "USD")} approx. — all charges are computed in INR.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Charged as {formatMoney(totals.total)} (INR).
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-primary px-5 py-3 font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Confirm order
            </button>
            <Link to="/cart" className="block text-center text-xs text-muted-foreground hover:text-foreground">
              Back to cart
            </Link>
          </aside>
        </form>
      )}
    </PageShell>
  );
}
