import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import { cookies } from "next/headers";
import { getStoreSettings } from "@/lib/data";

export const revalidate = 120;

function waLink(phone: string, text: string) {
  const digits = phone.replace(/\D/g, "") || "8801811314262";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export default async function HelpPage() {
  const settings = await getStoreSettings();
  const cookieStore = await cookies();
  const isBn = cookieStore.get("clothfy-lang")?.value !== "en";
  const phone = settings?.whatsapp_number || "8801811314262";

  const flows = [
    {
      label: isBn ? "সাইজ সহায়তা" : "Size Help",
      text: isBn ? "ভাই, আমার size suggest করবেন?" : "Please suggest my size.",
    },
    {
      label: isBn ? "ফ্যাব্রিক ডিটেইলস" : "Fabric Details",
      text: isBn
        ? "এই product-এর fabric quality details জানতে চাই"
        : "I want fabric quality details for this product.",
    },
    {
      label: isBn ? "ডেলিভারি সময়" : "Delivery Time",
      text: isBn
        ? "আমার upazila-তে delivery কত দিনে হবে?"
        : "How many days for delivery to my upazila?",
    },
    {
      label: isBn ? "এক্সচেঞ্জ প্রশ্ন" : "Exchange Query",
      text: isBn
        ? "Exchange policy সম্পর্কে জানাতে পারবেন?"
        : "Can you explain your exchange policy?",
    },
  ];

  return (
    <main className="pb-24 md:pb-0">
      <Header
        storeName={settings?.store_name || "Clothify"}
        slogan={settings?.slogan || "Find Your Fit"}
        logoUrl={settings?.logo_url || ""}
        whatsappNumber={phone}
      />

      <section className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
            {isBn ? "সহায়তা" : "Help & Support"}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {isBn ? "WhatsApp সাপোর্ট • দ্রুত সহায়তা" : "WhatsApp Support • Quick Help Flow"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {isBn
              ? "এক ট্যাপে chat করুন। সাইজ, ফ্যাব্রিক, ডেলিভারি, পেমেন্ট — সবকিছুতে human support।"
              : "One tap chat. Get support for size, fabric, delivery, and payment."}
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {flows.map((flow) => (
            <a
              key={flow.label}
              href={waLink(phone, flow.text)}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              💬 {flow.label}
            </a>
          ))}
        </div>
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
