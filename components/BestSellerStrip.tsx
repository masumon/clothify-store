export default function BestSellerStrip() {
  return (
    <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-pink-600 via-rose-500 to-orange-400 px-5 py-6 text-white shadow-lg sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
            Best Seller Focus
          </p>
          <h3 className="mt-2 text-2xl font-bold sm:text-3xl">
            Highlight Top Categories
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
            Push your best performing categories and make it easier for customers
            to discover premium quality fashion collections.
          </p>
        </div>

        <a
          href="#products"
          className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-slate-100"
        >
          Browse Best Sellers
        </a>
      </div>
    </section>
  );
}
