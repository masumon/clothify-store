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
      className="inline-block rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white"
    >
      Order via WhatsApp
    </a>
  );
}
