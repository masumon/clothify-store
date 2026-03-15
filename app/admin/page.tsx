import Link from "next/link";
import AdminTopbar from "@/components/AdminTopbar";

export default function AdminHomePage() {
  return (
    <section>
      <AdminTopbar />

      <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      <p className="mt-2 text-slate-600">Manage your Clothify store from here.</p>

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
          <p className="mt-2 text-sm text-slate-600">Review store information</p>
        </Link>
      </div>
    </section>
  );
}
