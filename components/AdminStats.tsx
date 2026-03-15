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
    { label: "Total Products", value: totalProducts },
    { label: "Total Orders", value: totalOrders },
    { label: "Pending Orders", value: totalPending },
  ];

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <p className="text-sm text-slate-500">{card.label}</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{card.value}</h3>
        </div>
      ))}
    </div>
  );
}
