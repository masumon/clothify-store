const items = [
  {
    title: "Premium Quality",
    description: "Carefully selected fashion products with stylish finishing.",
  },
  {
    title: "Manual bKash Checkout",
    description: "Simple and trusted payment flow for your customers.",
  },
  {
    title: "Fast Order Management",
    description: "Track, update, and manage orders from the admin panel.",
  },
];

export default function HomeHighlights() {
  return (
    <section className="mb-10 grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {item.description}
          </p>
        </div>
      ))}
    </section>
  );
}
