type Props = {
  storeName?: string;
  slogan?: string;
};

export default function HomeHero({
  storeName = "Clothify",
  slogan = "Find Your Fit",
}: Props) {
  return (
    <section className="relative mb-8 overflow-hidden rounded-[30px] shadow-2xl">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/store-banner.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />

      <div className="relative px-5 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur">
            Premium Fashion Store
          </p>

          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
            {storeName}
          </h2>

          <p className="mt-3 text-lg font-medium text-slate-100 sm:text-xl">
            {slogan}
          </p>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
            Stylish clothing, premium fabrics, trusted shopping experience, and
            a professional online presentation for your customers.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#products"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-slate-200"
            >
              Shop Now
            </a>

            <a
              href="/checkout"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              Quick Checkout
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
