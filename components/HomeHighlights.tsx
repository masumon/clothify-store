const items = [
  {
    icon: "🧵",
    title: "Premium Quality",
    description: "Carefully selected fashion products with stylish finishing.",
  },
  {
    icon: "🔐",
    title: "Simple bKash Checkout",
    description: "Easy and trusted payment experience for every customer.",
  },
  {
    icon: "⚡",
    title: "Fast Order Handling",
    description: "Manage customer orders quickly from your admin dashboard.",
  },
];

export default function HomeHighlights() {
  return (
    <section className="mb-8 grid gap-4 sm:mb-10 md:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
        >
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg">
            {item.icon}
          </div>
          <h3 className="text-base font-bold text-slate-900 sm:text-lg">
            {item.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {item.description}
          </p>
        </div>
      ))}
    </section>
  );
}
