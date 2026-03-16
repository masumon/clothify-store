import Link from "next/link";

export default function FeaturedCollection() {
  const collections = [
    {
      title: "ঈদ এক্সক্লুসিভ পাঞ্জাবি",
      description: "Stylish premium panjabis for a festive Eid look. New arrivals, limited stock.",
      href: "/?category=Panjabi",
      badge: "🌙 Eid Special",
    },
    {
      title: "Premium Polo & Shirts",
      description: "Smart casual wear with premium fabric — perfect for Eid visits.",
      href: "/?category=Polo Shirt",
      badge: "⭐ Best Seller",
    },
    {
      title: "Trending Fashion Picks",
      description: "Handpicked stylish outfits for customers who want something special this Eid.",
      href: "/#products",
      badge: "🔥 Trending",
    },
  ];

  return (
    <section className="mb-10">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          🌙 ঈদ Featured Collection
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
          Discover premium Eid fashion — curated for the best festival looks.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {collections.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {item.badge}
            </div>

            <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {item.description}
            </p>

            <Link
              href={item.href}
              className="mt-5 inline-flex rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View Collection
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
