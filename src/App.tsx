import React, { useMemo, useState } from "react";

// 🔧 UPDATE THESE
const VENMO_HANDLE = "@allheartbasketballcoach"; // your Venmo business handle
const VENMO_QR_URL = "/venmoQR.jpeg"; // your QR image URL
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xwpwagvw"; // your real Formspree URL

// your 5 designs
const DESIGNS = [
  { id: "colonelA", name: "Colonel A", image: "/ColonelA.png" },
  { id: "colonelBblack", name: "Colonel B – Black", image: "/ColonelB-Black.png" },
  { id: "colonelBblue", name: "Colonel B – Blue", image: "/ColonelB-Blue.png" },
  { id: "colonelCblack", name: "Colonel C – Black", image: "/ColonelC-Black.png" },
  { id: "colonelCblue", name: "Colonel C – Blue", image: "/ColonelC-Blue.png" },
];

const COLORS = [
  { id: "black", name: "Black" },
  { id: "white", name: "White" },
  { id: "heather", name: "Heather Gray" },
  { id: "heather", name: "Royal Blue" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

// pricing helpers: $25 or 2 for $45
function calcUnitPrice(qty: number) {
  if (qty >= 2) {
    const pairs = Math.floor(qty / 2);
    const remainder = qty % 2;
    const total = pairs * 45 + remainder * 25;
    return total / qty;
  }
  return 25;
}

function calcSubtotal(qty: number) {
  const pairs = Math.floor(qty / 2);
  const remainder = qty % 2;
  return pairs * 45 + remainder * 25;
}

export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    // just for the image selection
    design: DESIGNS[0].id,
    color: COLORS[0].id,
    size: "M",

    // 5 line items
    colonelA_size: "M",
    colonelA_qty: 0,
    colonelA_notes: "",

    colonelBblack_size: "M",
    colonelBblack_qty: 0,
    colonelBblack_notes: "",

    colonelBblue_size: "M",
    colonelBblue_qty: 0,
    colonelBblue_notes: "",

    colonelCblack_size: "M",
    colonelCblack_qty: 0,
    colonelCblack_notes: "",

    colonelCblue_size: "M",
    colonelCblue_qty: 0,
    colonelCblue_notes: "",

    notes: "",
    agreed: false,
  });

  // order id
  const orderId = useMemo(() => {
    const t = new Date();
    return `ORD-${t.getFullYear()}${String(t.getMonth() + 1).padStart(
      2,
      "0"
    )}${String(t.getDate()).padStart(2, "0")}-${t.getHours()}${t.getMinutes()}${t.getSeconds()}`;
  }, []);

  // total shirts = sum of the 5 rows
  const totalQty =
    (Number(form.colonelA_qty) || 0) +
    (Number(form.colonelBblack_qty) || 0) +
    (Number(form.colonelBblue_qty) || 0) +
    (Number(form.colonelCblack_qty) || 0) +
    (Number(form.colonelCblue_qty) || 0);

  const safeTotalQty = totalQty > 0 ? totalQty : 1;

  const subtotal = useMemo(() => calcSubtotal(safeTotalQty), [safeTotalQty]);
  const unit = useMemo(() => calcUnitPrice(safeTotalQty), [safeTotalQty]);
  const shipping = 5;
  const taxRate = 0;
  const tax = useMemo(() => Number((subtotal * taxRate).toFixed(2)), [subtotal, taxRate]);
  const total = useMemo(
    () => Number((subtotal + shipping + tax).toFixed(2)),
    [subtotal, shipping, tax]
  );

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSelectDesign = (designId: string) => {
    setForm((prev) => ({
      ...prev,
      design: designId,
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Cov Cath Colonel “#TAKEITBACK” T-Shirt Shop
        </h1>
        <p className="text-sm mt-1 opacity-80">
          Order your 2026 Colonel gear here. $25 each or 2 for $45. Choose your design below.
        </p>
      </header>

      <main className="mx-auto max-w-5xl px-4 grid lg:grid-cols-2 gap-8 pb-20">
        {/* LEFT: order form */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>

          <form action={FORMSPREE_ENDPOINT} method="POST" className="space-y-4">
            {/* hidden fields */}
            <input type="hidden" name="orderId" value={orderId} />
            <input type="hidden" name="total" value={total} />
            <input type="hidden" name="totalQty" value={totalQty} />
            <input type="hidden" name="selectedDesign" value={form.design} />

            {/* contact */}
            <div className="grid grid-cols-2 gap-4">
              <label className="text-sm">
                Full Name
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={onChange}
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
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            {/* address */}
            <label className="text-sm block">
              Shipping Address
              <textarea
                required
                name="address"
                value={form.address}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border px-3 py-2"
                placeholder="Street, City, State, ZIP"
              />
            </label>

            {/* design gallery */}
            <label className="text-sm block mb-2">Choose a Design</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
              {DESIGNS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onSelectDesign(d.id)}
                  className={`cursor-pointer rounded-xl border-2 p-2 text-center hover:border-zinc-700 transition ${
                    form.design === d.id ? "border-zinc-900 shadow-sm" : "border-zinc-300"
                  }`}
                >
                  <img
                    src={d.image}
                    alt={d.name}
                    className="rounded-lg mb-1 w-full object-contain"
                  />
                  <p className="text-xs font-medium">{d.name}</p>
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mb-2">
              Selected: {DESIGNS.find((d) => d.id === form.design)?.name}
            </p>

            {/* ORDER BY DESIGN – 5 LINE ITEMS */}
            <p className="text-sm mt-4 mb-2 font-semibold">Order by design</p>

            {/* 1) Colonel A */}
            <div className="grid grid-cols-4 gap-4 mb-2 items-end">
              <div className="text-xs">
                <p className="font-semibold">Colonel A</p>
                <p className="text-[10px] text-zinc-500">white/base</p>
              </div>
              <label className="text-xs">
                Size
                <select
                  name="colonelA_size"
                  value={form.colonelA_size}
                  onChange={onChange}
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
                  name="colonelA_qty"
                  value={form.colonelA_qty}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border px-2 py-1"
                />
              </label>
              <label className="text-xs">
                Notes
                <input
                  name="colonelA_notes"
                  value={form.colonelA_notes}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border px-2 py-1"
                  placeholder="name/#, pickup"
                />
              </label>
            </div>

            {/* 2) Colonel B – Black */}
            <div className="grid grid-cols-4 gap-4 mb-2 items-end">
              <div className="text-xs">
                <p className="font-semibold">Colonel B – Black</p>
              </div>
              <label className="text-xs">
                Size
                <select
                  name="colonelBblack_size"
                  value={form.colonelBblack_size}
                  onChange={onChange}
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
                  name="colonelBblack_qty"
                  value={form.colonelBblack_qty}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border px-2 py-1"
                />
              </label>
              <label className="text-xs">
                Notes
                <input
                  name="colonelBblack_notes"
                  value={form.colonelBblack_notes}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border px-2 py-1"
                />
              </label>
            </div>

            {/* 3) Colonel B – Blue */}
            <div className="grid grid-cols-4 gap-4 mb-2 items-end">
              <div className="text-xs">
                <p className="font-semibold">Colonel B – Blue</p>
              </div>
              <label className="text-xs">
                Size
                <select
                  name="colonelBblue_size"
                  value={form.colonelBblue_size}
                  onChange={onChange}
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
                  name="colonelBblue_qty"
                  value={form.colonelBblue_qty}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border px-2 py-1"
                />
              </label>
              <label className="text-xs">
                Notes
                <input
                  name="colonelBblue_notes"
                  value={form.colonelBblue_notes}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border px-2 py-1"
                />
              </label>
            </div>

            {/* 4) Colonel C – Black */}
            <div className="grid grid-cols-4 gap-4 mb-2 items-end">
              <div className="text-xs">
                <p className="font-semibold">Colonel C – Black</p>
              </div>
              <label className="text-xs">
                Size
                <select
                  name="colonelCblack_size"
                  value={form.colonelCblack_size}
                  onChange={onChange}
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
                  name="colonelCblack_qty"
                  value={form.colonelCblack_qty}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border px-2 py-1"
                />
              </label>
              <label className="text-xs">
                Notes
                <input
                  name="colonelCblack_notes"
                  value={form.colonelCblack_notes}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border px-2 py-1"
                />
              </label>
            </div>

            {/* 5) Colonel C – Blue */}
            <div className="grid grid-cols-4 gap-4 mb-4 items-end">
              <div className="text-xs">
                <p className="font-semibold">Colonel C – Blue</p>
              </div>
              <label className="text-xs">
                Size
                <select
                  name="colonelCblue_size"
                  value={form.colonelCblue_size}
                  onChange={onChange}
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
                  name="colonelCblue_qty"
                  value={form.colonelCblue_qty}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border px-2 py-1"
                />
              </label>
              <label className="text-xs">
                Notes
                <input
                  name="colonelCblue_notes"
                  value={form.colonelCblue_notes}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border px-2 py-1"
                />
              </label>
            </div>

            {/* notes */}
            <label className="text-sm block">
              Notes (optional)
              <textarea
                name="notes"
                value={form.notes}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border px-3 py-2"
                placeholder="Anything special?"
              />
            </label>

            {/* totals */}
            <div className="rounded-xl border bg-zinc-50 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span>Total shirts</span>
                <span className="font-semibold">{totalQty || 0}</span>
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
                Discount auto-applies: $25 each or 2 for $45.
              </p>
            </div>

            {/* agree + submit */}
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                name="agreed"
                checked={form.agreed}
                onChange={onChange}
                required
              />
              <span>I will pay on Venmo and include my Order ID in the note.</span>
            </label>

            <button
              className="w-full rounded-xl bg-zinc-900 text-white font-semibold py-3 hover:opacity-90"
              type="submit"
            >
              1) Submit Order
            </button>
          </form>
        </section>

        {/* RIGHT: venmo instructions */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-2">2) Pay on Venmo</h2>
          <p className="text-sm mb-4">
            Open Venmo and pay{" "}
            <span className="font-semibold">{VENMO_HANDLE}</span> for the{" "}
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
                <p>Email: you@example.com</p>
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
