type Props = {
  phone: string;
  productName: string;
  price: number;
};

function normalizeBangladeshWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (!digits) return "8801811314262";

  if (digits.startsWith("880")) return digits;

  if (digits.startsWith("0")) return `88${digits}`;

  return digits;
}

export default function WhatsAppOrderButton({
  phone,
  productName,
  price,
}: Props) {
  const cleanedPhone = normalizeBangladeshWhatsAppNumber(phone);

  const message =
    `Hello, I want to order this product:\n\n` +
    `Product: ${productName}\n` +
    `Price: ৳${price}\n\n` +
    `Please confirm availability.`;

  const url = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Open WhatsApp chat to order this product"
      className="group inline-flex w-full items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-3 text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto sm:min-w-[280px]"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-xl leading-none">
          💬
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-extrabold tracking-wide">WhatsApp Chat</span>
          <span className="block truncate text-xs text-emerald-100/95">Fast order confirmation</span>
        </span>
      </span>
      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold transition group-hover:bg-white/30">
        Open
      </span>
    </a>
  );
}
