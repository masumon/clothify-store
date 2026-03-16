export default function BestSellerStrip() {
  return (
    <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-pink-600 via-rose-500 to-orange-400 px-5 py-6 text-white shadow-lg sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
            🔥 সেরা পণ্য
          </p>
          <h3 className="mt-2 text-2xl font-bold sm:text-3xl">
            বেস্ট সেলার কালেকশন
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
            সবচেয়ে বেশি বিক্রিয় পোশাকগুলো দেখুন — প্রিমিয়াম ফ্যাব্রিক, সেরা দাম, স্টাইলিশ ডিজাইন।
          </p>
        </div>

        <a
          href="#products"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-slate-100"
        >
          🛍️ সব পণ্য দেখুন
        </a>
      </div>
    </section>
  );
}
