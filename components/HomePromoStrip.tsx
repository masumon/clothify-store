export default function HomePromoStrip() {
  return (
    <section className="mb-8 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            New Season Fashion Collection
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Premium style, trusted quality, and a better shopping experience.
          </p>
        </div>

        <a
          href="#products"
          className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Explore Collection
        </a>
      </div>
    </section>
  );
}
