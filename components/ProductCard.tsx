import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    image_url: string;
    stock_quantity?: number;
    is_featured?: boolean;
    campaign_badge?: string | null;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_12px_32px_-24px_rgba(2,6,23,0.6)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgba(2,6,23,0.45)]">
      <div className="relative overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <Image
            src={product.image_url}
            alt={product.name}
            width={400}
            height={288}
            className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.is_featured ? (
            <div className="rounded-full bg-slate-900/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
              Featured
            </div>
          ) : null}
          {product.campaign_badge ? (
            <div className="rounded-full bg-rose-600/90 px-3 py-1 text-[11px] font-semibold text-white">
              {product.campaign_badge}
            </div>
          ) : null}
        </div>

        <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur">
          {product.category}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="line-clamp-2 min-h-[56px] text-lg font-bold leading-7 text-slate-900">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xl font-extrabold text-teal-700 sm:text-2xl">
            ৳{product.price}
          </p>
        </div>

        <p className={`mt-2 text-xs font-semibold ${(product.stock_quantity ?? 20) <= 5 ? "text-amber-700" : "text-slate-500"}`}>
          {(product.stock_quantity ?? 20) <= 0
            ? "Out of stock"
            : (product.stock_quantity ?? 20) <= 5
            ? `Low stock: ${product.stock_quantity ?? 20} left`
            : `In stock: ${product.stock_quantity ?? 20}`}
        </p>

        <div className="mt-3 flex gap-2">
          <Link
            href={`/product/${product.id}`}
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-2.5 text-center text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
          >
            👁️ বিস্তারিত
          </Link>
          <Link
            href={`/checkout`}
            className="flex-1 rounded-full bg-teal-700 px-3 py-2.5 text-center text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-teal-800"
          >
            ✅ অর্ডার
          </Link>
        </div>
      </div>
    </div>
  );
}
