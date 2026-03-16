import Link from "next/link";
import AdminTopbar from "@/components/AdminTopbar";
import AdminStats from "@/components/AdminStats";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { getTrafficSnapshot } from "@/lib/traffic";
import { Order } from "@/types";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    const supabase = getSupabaseAdminClient();

    const { data: products } = await supabase.from("products").select("id,is_published");
    const { data: orders } = await supabase
      .from("orders")
      .select("id,status,total_amount,created_at");

    const totalProducts = products?.length || 0;
    const totalOrders = orders?.length || 0;
    const totalRevenue =
      (orders as Pick<Order, "total_amount">[] | null)?.reduce(
        (sum, order) => sum + Number(order.total_amount || 0),
        0
      ) || 0;
    const totalCancelled =
      (orders as Pick<Order, "status">[] | null)?.filter(
        (order) => order.status === "Cancelled"
      ).length || 0;
    const totalReturned =
      (orders as Pick<Order, "status">[] | null)?.filter(
        (order) => order.status === "Returned"
      ).length || 0;
    const totalDeliveredToday =
      (orders as Array<Pick<Order, "status" | "created_at">> | null)?.filter((order) => {
        if (order.status !== "Delivered" || !order.created_at) return false;
        const current = new Date();
        const created = new Date(order.created_at);
        return (
          created.getFullYear() === current.getFullYear() &&
          created.getMonth() === current.getMonth() &&
          created.getDate() === current.getDate()
        );
      }).length || 0;

    const totalDraft =
      (products as Array<{ is_published?: boolean }> | null)?.filter(
        (product) => product.is_published === false
      ).length || 0;
    const totalPending =
      (orders as Pick<Order, "status">[] | null)?.filter(
        (order) => order.status === "Pending"
      ).length || 0;

    return {
      totalProducts,
      totalOrders,
      totalPending,
      totalRevenue,
      totalCancelled,
      totalReturned,
      totalDeliveredToday,
      totalDraft,
    };
  } catch {
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalPending: 0,
      totalRevenue: 0,
      totalCancelled: 0,
      totalReturned: 0,
      totalDeliveredToday: 0,
      totalDraft: 0,
    };
  }
}

export default async function AdminHomePage() {
  const {
    totalProducts,
    totalOrders,
    totalPending,
    totalRevenue,
    totalCancelled,
    totalReturned,
    totalDeliveredToday,
    totalDraft,
  } = await getDashboardData();
  const traffic = getTrafficSnapshot();

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

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Live Users</p>
          <p className="mt-1 text-2xl font-extrabold text-cyan-700">{traffic.liveUsers}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Visits (24h)</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{traffic.visits24h}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total Sales</p>
          <p className="mt-1 text-2xl font-extrabold text-teal-700">৳{totalRevenue}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Draft Products</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-700">{totalDraft}</p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-bold text-slate-900">Top Traffic Sources</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {traffic.topSources.length === 0 ? <li>No source data yet.</li> : null}
            {traffic.topSources.map((source) => (
              <li key={source.name}>{source.name} - {source.count}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-bold text-slate-900">Top Visitor Regions</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {traffic.topCountries.length === 0 ? <li>No geo data yet.</li> : null}
            {traffic.topCountries.map((item) => (
              <li key={item.name}>{item.name} - {item.count}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-bold text-slate-900">Top Visited Pages</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {traffic.topPages.length === 0 ? <li>No page data yet.</li> : null}
            {traffic.topPages.map((item) => (
              <li key={item.name}>{item.name} - {item.count}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li>{totalPending > 0 ? `🔔 ${totalPending} pending orders require action.` : "✅ No pending orders right now."}</li>
          <li>{totalDeliveredToday > 0 ? `🚚 ${totalDeliveredToday} deliveries completed today.` : "ℹ️ No delivery completed today yet."}</li>
          <li>{totalReturned > 0 ? `↩️ ${totalReturned} orders marked as returned.` : "✅ No returned orders."}</li>
          <li>{totalCancelled > 0 ? `⚠️ ${totalCancelled} orders cancelled.` : "✅ No cancelled orders."}</li>
        </ul>
      </div>

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
