import Link from "next/link";

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-xl rounded-3xl border bg-white p-8 shadow-sm text-center">

        <h1 className="text-3xl font-bold text-slate-900">
          Payment Page
        </h1>

        <p className="mt-4 text-slate-600">
          This is your payment instructions page.
        </p>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex rounded-full bg-black px-6 py-3 text-white"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}
