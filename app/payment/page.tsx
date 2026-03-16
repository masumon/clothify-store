import Link from "next/link";

export const dynamic = "force-dynamic";

export default function PaymentPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">

        <h1 className="text-3xl font-bold text-slate-900">
          Payment Page
        </h1>

        <p className="mt-4 text-slate-600">
          Your payment instructions page is now active.
        </p>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex rounded-full bg-black px-6 py-3 text-white font-semibold"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}
