export default function EidCampaignSection() {
  return (
    <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-green-600 to-teal-500 px-6 py-8 text-white shadow-xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
            Eid Special Campaign
          </p>

          <h3 className="mt-2 text-2xl font-bold sm:text-3xl md:text-4xl">
            Premium Eid Collection is Live
          </h3>

          <p className="mt-3 text-sm leading-7 text-white/90 sm:text-base">
            New premium fabrics, stylish Eid fashion, selected discount offers,
            and limited-time special collection are now available for your customers.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
              New Arrival
            </span>
            <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
              Eid Offer
            </span>
            <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
              Premium Fabric
            </span>
          </div>
        </div>

        <a
          href="#products"
          className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-slate-100"
        >
          Shop Eid Collection
        </a>
      </div>
    </section>
  )
}
