import AdminTopbar from "@/components/AdminTopbar";
import OrderStatusSelect from "@/components/OrderStatusSelect";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { Order } from "@/types";

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

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <section>
      <AdminTopbar />

      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Orders</h1>
        <p className="mt-2 text-slate-600">Manage customer orders here.</p>
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
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
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
