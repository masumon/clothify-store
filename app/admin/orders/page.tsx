import AdminTopbar from "@/components/AdminTopbar";
import Link from "next/link";
import OrderStatusSelect from "@/components/OrderStatusSelect";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { Order } from "@/types";

export const dynamic = "force-dynamic";
const DAY_MS = 24 * 60 * 60 * 1000;

const rangeOptions = [
  { key: "today", label: "Today", days: 1 },
  { key: "7d", label: "Last 7 Days", days: 7 },
  { key: "30d", label: "Last 30 Days", days: 30 },
] as const;

const kanbanStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Completed",
  "Returned",
  "Cancelled",
] as const;

function resolveRange(range?: string) {
  const selected = rangeOptions.find((item) => item.key === range);
  return selected || rangeOptions[1];
}

async function getOrders() {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error.message);
      return [];
    }

    return (data || []) as Order[];
  } catch {
    return [];
  }
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: { range?: string };
}) {
  const activeRange = resolveRange(searchParams?.range);
  const orders = await getOrders();
  const now = Date.now();
  const periodStart = now - activeRange.days * DAY_MS;

  const filteredOrders = orders.filter((item) => {
    if (!item.created_at) return activeRange.days !== 1;
    const time = new Date(item.created_at).getTime();
    if (!Number.isFinite(time)) return activeRange.days !== 1;
    return time >= periodStart && time <= now;
  });

  const totalSales = filteredOrders.reduce(
    (sum, item) => sum + Number(item.total_amount || 0),
    0
  );
  const pendingCount = filteredOrders.filter((item) => item.status === "Pending").length;
  const deliveredCount = filteredOrders.filter((item) => item.status === "Delivered").length;
  const returnedCount = filteredOrders.filter((item) => item.status === "Returned").length;
  const cancelledCount = filteredOrders.filter((item) => item.status === "Cancelled").length;

  const board: Record<string, Order[]> = Object.fromEntries(
    kanbanStatuses.map((status) => [status, [] as Order[]])
  );

  for (const order of filteredOrders) {
    const key = kanbanStatuses.includes(order.status as (typeof kanbanStatuses)[number])
      ? order.status
      : "Pending";
    board[key].push(order);
  }

  return (
    <section>
      <AdminTopbar />

      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Orders</h1>
        <p className="mt-2 text-slate-600">Manage customer orders here.</p>
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
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Sales ({activeRange.label})
          </p>
          <p className="mt-1 text-2xl font-extrabold text-teal-700">৳{totalSales}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Pending</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-600">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Delivered ({activeRange.label})
          </p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-700">{deliveredCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Returned</p>
          <p className="mt-1 text-2xl font-extrabold text-rose-600">{returnedCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Cancelled</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-700">{cancelledCount}</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          <li>{pendingCount > 0 ? `🔔 ${pendingCount} orders are waiting for action in ${activeRange.label.toLowerCase()}.` : "✅ No pending orders."}</li>
          <li>{cancelledCount > 0 ? `⚠️ ${cancelledCount} orders are cancelled in ${activeRange.label.toLowerCase()}.` : "✅ No cancelled orders."}</li>
          <li>{returnedCount > 0 ? `↩️ ${returnedCount} orders were returned in ${activeRange.label.toLowerCase()}.` : "✅ No returned orders."}</li>
        </ul>
      </div>

      <div className="mb-8 overflow-x-auto">
        <div className="flex min-w-max gap-4">
          {kanbanStatuses.map((status) => (
            <div key={status} className="w-72 rounded-2xl border border-slate-200 bg-white p-3">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">{status}</h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                  {board[status].length}
                </span>
              </div>

              <div className="space-y-2">
                {board[status].slice(0, 8).map((order) => (
                  <div key={order.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-bold text-slate-900">{order.customer_name}</p>
                    <p className="mt-1 text-xs text-slate-600">৳{order.total_amount}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">{order.delivery_method}</p>
                  </div>
                ))}
                {board[status].length === 0 ? (
                  <p className="text-xs text-slate-400">No orders</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)]">
        <table className="min-w-full">
          <thead className="bg-slate-50/90">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Address</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Delivery</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Trx ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Update</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-slate-200 hover:bg-slate-50/70">
                  <td className="px-4 py-3">{order.customer_name}</td>
                  <td className="px-4 py-3">{order.phone}</td>
                  <td className="px-4 py-3">{order.address}</td>
                  <td className="px-4 py-3">{order.delivery_method}</td>
                  <td className="px-4 py-3">৳{order.total_amount}</td>
                  <td className="px-4 py-3">{order.bkash_trx_id}</td>
                  <td className="px-4 py-3">{order.status}</td>

                  <td className="px-4 py-3">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
