import React, { useMemo, useState } from "react";

// 🔁 UPDATE THESE 3 FOR YOUR SETUP
const VENMO_HANDLE = "@YourBiz"; // <- your Venmo business handle
const VENMO_QR_URL = "https://placehold.co/400x400?text=Venmo+QR"; // <- your QR image
const FORMSPREE_ENDPOINT = "https://formspree.io/f/your-id"; // <- your real Formspree URL

// 👕 your 5 designs from GitHub /public
const DESIGNS = [
  { id: "colonelA", name: "Colonel A", image: "/ColonelA.png" },
  { id: "colonelBblack", name: "Colonel B – Black", image: "/ColonelB-Black.png" },
  { id: "colonelBblue", name: "Colonel B – Blue", image: "/ColonelB-Blue.png" },
  { id: "colonelCblack", name: "Colonel C – Black", image: "/ColonelC-Black.png" },
  { id: "colonelCblue", name: "Colonel C – Blue", image: "/ColonelC-Blue.png" },
];

// you can still keep generic shirt colors if you want
const COLORS = [
  { id: "black", name: "Black" },
  { id: "white", name: "White" },
  { id: "heather", name: "Heather Gray" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

// pricing: $25 or 2 for $45
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
    design: DESIGNS[0].id, // default = first design
    color: COLORS[0].id,
    size: "M",
    qty: 1,
    notes: "",
    agreed: false,
  });

  // unique-ish order id
  const orderId = useMemo(() => {
    const t = new Date();
    return `ORD-${t.getFullYear()}${String(t.getMonth() + 1).padStart(
      2,
      "0"
    )}${String(t.getDate()).padStart(2, "0")}-${t.getHours()}${t.getMinutes()}${t.getSeconds()}`;
  }, []);

  const subtotal = useMemo(
    () => calcSubtotal(Number(form.qty) || 1),
    [form.qty]
  );
  const unit = useMemo(
    () => calcUnitPrice(Number(form.qty) || 1),
    [form.qty]
  );
  const shipping = 5;
  const taxRate = 0; // set your tax rate if needed
  const tax = useMemo(
    () => Number((subtotal * taxRate).toFixed(2)),
    [subtotal, taxRate]
  );
  const total = useMemo(
    () => Number((subtotal + shipping + tax).toFixed(2)),
    [subtotal, shipping, tax]
  );

  const onChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // when user clicks a design card
  const onSelectDesign = (designId: string) => {
    setForm((prev) => ({
      ...prev,
      design: designId,
      // optional: auto-pick color based on file name
      color: designId.toLowerCase().includes("black")
        ? "black"
        : designId.toLowerCase().includes("blue")
        ? "white" // or "heather" — up to you
        : prev.color,
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
            <input type="hidden" name="selectedDesign" value={form.design} />

            {/* name + email */}
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

            {/* shipping address */}
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
                    form.design === d.id
                      ? "border-zinc-900 shadow-sm"
                      : "border-zinc-300"
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
            <p className="text-xs text-zinc-500">
              Selected:{" "}
              {
                DESIGNS.find((d) => d.id === form.design)?.name
              }
            </p>
{/* EXTRA SHIRTS (optional) */}
<p className="text-sm mt-4 mb-2 font-semibold">Add another shirt (optional)</p>
<div className="grid grid-cols-3 gap-4 mb-2">
  <label className="text-xs">
    Shirt 2 Design
    <select name="shirt2_design" className="mt-1 w-full rounded-xl border px-2 py-1">
      <option value="">-- none --</option>
      {DESIGNS.map((d) => (
        <option key={d.id} value={d.id}>{d.name}</option>
      ))}
    </select>
  </label>
  <label className="text-xs">
    Shirt 2 Size
    <select name="shirt2_size" className="mt-1 w-full rounded-xl border px-2 py-1">
      <option value="">--</option>
      {SIZES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  </label>
  <label className="text-xs">
    Shirt 2 Notes
    <input name="shirt2_notes" className="mt-1 w-full rounded-xl border px-2 py-1" placeholder="blue / name on back?" />
  </label>
</div>

<div className="grid grid-cols-3 gap-4 mb-2">
  <label className="text-xs">
    Shirt 3 Design
    <select name="shirt3_design" className="mt-1 w-full rounded-xl border px-2 py-1">
      <option value="">-- none --</option>
      {DESIGNS.map((d) => (
        <option key={d.id} value={d.id}>{d.name}</option>
      ))}
    </select>
  </label>
  <label className="text-xs">
    Shirt 3 Size
    <select name="shirt3_size" className="mt-1 w-full rounded-xl border px-2 py-1">
      <option value="">--</option>
      {SIZES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  </label>
  <label className="text-xs">
    Shirt 3 Notes
    <input name="shirt3_notes" className="mt-1 w-full rounded-xl border px-2 py-1" placeholder="gift / pick up" />
  </label>
</div>

            {/* color + size + qty */}
            <div className="grid grid-cols-3 gap-4">
              <label className="text-sm">
                Color
                <select
                  name="color"
                  value={form.color}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                >
                  {COLORS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                Size
                <select
                  name="size"
                  value={form.size}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                >
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                Quantity
                <input
                  min={1}
                  type="number"
                  name="qty"
                  value={form.qty}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
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
              <span>
                I will pay on Venmo and include my Order ID in the note.
              </span>
            </label>

            <button
              className="w-full rounded-xl bg-zinc-900 text-white font-semibold py-3 hover:opacity-90"
              type="submit"
            >
              1) Submit Order
            </button>
          </form>
        </section>

        {/* RIGHT: Venmo instructions */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-2">2) Pay on Venmo</h2>
          <p className="text-sm mb-4">
            Open Venmo and pay{" "}
            <span className="font-semibold">{VENMO_HANDLE}</span> for the{" "}
            <span className="font-semibold">Total</span> shown. In the note,
            paste your Order ID{" "}
            <span className="font-mono">{orderId}</span>.
          </p>

          <div className="grid md:grid-cols-2 gap-4 items-start">
            <div className="rounded-2xl border p-3 flex flex-col items-center">
              <img
                src={VENMO_QR_URL}
                alt="Venmo QR"
                className="rounded-xl w-full"
              />
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
                  <li>Keeps personal & business separate</li>
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
            <p className="font-semibold mb-1">Refunds & Exchanges</p>
            <p>
              Exchanges accepted for unworn tees within 14 days. Buyer pays
              return shipping unless we messed up. Custom prints are final sale.
            </p>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-10 text-xs opacity-70">
        <p>
          © {new Date().getFullYear()} Rich’s Pop-Up Tee Shop • All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
