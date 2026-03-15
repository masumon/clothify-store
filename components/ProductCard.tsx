import Link from "next/link";

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
    <div className="overflow-hidden rounded-2xl bg-white shadow border border-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/product/${product.id}`}>
        <img
          src={product.image_url}
          alt={product.name}
          className="h-64 w-full object-cover"
        />
      </Link>

      <div className="p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {product.category}
        </p>

        <h3 className="line-clamp-2 text-lg font-bold text-slate-900">
          {product.name}
        </h3>

        <p className="mt-2 text-base font-semibold text-pink-600">
          ৳{product.price}
        </p>

        <Link
          href={`/product/${product.id}`}
          className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
