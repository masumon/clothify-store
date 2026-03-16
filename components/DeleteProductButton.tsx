"use client";

import { useRouter } from "next/navigation";

type Props = {
  productId: string;
};

export default function DeleteProductButton({ productId }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    const response = await fetch(`/api/admin/products/${productId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Failed to delete product");
      return;
    }

    alert("Product deleted successfully");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="mt-3 w-full rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
    >
      Delete Product
    </button>
  );
}
