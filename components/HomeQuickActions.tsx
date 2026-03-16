import Link from "next/link";

export default function HomeQuickActions() {
  const actions = [
    { href: "/", label: "Shop" },
    { href: "/cart", label: "Cart" },
    { href: "/checkout", label: "Checkout" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          {action.label}
        </Link>
      ))}
    </section>
  );
}
