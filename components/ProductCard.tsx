import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    image_url: string;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
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

        <div className="absolute left-3 top-3 rounded-full bg-black/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          Featured
        </div>

        <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">
          {product.category}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="line-clamp-2 min-h-[56px] text-lg font-bold leading-7 text-slate-900">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xl font-extrabold text-green-700 sm:text-2xl">
            ৳{product.price}
          </p>
        </div>

        <div className="mt-3 flex gap-2">
          <Link
            href={`/product/${product.id}`}
            className="flex-1 rounded-full border-2 border-slate-200 bg-slate-50 px-3 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            👁️ বিস্তারিত
          </Link>
          <Link
            href={`/checkout`}
            className="flex-1 rounded-full bg-green-600 px-3 py-2.5 text-center text-sm font-bold text-white transition hover:bg-green-700"
          >
            ✅ অর্ডার
          </Link>
        </div>
      </div>
    </div>
  );
}
