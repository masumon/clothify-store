type Props = {
  storeName?: string;
  slogan?: string;
};

export default function HomeHero({
  storeName = "Clothify",
  slogan = "Find Your Fit",
}: Props) {
  return (
    <section className="relative mb-8 overflow-hidden rounded-[30px] border border-white/20 shadow-2xl shadow-slate-900/20">
      <div className="absolute inset-0 bg-[url('/store-banner.jpg')] bg-cover bg-center" />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-teal-950/45" />
      <div className="absolute -left-16 -top-20 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute -bottom-20 right-8 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="relative px-5 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur">
            🌙 ঈদ কালেকশন ২০২৬
          </p>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            {storeName}
          </h2>

          <p className="mt-2 text-xl font-bold text-teal-200">
            {slogan}
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-100 sm:text-base">
            সেরা মানের পোশাক, ঘরে বসে সহজ অর্ডার, দ্রুত ডেলিভারি —
            আপনার বিশ্বস্ত ফ্যাশন স্টোর। 🛍️
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-500 px-7 py-3.5 text-base font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-teal-400"
            >
              🛍️ কেনাকাটা করুন
            </a>

            <a
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/60 bg-white/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white/20"
            >
              ✅ এখনই অর্ডার করুন
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
