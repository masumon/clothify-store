type Props = {
  storeName?: string;
  slogan?: string;
};

export default function HomeHero({
  storeName = "Clothify",
  slogan = "Find Your Fit",
}: Props) {
  return (
    <section className="relative mb-8 overflow-hidden rounded-[30px] border border-slate-700/20 shadow-2xl shadow-slate-900/30">
      <div className="absolute inset-0 bg-[url('/store-banner.jpg')] bg-cover bg-center" />

      <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/70 to-[#1e293b]/60" />
      <div className="absolute -left-16 -top-20 h-52 w-52 rounded-full bg-amber-300/20 blur-3xl" />
      <div className="absolute -bottom-20 right-8 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl" />

      <div className="relative px-5 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur">
            Eid Special Collection
          </p>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            {storeName}
          </h2>

          <p className="mt-2 text-xl font-bold text-amber-200">
            {slogan}
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-100 sm:text-base">
            Premium Panjabi, smart casual shirts, and perfect festival looks. Shop confidently
            with fast checkout, WhatsApp support, and intelligent SUMONIX AI assistance.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 text-base font-bold text-slate-900 transition duration-300 hover:-translate-y-0.5 hover:bg-amber-400"
            >
              Shop Now
            </a>

            <a
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/60 bg-white/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white/20"
            >
              Order For Eid
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
