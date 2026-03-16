const items = [
  {
    title: "Premium Quality",
    description: "Carefully selected fashion products with stylish finishing.",
  },
  {
    title: "Simple bKash Checkout",
    description: "Easy and trusted payment experience for every customer.",
  },
  {
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
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
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
