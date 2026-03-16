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
          <p className="text-lg font-extrabold text-pink-600 sm:text-xl">
            ৳{product.price}
          </p>

          <Link
            href={`/product/${product.id}`}
            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
