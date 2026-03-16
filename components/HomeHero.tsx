type Props = {
  storeName?: string;
  slogan?: string;
};

export default function HomeHero({
  storeName = "Clothify",
  slogan = "Find Your Fit",
}: Props) {
  return (
    <section
      className="mb-8 rounded-3xl bg-cover bg-center p-10 text-white"
      style={{
        backgroundImage: "url('/store-banner.jpg')",
      }}
    >
      <div className="bg-black/50 rounded-2xl p-6 text-center">

        <h2 className="text-3xl font-bold sm:text-4xl">
          {storeName}
        </h2>

        <p className="mt-3 text-lg">
          {slogan}
        </p>

        <a
          href="#products"
          className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
        >
          Shop Now
        </a>

      </div>
    </section>
  );
}
