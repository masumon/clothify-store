import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Order Placed Successfully</h1>
        <p className="mt-4 text-slate-600">
          Thank you for shopping with Clothify. Your order has been received and
          is waiting for confirmation.
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href="/"
            className="block rounded-lg bg-black px-5 py-3 text-white"
          >
            Back to Home
          </Link>

          <Link
            href="/admin/orders"
            className="block rounded-lg bg-slate-200 px-5 py-3 text-slate-800"
          >
            View Orders
          </Link>
        </div>
      </div>
    </main>
  );
}
