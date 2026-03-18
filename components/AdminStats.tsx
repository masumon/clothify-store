type Props = {
  totalProducts: number;
  totalOrders: number;
  totalPending: number;
  totalRevenue: number;
};

export default function AdminStats({
  totalProducts,
  totalOrders,
  totalPending,
  totalRevenue,
}: Props) {
  const cards = [
    {
      label: "Monthly Revenue",
      value: `৳${Math.round(totalRevenue).toLocaleString("en-BD")}`,
      iconClass: "fa-solid fa-coins",
      iconTone: "bg-amber-100 text-amber-700",
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString("en-BD"),
      iconClass: "fa-solid fa-box-open",
      iconTone: "bg-sky-100 text-sky-700",
    },
    {
      label: "Pending Delivery",
      value: totalPending.toLocaleString("en-BD"),
      iconClass: "fa-solid fa-truck-fast",
      iconTone: "bg-rose-100 text-rose-700",
    },
    {
      label: "Products Catalog",
      value: totalProducts.toLocaleString("en-BD"),
      iconClass: "fa-solid fa-shirt",
      iconTone: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_34px_-30px_rgba(2,6,23,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-30px_rgba(2,6,23,0.55)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">{card.label}</p>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-900">{card.value}</h3>
            </div>
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.iconTone}`}>
              <i className={card.iconClass} aria-hidden="true" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
