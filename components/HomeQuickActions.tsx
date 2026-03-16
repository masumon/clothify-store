import Link from "next/link";

type Props = {
  whatsapp?: string;
};

export default function HomeQuickActions({ whatsapp }: Props) {
  const waLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "").replace(/^0/, "88")}`
    : "https://wa.me/8801811314262";

  const actions = [
    {
      href: "/",
      label: "🏠 হোম",
      className: "bg-blue-50 border-blue-200 text-blue-900",
    },
    {
      href: "/cart",
      label: "🛒 কার্ট",
      className: "bg-orange-50 border-orange-200 text-orange-900",
    },
    {
      href: "/checkout",
      label: "✅ অর্ডার",
      className: "bg-green-50 border-green-200 text-green-900",
    },
    {
      href: waLink,
      label: "💬 সাপোর্ট",
      className: "bg-emerald-50 border-emerald-200 text-emerald-900",
      external: true,
    },
  ];

  return (
    <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action) =>
        action.external ? (
          <a
            key={action.href}
            href={action.href}
            target="_blank"
            rel="noreferrer"
            className={`rounded-2xl border px-2 py-3 text-center text-sm font-bold shadow-[0_10px_20px_-16px_rgba(2,6,23,0.45)] transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:py-4 ${action.className}`}
          >
            {action.label}
          </a>
        ) : (
          <Link
            key={action.href}
            href={action.href}
            className={`rounded-2xl border px-2 py-3 text-center text-sm font-bold shadow-[0_10px_20px_-16px_rgba(2,6,23,0.45)] transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:py-4 ${action.className}`}
          >
            {action.label}
          </Link>
        )
      )}
    </section>
  );
}
