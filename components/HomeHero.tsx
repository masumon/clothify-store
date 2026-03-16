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
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur">
            🌙 ঈদ কালেকশন ২০২৬
          </p>

          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
            {storeName}
          </h2>

          <p className="mt-2 text-xl font-bold text-yellow-300">
            {slogan}
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-100 sm:text-base">
            সেরা মানের পোশাক, ঘরে বসে সহজ অর্ডার, দ্রুত ডেলিভারি —
            আপনার বিশ্বস্ত ফ্যাশন স্টোর। 🛍️
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-black transition hover:bg-yellow-300"
            >
              🛍️ কেনাকাটা করুন
            </a>

            <a
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/60 bg-white/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur transition hover:bg-white/25"
            >
              ✅ এখনই অর্ডার করুন
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
