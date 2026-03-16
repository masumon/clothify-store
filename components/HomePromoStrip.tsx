export default function HomePromoStrip() {
  return (
    <section className="mb-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white px-4 py-4 shadow-sm">
      <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            🌙 ঈদ মোবারক — Exclusive Sale On Now!
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Special Eid discounts, premium fashion, and fast bKash payment.{" "}
            <span className="font-semibold text-emerald-700">Limited stock available!</span>
          </p>
        </div>

        <a
          href="#products"
          className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          🛍️ Shop Eid Deals
        </a>
      </div>
    </section>
  );
}
