"use client";

import { supabase } from "@/lib/supabase";

type Props = {
  productId: string;
};

export default function DeleteProductButton({ productId }: Props) {
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    const { error } = await supabase.from("products").delete().eq("id", productId);

    if (error) {
      alert(error.message || "Failed to delete product");
      return;
    }

    alert("Product deleted successfully");
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="mt-3 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
    >
      Delete Product
    </button>
  );
}
