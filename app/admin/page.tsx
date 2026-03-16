import Link from "next/link";
import AdminTopbar from "@/components/AdminTopbar";
import AdminStats from "@/components/AdminStats";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { getTrafficSnapshotFromDb } from "@/lib/traffic";
import { Order } from "@/types";

export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;

const rangeOptions = [
  { key: "today", label: "Today", days: 1 },
  { key: "7d", label: "Last 7 Days", days: 7 },
  { key: "30d", label: "Last 30 Days", days: 30 },
] as const;

type RangeKey = (typeof rangeOptions)[number]["key"];

function resolveRange(range?: string) {
  const selected = rangeOptions.find((item) => item.key === range);
  return selected || rangeOptions[1];
}

function getPeriodKey(dateValue?: string) {
  if (!dateValue) return "";
  const value = new Date(dateValue);
  if (Number.isNaN(value.getTime())) return "";
  return value.toISOString().slice(0, 10);
}

function computePercentChange(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}

function formatTrendLabel(value: number) {
  const rounded = Math.round(value);
  if (rounded > 0) return `+${rounded}%`;
  if (rounded < 0) return `${rounded}%`;
  return "0%";
}

async function getDashboardData(rangeDays: number) {
  try {
    const supabase = getSupabaseAdminClient();

    const { data: products } = await supabase.from("products").select("id,is_published");
    const { data: orders } = await supabase
      .from("orders")
      .select("id,status,total_amount,created_at");

    const allOrders = (orders || []) as Array<
      Pick<Order, "status" | "total_amount" | "created_at">
    >;

    const now = Date.now();
    const currentStart = now - rangeDays * DAY_MS;
    const previousStart = now - rangeDays * 2 * DAY_MS;

    const currentPeriodOrders = allOrders.filter((order) => {
      if (!order.created_at) return false;
      const ts = new Date(order.created_at).getTime();
      return Number.isFinite(ts) && ts >= currentStart && ts <= now;
    });

    const previousPeriodOrders = allOrders.filter((order) => {
      if (!order.created_at) return false;
      const ts = new Date(order.created_at).getTime();
      return Number.isFinite(ts) && ts >= previousStart && ts < currentStart;
    });

    const currentReturned = currentPeriodOrders.filter(
      (order) => order.status === "Returned"
    ).length;
    const previousReturned = previousPeriodOrders.filter(
      (order) => order.status === "Returned"
    ).length;
    const currentCancelled = currentPeriodOrders.filter(
      (order) => order.status === "Cancelled"
    ).length;
    const previousCancelled = previousPeriodOrders.filter(
      (order) => order.status === "Cancelled"
    ).length;

    const salesByDay = new Map<string, number>();
    for (let i = 6; i >= 0; i -= 1) {
      const key = new Date(now - i * DAY_MS).toISOString().slice(0, 10);
      salesByDay.set(key, 0);
    }

    for (const order of allOrders) {
      const key = getPeriodKey(order.created_at);
      if (!key || !salesByDay.has(key)) continue;
      salesByDay.set(key, (salesByDay.get(key) || 0) + Number(order.total_amount || 0));
    }

    const dailySales = Array.from(salesByDay.entries()).map(([date, amount]) => ({
      date,
      amount,
    }));

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
      currentReturned,
      previousReturned,
      currentCancelled,
      previousCancelled,
      periodSales:
        currentPeriodOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0) || 0,
      previousPeriodSales:
        previousPeriodOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0) || 0,
      dailySales,
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
      currentReturned: 0,
      previousReturned: 0,
      currentCancelled: 0,
      previousCancelled: 0,
      periodSales: 0,
      previousPeriodSales: 0,
      dailySales: [] as Array<{ date: string; amount: number }>,
    };
  }
}

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams?: { range?: string };
}) {
  const activeRange = resolveRange(searchParams?.range);
  const {
    totalProducts,
    totalOrders,
    totalPending,
    totalRevenue,
    totalCancelled,
    totalReturned,
    totalDeliveredToday,
    totalDraft,
    currentReturned,
    previousReturned,
    currentCancelled,
    previousCancelled,
    periodSales,
    previousPeriodSales,
    dailySales,
  } = await getDashboardData(activeRange.days);
  const traffic = await getTrafficSnapshotFromDb(activeRange.days, 7);

  const returnedChange = computePercentChange(currentReturned, previousReturned);
  const cancelledChange = computePercentChange(currentCancelled, previousCancelled);
  const salesChange = computePercentChange(periodSales, previousPeriodSales);
  const maxTraffic = Math.max(1, ...traffic.dailyVisits.map((item) => item.count));
  const maxSales = Math.max(1, ...dailySales.map((item) => item.amount));

  return (
    <section>
      <AdminTopbar />

      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
        Admin Dashboard
      </h1>
      <p className="mt-2 text-slate-600">
        Manage your store operations with a cleaner workflow and faster setup.
      </p>

      <div className="mb-6 mt-4 flex flex-wrap gap-2">
        {rangeOptions.map((item) => {
          const isActive = item.key === activeRange.key;
          return (
            <Link
              key={item.key}
              href={`/admin?range=${item.key}`}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Visits ({activeRange.label})
          </p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{traffic.visitsInRange}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Sales ({activeRange.label})
          </p>
          <p className="mt-1 text-2xl font-extrabold text-teal-700">৳{periodSales}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Trend: {formatTrendLabel(salesChange)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Draft Products</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-700">{totalDraft}</p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-base font-bold text-slate-900">Return Trend</h3>
          <p className="mt-2 text-2xl font-extrabold text-rose-700">{currentReturned}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {formatTrendLabel(returnedChange)} vs previous {activeRange.label.toLowerCase()}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-base font-bold text-slate-900">Cancel Trend</h3>
          <p className="mt-2 text-2xl font-extrabold text-slate-700">{currentCancelled}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {formatTrendLabel(cancelledChange)} vs previous {activeRange.label.toLowerCase()}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-base font-bold text-slate-900">All Time Sales</h3>
          <p className="mt-2 text-2xl font-extrabold text-emerald-700">৳{totalRevenue}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">Lifetime revenue snapshot</p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-bold text-slate-900">Traffic Mini Chart (7D)</h3>
          <div className="mt-4 flex items-end gap-2">
            {traffic.dailyVisits.map((item) => {
              const height = Math.max(12, Math.round((item.count / maxTraffic) * 110));
              return (
                <div key={item.date} className="flex-1">
                  <div
                    className="w-full rounded-t-md bg-cyan-500/80"
                    style={{ height }}
                    title={`${item.date}: ${item.count}`}
                  />
                  <p className="mt-1 truncate text-[10px] font-semibold text-slate-500">
                    {item.date.slice(5)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-bold text-slate-900">Sales Mini Chart (7D)</h3>
          <div className="mt-4 flex items-end gap-2">
            {dailySales.map((item) => {
              const height = Math.max(12, Math.round((item.amount / maxSales) * 110));
              return (
                <div key={item.date} className="flex-1">
                  <div
                    className="w-full rounded-t-md bg-emerald-500/80"
                    style={{ height }}
                    title={`${item.date}: ${item.amount}`}
                  />
                  <p className="mt-1 truncate text-[10px] font-semibold text-slate-500">
                    {item.date.slice(5)}
                  </p>
                </div>
              );
            })}
          </div>
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
        <h3 className="text-lg font-bold text-slate-900">Traffic Trend (Last 7 Days)</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {traffic.dailyVisits.length === 0 ? (
            <p className="text-sm text-slate-500">No historical traffic data yet.</p>
          ) : (
            traffic.dailyVisits.map((item) => (
              <div key={item.date} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{item.date}</p>
                <p className="mt-1 text-xl font-extrabold text-slate-900">{item.count}</p>
              </div>
            ))
          )}
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
