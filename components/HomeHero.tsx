type Props = {
  storeName?: string;
  slogan?: string;
};

export default function HomeHero({
  storeName = "Clothify",
  slogan = "Find Your Fit",
}: Props) {
  return (
    <section className="relative mb-8 overflow-hidden rounded-[28px] bg-gradient-to-br from-black via-slate-900 to-slate-700 px-6 py-12 text-white shadow-xl sm:px-8 sm:py-16">
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,_white,_transparent_35%)]" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200">
          Premium Fashion Store
        </p>

        <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {storeName}
        </h2>

        <p className="mt-4 text-lg text-slate-200 sm:text-xl">{slogan}</p>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Elegant styles, premium fabric feel, and a smooth shopping experience
          built for modern customers.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#products"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-slate-200"
          >
            Shop Now
          </a>

          <a
            href="/admin"
            className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Admin Panel
          </a>
        </div>
      </div>
    </section>
  );
}
