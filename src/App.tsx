
import React, { useMemo, useState } from "react";

// 🔧 YOUR SETTINGS
const VENMO_HANDLE = "@allheartbasketballcoach";
const VENMO_QR_URL = "/venmoQR.jpeg";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xwpwagvw";

// your 5 designs (names can include Black as artwork label)
const DESIGNS = [
  { id: "colonelA", name: "Colonel A", image: "/ColonelA.png" },
  { id: "colonelBblack", name: "Colonel B – Black", image: "/ColonelB-Black.png" },
  { id: "colonelBblue", name: "Colonel B – Blue", image: "/ColonelB-Blue.png" },
  { id: "colonelCblack", name: "Colonel C – Black", image: "/ColonelC-Black.png" },
  { id: "colonelCblue", name: "Colonel C – Blue", image: "/ColonelC-Blue.png" },
];

// ❗ COLORS (no black)
const COLORS = ["White", "Heather Gray", "Royal Blue"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

// pricing logic
function calcSubtotal(qty: number) {
  const pairs = Math.floor(qty / 2);     // every 2 = $45
  const remainder = qty % 2;             // leftover = $25 each
  return pairs * 45 + remainder * 25;
}
function calcUnitPrice(qty: number) {
  if (qty <= 0) return 25;
  return calcSubtotal(qty) / qty;
}

export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    playerInfo: "",
    notes: "",
    agreed: false,
  });

  const [lineItems, setLineItems] = useState([
    { id: 1, design: "colonelA", color: "White", size: "M", qty: 1 },
  ]);

  const [preview, setPreview] = useState({ open: false, image: "", title: "" });

  const orderId = useMemo(() => {
    const t = new Date();
    return `ORD-${t.getFullYear()}${String(t.getMonth() + 1).padStart(2, "0")}${String(
      t.getDate()
    ).padStart(2, "0")}-${t.getHours()}${t.getMinutes()}${t.getSeconds()}`;
  }, []);

  const totalQty = lineItems.reduce((sum, i) => sum + (Number(i.qty) || 0), 0);
  const safeQty = totalQty > 0 ? totalQty : 1;
  const subtotal = calcSubtotal(safeQty);
  const unit = calcUnitPrice(safeQty);
  const shipping = 1;
  const tax = 0;
  const total = subtotal + shipping + tax;

  const onFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const onLineChange = (id, field, value) => {
    setLineItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: field === "qty" ? Number(value) : value } : i))
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
      },
    ]);
  };

  const removeLine = (id) => {
    setLineItems((prev) => prev.filter((i) => i.id !== id));
  };

  const orderLinesJSON = JSON.stringify(lineItems);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Cov Cath Colonel “#TAKEITBACK” T-Shirt Shop
        </h1>
        <p className="text-sm mt-1 opacity-80">
          $25 each • 2 for $45 • Auto-discount applied.
        </p>
      </header>

      <main className="mx-auto max-w-5xl px-4 grid lg:grid-cols-2 gap-8 pb-20">
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>

          {/* REMOVED encType to prevent upload errors */}
          <form action={FORMSPREE_ENDPOINT} method="POST" className="space-y-4">
            {/* hidden */}
            <input type="hidden" name="orderId" value={orderId} />
            <input type="hidden" name="total" value={total} />
            <input type="hidden" name="totalQty" value={totalQty} />
            <input type="hidden" name="orderLinesJSON" value={orderLinesJSON} />

            {/* buyer info */}
            <div className="grid grid-cols-2 gap-4">
              <label className="text-sm">
                Full Name
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={onFormChange}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
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
                />
              </label>
            </div>

            <label className="text-sm block">
              Shipping / Delivery Address
              <textarea
                required
                name="address"
                value={form.address}
                onChange={onFormChange}
                className="mt-1 w-full rounded-xl border px-3 py-2"
              />
            </label>

            <label className="text-sm block">
              Player name & jersey number (required)
              <input
                required
                name="playerInfo"
                value={form.playerInfo}
                onChange={onFormChange}
                className="mt-1 w-full rounded-xl border px-3 py-2"
                placeholder="Example: Athens McGillis #1"
              />
            </label>

            {/* designs */}
            <label className="text-sm block mb-2">Designs available (click to preview)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
              {DESIGNS.map((d) => (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setPreview({ open: true, image: d.image, title: d.name })}
                  className="rounded-xl border p-2 text-center bg-zinc-50 hover:border-zinc-700"
                >
                  <img src={d.image} className="rounded-lg mb-1 w-full" />
                  <p className="text-xs">{d.name}</p>
                </button>
              ))}
            </div>

            {/* items */}
            <p className="text-sm mt-4 mb-2 font-semibold">Shirts in this order</p>

            {lineItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-5 gap-3 mb-2 items-end border-b pb-2"
              >
                <label className="text-xs">
                  Design
                  <select
                    value={item.design}
                    onChange={(e) => onLineChange(item.id, "design", e.target.value)}
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
                    onChange={(e) => onLineChange(item.id, "color", e.target.value)}
                    className="mt-1 w-full rounded-xl border px-2 py-1"
                  >
                    {COLORS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>

                <label className="text-xs">
                  Size
                  <select
                    value={item.size}
                    onChange={(e) => onLineChange(item.id, "size", e.target.value)}
                    className="mt-1 w-full rounded-xl border px-2 py-1"
                  >
                    {SIZES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>

                <label className="text-xs">
                  Qty
                  <input
                    type="number"
                    min={0}
                    value={item.qty}
                    onChange={(e) => onLineChange(item.id, "qty", e.target.value)}
                    className="mt-1 w-full rounded-xl border px-2 py-1"
                  />
                </label>

                <div className="flex items-center">
                  {lineItems.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeLine(item.id)}
                      className="text-[10px] text-red-500"
                    >
                      Remove
                    </button>
                  ) : (
                    <span className="text-[10px] text-zinc-300">—</span>
                  )}
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

            <label className="text-sm block">
              Notes (optional)
              <textarea
                name="notes"
                value={form.notes}
                onChange={onFormChange}
                className="mt-1 w-full rounded-xl border px-3 py-2"
                placeholder="Delivery instructions, etc."
              />
            </label>

            {/* totals */}
            <div className="rounded-xl border bg-zinc-50 p-4 text-sm">
              <div className="flex justify-between">
                <span>Total shirts</span>
                <span>{totalQty}</span>
              </div>
              <div className="flex justify-between">
                <span>Unit price</span>
                <span>${unit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <span className="text-lg font-bold">${total.toFixed(2)}</span>
              </div>
              <p className="text-xs opacity-70 mt-1">
                Pricing auto-applies: 2 for $45, singles $25.
              </p>
            </div>

            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                name="agreed"
                checked={form.agreed}
                onChange={onFormChange}
                required
              />
              <span>I will pay on Venmo and include my Order ID in the note.</span>
            </label>

            <button className="w-full rounded-xl bg-zinc-900 text-white py-3 font-semibold">
              Submit Order
            </button>
          </form>
        </section>

        {/* RIGHT SIDE */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-2">2) Pay on Venmo</h2>
          <p className="text-sm mb-4">
            Pay <span className="font-semibold">{VENMO_HANDLE}</span> for the{" "}
            <span className="font-semibold">Total</span> shown.  
            Add Order ID: <span className="font-mono">{orderId}</span>
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border p-3">
              <img src={VENMO_QR_URL} className="rounded-xl w-full" />
              <a
                href={`https://venmo.com/${VENMO_HANDLE.replace("@", "")}`}
                target="_blank"
                className="mt-3 inline-block rounded-xl border px-4 py-2 text-sm"
              >
                Open Venmo
              </a>
            </div>

            <div className="text-sm space-y-3">
              <div className="rounded-xl bg-zinc-50 p-3">
                <p className="font-semibold">Why Venmo Business?</p>
                <ul className="list-disc ml-5 mt-1">
                  <li>Fast checkout</li>
                  <li>Keeps personal & business separate</li>
                </ul>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3">
                <p className="font-semibold">Support</p>
                <p>Email: mcgillisrj@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border p-4 text-xs">
            <p className="font-semibold mb-1">Refunds & Exchanges</p>
            <p>
              All custom prints are final sale. Double-check name, number, and size.
            </p>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-10 text-xs opacity-70">
        © {new Date().getFullYear()} Cov Cath Colonel Shirts • All rights reserved.
      </footer>

      {/* IMAGE PREVIEW MODAL */}
      {preview.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-4 max-w-lg w-full mx-4 relative">
            <button
              onClick={() => setPreview({ open: false })}
              className="absolute top-2 right-2 text-zinc-500"
            >
              ✕
            </button>
            <h3 className="text-sm font-semibold mb-3">{preview.title}</h3>
            <img src={preview.image} className="w-full rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}

