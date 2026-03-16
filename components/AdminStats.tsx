type Props = {
  totalProducts: number;
  totalOrders: number;
  totalPending: number;
};

export default function AdminStats({
  totalProducts,
  totalOrders,
  totalPending,
}: Props) {
  const cards = [
    { label: "Total Products", value: totalProducts, icon: "👕" },
    { label: "Total Orders", value: totalOrders, icon: "📦" },
    { label: "Pending Orders", value: totalPending, icon: "⏳" },
  ];

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-[0_16px_28px_-24px_rgba(0,0,0,0.95)]"
        >
          <p className="text-sm font-medium text-slate-300">{card.label}</p>
          <h3 className="mt-2 text-3xl font-bold text-white">{card.value}</h3>
          <p className="mt-2 text-lg">{card.icon}</p>
        </div>
      ))}
    </div>
  );
}
