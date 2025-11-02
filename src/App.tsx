import React, { useMemo, useState } from "react";

// 🔧 YOUR SETTINGS
const VENMO_HANDLE = "@allheartbasketballcoach"; // <-- change to your Venmo
const VENMO_QR_URL = "/venmoQR.jpeg"; // <-- drop QR in /public
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xwpwagvw"; // <-- your real Formspree URL

// your 5 designs
const DESIGNS = [
  { id: "colonelA", name: "Colonel A", image: "/ColonelA.png" },
  { id: "colonelBblack", name: "Colonel B – Black", image: "/ColonelB-Black.png" },
  { id: "colonelBblue", name: "Colonel B – Blue", image: "/ColonelB-Blue.png" },
  { id: "colonelCblack", name: "Colonel C – Black", image: "/ColonelC-Black.png" },
  { id: "colonelCblue", name: "Colonel C – Blue", image: "/ColonelC-Blue.png" },
];

const COLORS = ["White", "Black", "Heather Gray", "Royal Blue"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

// pricing: $25 each, 2 for $45
function calcSubtotal(qty: number) {
  const pairs = Math.floor(qty / 2);
  const remainder = qty % 2;
  return pairs * 45 + remainder * 25;
}
function calcUnitPrice(qty: number) {
  if (qty <= 0) return 25;
  return calcSubtotal(qty) / qty;
}

export default function App() {
  // base form
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    notes: "",
    agreed: false,
  });

  // dynamic line items
  const [lineItems, setLineItems] = useState<
    Array<{
      id: number;
      design: string;
      color: string;
      size: string;
      qty: number;
      notes: string;
    }>
  >([
    {
      id: 1,
      design: "colonelA",
      color: "White",
      size: "M",
      qty: 1,
      notes: "",
    },
  ]);

  // order id
  const orderId = useMemo(() => {
    const t = new Date();
    return `ORD-${t.getFullYear()}${String(t.getMonth() + 1).padStart(
      2,
      "0"
    )}${String(t.getDate()).padStart(2, "0")}-${t.getHours()}${t.getMinutes()}${t.getSeconds()}`;
  }, []);

  // totals
  const totalQty = lineItems.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  const safeTotalQty = totalQty > 0 ? totalQty : 1;
  const subtotal = calcSubtotal(safeTotalQty);
  const unit = calcUnitPrice(safeTotalQty);
  const shipping = 5;
  const taxRate = 0;
  const tax = Number((subtotal * taxRate).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  // handlers
  const onFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onLineChange = (
    id: number,
    field: keyof (typeof lineItems)[number],
    value: string | number
  ) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "qty" ? Number(value) : value,
            }
          : item
      )
    );
  };

  const addLine = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
        design: "colonelA",
        color: "White",
        size: "M",
        qty: 1,
        notes: "",
      },
    ]);
  };

  const removeLine = (id: number) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  // this goes to Formspree so you see all shirts
  const orderLinesJSON = JSON.stringify(lineItems);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Cov Cath Colonel “#TAKEITBACK” T-Shirt Shop
        </h1>
        <p className="text-sm mt-1 opacity-80">
          $25 each or 2 for $45. Pick a design, color, size, and add as many rows as you need.
        </p>
      </header>

      <main className="mx-auto max-w-5xl px-4 grid lg:grid-cols-2 gap-8 pb-20">
        {/* LEFT */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>

          <form action={FORMSPREE_ENDPOINT} method="POST" className="space-y-4">
            {/* hidden stuff */}
            <input type="hidden" name="orderId" value={orderId} />
            <input type="hidden" name="total" value={total} />
            <input type="hidden" name="totalQty" value={totalQty} />
            <input type="hidden" name="orderLinesJSON" value={orderLinesJSON} />

            {/* contact */}
            <div className="grid grid-cols-2 gap-4">
              <label className="text-sm">
                Full Name
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={onFormChange}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  placeholder="Jane Doe"
                />
              </label>
              <label className="text-sm">
                Email
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onFormChange}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label className="text-sm block">
              Shipping Address
              <textarea
                required
                name="address"
                value={form.address}
                onChange={onFormChange}
                className="mt-1 w-full rounded-xl border px-3 py-2"
                placeholder="Street, City, State, ZIP"
              />
            </label>

            {/* design cards – just for preview, not required */}
            <label className="text-sm block mb-2">Designs available</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
              {DESIGNS.map((d) => (
                <div
                  key={d.id}
                  className="rounded-xl border p-2 text-center bg-zinc-50"
                >
                  <img
                    src={d.image}
                    alt={d.name}
                    className="rounded-lg mb-1 w-full object-contain"
                  />
                  <p className="text-xs font-medium">{d.name}</p>
                </div>
              ))}
            </div>

            {/* DYNAMIC ROWS */}
            <p className="text-sm mt-4 mb-2 font-semibold">Shirts in this order</p>

            {lineItems.map((item, idx) => (
              <div
                key={item.id}
                className="grid grid-cols-5 gap-3 mb-2 items-end border-b pb-2"
              >
                <label className="text-xs">
                  Design
                  <select
                    value={item.design}
                    onChange={(e) =>
                      onLineChange(item.id, "design", e.target.value)
                    }
                    className="mt-1 w-full rounded-xl border px-2 py-1"
                  >
                    {DESIGNS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-xs">
                  Color
                  <select
                    value={item.color}
                    onChange={(e) =>
                      onLineChange(item.id, "color", e.target.value)
                    }
                    className="mt-1 w-full rounded-xl border px-2 py-1"
                  >
                    {COLORS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-xs">
                  Size
                  <select
                    value={item.size}
                    onChange={(e) =>
                      onLineChange(item.id, "size", e.target.value)
                    }
                    className="mt-1 w-full rounded-xl border px-2 py-1"
                  >
                    {SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-xs">
                  Qty
                  <input
                    type="number"
                    min={0}
                    value={item.qty}
                    onChange={(e) =>
                      onLineChange(item.id, "qty", Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-xl border px-2 py-1"
                  />
                </label>

                <div className="flex gap-2 items-center">
                  <input
                    value={item.notes}
                    onChange={(e) =>
                      onLineChange(item.id, "notes", e.target.value)
                    }
                    className="mt-1 w-full rounded-xl border px-2 py-1 text-xs"
                    placeholder="notes"
                  />
                  {lineItems.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeLine(item.id)}
                      className="text-[10px] text-red-500"
                    >
                      X
                    </button>
                  ) : null}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addLine}
              className="text-sm rounded-lg border px-3 py-1 bg-zinc-50 hover:bg-zinc-100"
            >
              + Add another shirt
            </button>

            {/* extra notes */}
            <label className="text-sm block">
              Notes (optional)
              <textarea
                name="notes"
                value={form.notes}
                onChange={onFormChange}
                className="mt-1 w-full rounded-xl border px-3 py-2"
                placeholder="Anything special?"
              />
            </label>

            {/* totals */}
            <div className="rounded-xl border bg-zinc-50 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span>Total shirts</span>
                <span className="font-semibold">{totalQty}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Unit price</span>
                <span className="font-semibold">${unit.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="font-semibold">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t mt-2 pt-2">
                <span>Total</span>
                <span className="text-lg font-bold">${total.toFixed(2)}</span>
              </div>
              <p className="mt-2 text-xs opacity-70">
                Discount auto-calculated: $25 each or 2 for $45.
              </p>
            </div>

            {/* agree + submit */}
            <label className="flex items-start gap-3 text-sm">
              <input
                required
                type="checkbox"
                name="agreed"
                checked={form.agreed}
                onChange={onFormChange}
              />
              <span>I will pay on Venmo and include my Order ID in the note.</span>
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-zinc-900 text-white font-semibold py-3 hover:opacity-90"
            >
              1) Submit Order
            </button>
          </form>
        </section>

        {/* RIGHT */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-2">2) Pay on Venmo</h2>
          <p className="text-sm mb-4">
            Open Venmo and pay <span className="font-semibold">{VENMO_HANDLE}</span> for the{" "}
            <span className="font-semibold">Total</span> shown. In the note, paste your Order ID{" "}
            <span className="font-mono">{orderId}</span>.
          </p>

          <div className="grid md:grid-cols-2 gap-4 items-start">
            <div className="rounded-2xl border p-3 flex flex-col items-center">
              <img src={VENMO_QR_URL} alt="Venmo QR" className="rounded-xl w-full" />
              <a
                href={`https://venmo.com/${VENMO_HANDLE.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block rounded-xl border px-4 py-2 text-sm"
              >
                Open {VENMO_HANDLE} in Venmo
              </a>
            </div>

            <div className="text-sm space-y-3">
              <div className="rounded-xl bg-zinc-50 p-3">
                <p className="font-semibold">Why Venmo Business?</p>
                <ul className="list-disc ml-5 mt-1">
                  <li>Fast checkout for buyers</li>
                  <li>Keeps personal &amp; business separate</li>
                  <li>QR + preset amounts for $25 or $45</li>
                </ul>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3">
                <p className="font-semibold">Pro tips</p>
                <ul className="list-disc ml-5 mt-1">
                  <li>Tell buyers to paste the Order ID in the note</li>
                  <li>Set up preset QR amounts in Venmo</li>
                  <li>Use Pirate Ship for labels</li>
                </ul>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3">
                <p className="font-semibold">Support</p>
                <p>Email: mcgillisrj@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border p-4 text-xs leading-5">
            <p className="font-semibold mb-1">Refunds &amp; Exchanges</p>
            <p>
              Exchanges accepted for unworn tees within 14 days. Buyer pays return shipping unless we
              messed up. Custom prints are final sale.
            </p>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-10 text-xs opacity-70">
        <p>© {new Date().getFullYear()} Cov Cath Colonel Shirts • All rights reserved.</p>
      </footer>
    </div>
  );
}
