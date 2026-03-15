import { supabase } from "@/lib/supabase";

async function getOrders() {
  const { data, error } = await supabase.from("orders").select("*");

  if (error) {
    console.error(error.message);
    return [];
  }

  return data || [];
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
        <p className="mt-2 text-slate-600">Manage customer orders here.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Address
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Delivery
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Trx ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-slate-500"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order: any) => (
                <tr key={order.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 text-sm text-slate-800">
                    {order.customer_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-800">
                    {order.phone}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-800">
                    {order.address}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-800">
                    {order.delivery_method}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-800">
                    ৳{order.total_amount}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-800">
                    {order.bkash_trx_id}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
                      {order.status}
                    </span>
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
