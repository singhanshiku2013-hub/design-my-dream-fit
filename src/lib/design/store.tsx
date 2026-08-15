import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  calculateGST,
  defaultDesign,
  designPrice,
  designTitle,
  gstRateFor,
  priceBreakdown,
  shippingFee,
  type Currency,
  type DesignState,
  type Gender,
  type ShippingMethod,
  type Size,
} from "./options";

export type CartItem = {
  id: string;
  title: string;
  size: Size;
  qty: number;
  price: number;
  design: DesignState;
};

export type Customer = {
  name: string;
  address: string;
  phone: string;
  payment: "Cash on Delivery" | "Card" | "Online Payment";
};

export type Order = {
  id: string;
  placedAt: string;
  customer: Customer;
  items: CartItem[];
  /** All amounts in INR. */
  cost: number;
  markup: number;
  subtotal: number;
  gst: number;
  gstRate: number;
  shippingMethod: ShippingMethod;
  shipping: number;
  total: number;
};

/** Itemised INR totals for the current cart. */
export type CartTotals = {
  cost: number;
  markup: number;
  subtotal: number;
  gst: number;
  gstRate: number;
  shipping: number;
  total: number;
};

type Store = {
  hydrated: boolean;
  designs: Record<Gender, DesignState>;
  cart: CartItem[];
  orders: Order[];
  /** Most recent order, or null when no order has been placed. */
  order: Order | null;
  updateDesign: (gender: Gender, patch: DeepPartial<DesignState>) => void;
  resetDesign: (gender: Gender) => void;
  addToCart: (design: DesignState) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  updateCartItemSize: (id: string, size: Size) => void;
  clearCart: () => void;
  placeOrder: (customer: Customer) => Order;
  subtotal: number;
  totals: CartTotals;
  shippingMethod: ShippingMethod;
  setShippingMethod: (m: ShippingMethod) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K];
};

const KEY = "chiccanvas.state.v1";
const LEGACY_KEY = "designmydress.state.v1";
const StoreContext = createContext<Store | null>(null);

function mergeDesign(base: DesignState, patch: DeepPartial<DesignState>): DesignState {
  const next: DesignState = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || value === null) continue;
    const current = (base as Record<string, unknown>)[key];
    if (typeof value === "object" && !Array.isArray(value) && typeof current === "object") {
      (next as Record<string, unknown>)[key] = { ...(current as object), ...(value as object) };
    } else {
      (next as Record<string, unknown>)[key] = value;
    }
  }
  return next;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [designs, setDesigns] = useState<Record<Gender, DesignState>>({
    female: defaultDesign("female"),
    male: defaultDesign("male"),
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currency, setCurrency] = useState<Currency>("INR");
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("domestic");

  useEffect(() => {
    try {
      const raw =
        window.localStorage.getItem(KEY) ?? window.localStorage.getItem(LEGACY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<{
          designs: Record<Gender, DesignState>;
          cart: CartItem[];
          orders: Order[];
          order: Order | null;
          currency: Currency;
          shippingMethod: ShippingMethod;
        }>;
        if (parsed.designs) {
          setDesigns({
            female: mergeDesign(defaultDesign("female"), parsed.designs.female ?? {}),
            male: mergeDesign(defaultDesign("male"), parsed.designs.male ?? {}),
          });
        }
        if (parsed.cart) setCart(parsed.cart);
        if (parsed.orders?.length) setOrders(parsed.orders);
        else if (parsed.order) setOrders([parsed.order]);
        if (parsed.currency === "INR" || parsed.currency === "USD") setCurrency(parsed.currency);
        if (parsed.shippingMethod === "domestic" || parsed.shippingMethod === "international")
          setShippingMethod(parsed.shippingMethod);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        KEY,
        JSON.stringify({ designs, cart, orders, currency, shippingMethod }),
      );
    } catch {
      /* storage full or unavailable */
    }
  }, [hydrated, designs, cart, orders, currency, shippingMethod]);


  const updateDesign = useCallback((gender: Gender, patch: DeepPartial<DesignState>) => {
    setDesigns((prev) => ({ ...prev, [gender]: mergeDesign(prev[gender], patch) }));
  }, []);

  const resetDesign = useCallback((gender: Gender) => {
    setDesigns((prev) => ({ ...prev, [gender]: defaultDesign(gender) }));
  }, []);

  const addToCart = useCallback((design: DesignState) => {
    const item: CartItem = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      title: designTitle(design),
      size: design.size,
      qty: 1,
      price: designPrice(design),
      design: JSON.parse(JSON.stringify(design)) as DesignState,
    };
    setCart((prev) => [...prev, item]);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(20, qty)) } : i)),
    );
  }, []);

  const updateCartItemSize = useCallback((id: string, size: Size) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, size, design: { ...i.design, size } } : i,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totals = useMemo<CartTotals>(() => {
    let cost = 0;
    let subtotal = 0;
    for (const item of cart) {
      cost += priceBreakdown(item.design).cost * item.qty;
      subtotal += item.price * item.qty;
    }
    const gst = cart.length ? calculateGST(subtotal) : 0;
    const shipping = cart.length ? shippingFee(shippingMethod) : 0;
    return {
      cost,
      markup: subtotal - cost,
      subtotal,
      gst,
      gstRate: gstRateFor(subtotal),
      shipping,
      total: subtotal + gst + shipping,
    };
  }, [cart, shippingMethod]);

  const subtotal = totals.subtotal;

  const placeOrder = useCallback(
    (customer: Customer) => {
      const next: Order = {
        id: `CC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        placedAt: new Date().toISOString(),
        customer,
        items: cart,
        cost: totals.cost,
        markup: totals.markup,
        subtotal: totals.subtotal,
        gst: totals.gst,
        gstRate: totals.gstRate,
        shippingMethod,
        shipping: totals.shipping,
        total: totals.total,
      };
      setOrders((prev) => [next, ...prev]);
      setCart([]);
      return next;
    },
    [cart, totals, shippingMethod],
  );

  const value = useMemo<Store>(
    () => ({
      hydrated,
      designs,
      cart,
      orders,
      order: orders[0] ?? null,
      updateDesign,
      resetDesign,
      addToCart,
      removeFromCart,
      setQty,
      updateCartItemSize,
      clearCart,
      placeOrder,
      subtotal,
      totals,
      shippingMethod,
      setShippingMethod,
      currency,
      setCurrency,
    }),
    [
      hydrated,
      designs,
      cart,
      orders,
      updateDesign,
      resetDesign,
      addToCart,
      removeFromCart,
      setQty,
      updateCartItemSize,
      clearCart,
      placeOrder,
      subtotal,
      totals,
      shippingMethod,
      currency,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
