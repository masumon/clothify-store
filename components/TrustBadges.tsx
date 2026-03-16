const badges = [
  {
    icon: "🌙",
    title: "ঈদ স্পেশাল অফার",
    description: "Exclusive Eid discounts and premium new arrivals — limited time only.",
  },
  {
    icon: "💚",
    title: "Trusted Quality",
    description: "Carefully selected fashion products with premium finishing and fine fabric.",
  },
  {
    icon: "💳",
    title: "Secure bKash Payment",
    description: "Easy manual checkout flow with trusted bKash payment confirmation.",
  },
  {
    icon: "⚡",
    title: "Fast WhatsApp Support",
    description: "Order quickly and get instant support directly on WhatsApp.",
  },
];

export default function TrustBadges() {
  return (
    <section className="mb-10">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Why Shop at Clothify This Eid?
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
          Premium quality, secure payment, and fast support — everything you
          need for a perfect Eid shopping experience.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {badges.map((badge) => (
          <div
            key={badge.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
              {badge.icon}
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
