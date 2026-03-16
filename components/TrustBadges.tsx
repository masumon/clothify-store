const badges = [
  {
    title: "Trusted Quality",
    description: "Carefully selected fashion products with better finishing.",
  },
  {
    title: "Secure bKash Payment",
    description: "Easy manual checkout flow with trusted payment confirmation.",
  },
  {
    title: "Fast Support",
    description: "Customers can order quickly and contact directly on WhatsApp.",
  },
  {
    title: "Admin Managed Store",
    description: "Products, orders, and settings are always under your control.",
  },
];

export default function TrustBadges() {
  return (
    <section className="mb-10">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Why Customers Trust Clothify
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
          A polished shopping experience helps customers feel confident before
          they place an order.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {badges.map((badge) => (
          <div
            key={badge.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-black font-bold text-white">
              ✓
            </div>

            <h4 className="text-lg font-bold text-slate-900">{badge.title}</h4>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {badge.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
