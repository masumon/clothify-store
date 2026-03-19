import Link from "next/link";
import AppIcon from "@/components/AppIcon";
import AdminTopbar from "@/components/AdminTopbar";
import AdminOrdersManager from "@/components/AdminOrdersManager";
import { getStoreSettings } from "@/lib/data";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { Order } from "@/types";

export const dynamic = "force-dynamic";
const DAY_MS = 24 * 60 * 60 * 1000;

const rangeOptions = [
  { key: "today", label: "Today", days: 1 },
  { key: "7d", label: "Last 7 Days", days: 7 },
  { key: "30d", label: "Last 30 Days", days: 30 },
] as const;

function resolveRange(range?: string) {
  const selected = rangeOptions.find((item) => item.key === range);
  return selected || rangeOptions[1];
}

async function getOrders() {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase.from("orders").select("*").order("id", { ascending: false });

    if (error) {
      console.error(error.message);
      return [];
    }

    return (data || []) as Order[];
  } catch {
    return [];
  }
}

type AdminOrdersPageProps = {
  searchParams?: Promise<{ range?: string | string[] | undefined }>;
};

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const rawRange = resolvedSearchParams?.range;
  const range = Array.isArray(rawRange) ? rawRange[0] : rawRange;
  const activeRange = resolveRange(range);
  const settings = await getStoreSettings();
  const orders = await getOrders();
  const now = Date.now();
  const periodStart = now - activeRange.days * DAY_MS;

  const filteredOrders = orders.filter((item) => {
    if (!item.created_at) return activeRange.days !== 1;
    const time = new Date(item.created_at).getTime();
    if (!Number.isFinite(time)) return activeRange.days !== 1;
    return time >= periodStart && time <= now;
  });

  const totalSales = filteredOrders.reduce((sum, item) => sum + Number(item.total_amount || 0), 0);
  const pendingCount = filteredOrders.filter((item) => item.status === "Pending").length;
  const deliveredCount = filteredOrders.filter((item) => item.status === "Delivered").length;
  const returnedCount = filteredOrders.filter((item) => item.status === "Returned").length;
  const cancelledCount = filteredOrders.filter((item) => item.status === "Cancelled").length;

  return (
    <section>
      <AdminTopbar />

      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 shadow-sm">
          <AppIcon name="package" className="h-4 w-4" />
          Orders
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Orders command center</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Track, filter, and process customer orders with courier, payment, and status visibility in one responsive flow.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {rangeOptions.map((item) => {
          const isActive = item.key === activeRange.key;
          return (
            <Link
              key={item.key}
              href={`/admin/orders?range=${item.key}`}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-[24px] border border-slate-200 bg-white/95 p-4 shadow-[0_14px_32px_-26px_rgba(2,6,23,0.48)]">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Sales ({activeRange.label})</p>
          <p className="mt-1 text-2xl font-extrabold text-teal-700">৳{totalSales}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white/95 p-4 shadow-[0_14px_32px_-26px_rgba(2,6,23,0.48)]">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Pending</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-600">{pendingCount}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white/95 p-4 shadow-[0_14px_32px_-26px_rgba(2,6,23,0.48)]">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Delivered ({activeRange.label})</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-700">{deliveredCount}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white/95 p-4 shadow-[0_14px_32px_-26px_rgba(2,6,23,0.48)]">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Returned</p>
          <p className="mt-1 text-2xl font-extrabold text-rose-600">{returnedCount}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white/95 p-4 shadow-[0_14px_32px_-26px_rgba(2,6,23,0.48)]">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Cancelled</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-700">{cancelledCount}</p>
        </div>
      </div>

      <div className="mb-6 rounded-[24px] border border-slate-200 bg-white/95 p-4 shadow-[0_14px_32px_-26px_rgba(2,6,23,0.48)]">
        <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          <li>{pendingCount > 0 ? `${pendingCount} orders are waiting for action in ${activeRange.label.toLowerCase()}.` : "No pending orders."}</li>
          <li>{cancelledCount > 0 ? `${cancelledCount} orders are cancelled in ${activeRange.label.toLowerCase()}.` : "No cancelled orders."}</li>
          <li>{returnedCount > 0 ? `${returnedCount} orders were returned in ${activeRange.label.toLowerCase()}.` : "No returned orders."}</li>
        </ul>
      </div>

      <AdminOrdersManager
        orders={filteredOrders}
        activeRangeLabel={activeRange.label}
        storeName={settings?.store_name || "Clothify"}
        logoUrl={settings?.logo_url || ""}
      />
    </section>
  );
}
