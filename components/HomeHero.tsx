type Props = {
  storeName?: string;
  slogan?: string;
};

export default function HomeHero({
  storeName = "Clothify",
  slogan = "Find Your Fit",
}: Props) {
  return (
    <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-black via-slate-900 to-slate-700 px-6 py-12 text-white shadow-lg">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
          Premium Fashion Store
        </p>

        <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {storeName}
        </h2>

        <p className="mt-3 text-lg text-slate-200 sm:text-xl">
          {slogan}
        </p>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Discover modern fashion, premium fabric quality, elegant daily wear,
          and a seamless shopping experience designed for your customers.
        </p>
      </div>
    </section>
  );
}
