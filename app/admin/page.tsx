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

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
        Admin Dashboard
      </h1>
      <p className="mt-2 text-slate-600">
        Manage your store operations with a cleaner workflow and faster setup.
      </p>

      <AdminStats
        totalProducts={totalProducts}
        totalOrders={totalOrders}
        totalPending={totalPending}
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/orders"
          className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)] transition hover:-translate-y-0.5"
        >
          <h2 className="text-xl font-bold">📦 Orders</h2>
          <p className="mt-2 text-sm text-slate-600">View all customer orders</p>
        </Link>

        <Link
          href="/admin/products"
          className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)] transition hover:-translate-y-0.5"
        >
          <h2 className="text-xl font-bold">👕 Products</h2>
          <p className="mt-2 text-sm text-slate-600">Upload and manage product catalog</p>
        </Link>

        <Link
          href="/admin/settings"
          className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)] transition hover:-translate-y-0.5"
        >
          <h2 className="text-xl font-bold">⚙️ Settings</h2>
          <p className="mt-2 text-sm text-slate-600">Update store information</p>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)]">
          <h3 className="text-lg font-bold text-slate-900">Recommended Feature Placement</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>Home: hero offer, top categories, trust badges, best sellers.</li>
            <li>Product page: size, price, stock note, quick checkout button.</li>
            <li>Checkout: delivery method, payment guide, order confirmation note.</li>
            <li>Footer: support links, WhatsApp, address, payment confidence copy.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)]">
          <h3 className="text-lg font-bold text-slate-900">Store Setup Priority</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>1) Set store name, logo, bKash QR in Settings.</li>
            <li>2) Upload products with category and available sizes.</li>
            <li>3) Check payment page and place one test order.</li>
            <li>4) Start promotion from landing page and WhatsApp support.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
