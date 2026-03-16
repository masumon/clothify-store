import Link from "next/link";
import AdminTopbar from "@/components/AdminTopbar";
import AdminStats from "@/components/AdminStats";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { Order } from "@/types";

async function getDashboardData() {
  try {
    const supabase = getSupabaseAdminClient();

    const { data: products } = await supabase.from("products").select("id");
    const { data: orders } = await supabase.from("orders").select("id,status");

    const totalProducts = products?.length || 0;
    const totalOrders = orders?.length || 0;
    const totalPending =
      (orders as Pick<Order, "status">[] | null)?.filter(
        (order) => order.status === "Pending"
      ).length || 0;

    return { totalProducts, totalOrders, totalPending };
  } catch {
    return { totalProducts: 0, totalOrders: 0, totalPending: 0 };
  }
}

export default async function AdminHomePage() {
  const { totalProducts, totalOrders, totalPending } = await getDashboardData();

  return (
    <section>
      <AdminTopbar />

      <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      <p className="mt-2 text-slate-600">Manage your Clothify store from here.</p>

      <AdminStats
        totalProducts={totalProducts}
        totalOrders={totalOrders}
        totalPending={totalPending}
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/orders"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold">Orders</h2>
          <p className="mt-2 text-sm text-slate-600">View all customer orders</p>
        </Link>

        <Link
          href="/admin/products"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold">Products</h2>
          <p className="mt-2 text-sm text-slate-600">Manage store products</p>
        </Link>

        <Link
          href="/admin/settings"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold">Settings</h2>
          <p className="mt-2 text-sm text-slate-600">Update store information</p>
        </Link>
      </div>
    </section>
  );
}
