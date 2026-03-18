import { cookies } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import { getStoreSettings } from "@/lib/data";

export const revalidate = 120;

export default async function LegalPage() {
  const settings = await getStoreSettings();
  const cookieStore = await cookies();
  const isBn = cookieStore.get("clothfy-lang")?.value !== "en";

  return (
    <main className="pb-24 md:pb-0">
      <Header
        storeName={settings?.store_name || "Clothify"}
        slogan={settings?.slogan || "Find Your Fit"}
        logoUrl={settings?.logo_url || ""}
        whatsappNumber={settings?.whatsapp_number || "8801811314262"}
      />

      <section className="mx-auto max-w-4xl space-y-5 px-4 py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            {isBn ? "লিগ্যাল সেন্টার" : "Legal Center"}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {isBn ? "নীতি, শর্ত ও লাইসেন্স" : "Policy, Terms and License"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {isBn
              ? "এই পাতায় Privacy, Terms, Shipping, Refund এবং License সংক্রান্ত মূল নিয়মগুলো দেয়া আছে।"
              : "This page includes core policy blocks for privacy, terms, shipping, refund, and license."}
          </p>
        </div>

        <article id="privacy" className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-900">Privacy Policy</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {isBn
              ? "আপনার অর্ডার তথ্য শুধু delivery, support এবং service উন্নয়নের জন্য ব্যবহার করা হয়।"
              : "Your order data is used only for delivery, support, and service improvement."}
          </p>
        </article>

        <article id="terms" className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-900">Terms & Conditions</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {isBn
              ? "অর্ডার confirm হওয়ার পরে স্টক, ডেলিভারি সময় এবং exchange policy অনুযায়ী প্রসেস করা হবে।"
              : "Orders are processed based on stock, delivery schedule, and exchange policy after confirmation."}
          </p>
        </article>

        <article id="shipping" className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-900">Shipping Policy</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {isBn
              ? "সারা বাংলাদেশে ডেলিভারি সুবিধা রয়েছে। লোকেশনভেদে ডেলিভারি সময় পরিবর্তিত হতে পারে।"
              : "Nationwide delivery is available. Delivery time may vary by location."}
          </p>
        </article>

        <article id="refund" className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-900">Return & Refund Policy</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {isBn
              ? "নির্ধারিত সময়ের মধ্যে exchange/return অনুরোধ গ্রহণ করা হয়। প্রোডাক্টের অবস্থা যাচাই সাপেক্ষে রিফান্ড প্রযোজ্য।"
              : "Exchange/return requests are accepted within the policy window. Refund eligibility depends on product condition."}
          </p>
        </article>

        <article id="license" className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-900">Usage License</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            {isBn
              ? "ওয়েবসাইটের কনটেন্ট শুধুমাত্র ব্যক্তিগত ব্যবহার ও কেনাকাটার উদ্দেশ্যে। অননুমোদিত কপি/ব্যবহার নিষিদ্ধ।"
              : "Website content is licensed for personal shopping use only. Unauthorized copy or reuse is prohibited."}
          </p>
        </article>
      </section>

      <Footer
        storeName={settings?.store_name || "Clothify"}
        address={settings?.address || ""}
        phone={settings?.contact_phone || ""}
      />
      <MobileStickyBar />
    </main>
  );
}
