export default function EidCampaignSection() {
  return (
    <section className="mb-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-900 via-green-700 to-emerald-500 text-white shadow-2xl">
      <div className="relative px-6 py-10 sm:px-8 sm:py-12 md:px-12">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,_white,_transparent_30%)]" />
        </div>

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur">
              Eid Exclusive 2026
            </p>

            <h3 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              Premium Eid Collection Has Arrived
            </h3>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
              Elegant premium fabrics, festive fashion styles, selected discounts,
              and stylish new arrivals are now ready for Eid shopping. Make this
              season special with exclusive looks from your trusted collection.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                New Arrival
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                Eid Offer
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                Premium Fabric
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                Limited Stock
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:min-w-[240px]">
            <a
              href="#products"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-slate-100"
            >
              Shop Eid Collection
            </a>

            <a
              href="/checkout"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              Quick Checkout
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
