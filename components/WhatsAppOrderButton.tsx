type Props = {
  phone: string;
  productName: string;
  price: number;
};

export default function WhatsAppOrderButton({
  phone,
  productName,
  price,
}: Props) {
  const cleanedPhone = phone.replace(/\D/g, "") || "8801805996960";
  const message = `Hello, I want to order this product:%0A%0AProduct: ${productName}%0APrice: ৳${price}%0A%0APlease confirm availability.`;
  const url = `https://wa.me/${cleanedPhone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      className="inline-block rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white"
    >
      Order via WhatsApp
    </a>
  );
}
