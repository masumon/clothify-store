import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import { getStoreSettings } from "@/lib/data";

export const revalidate = 120;

function waLink(phone: string, text: string) {
  const digits = phone.replace(/\D/g, "") || "8801811314262";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export default async function HelpPage() {
  const settings = await getStoreSettings();
  const phone = settings?.whatsapp_number || "8801811314262";

  const flows = [
    { label: "Size help", text: "ভাই, আমার size suggest করবেন?" },
    { label: "Fabric details", text: "এই product-এর fabric quality details জানতে চাই" },
    { label: "Delivery time", text: "আমার upazila-তে delivery কত দিনে হবে?" },
    { label: "Exchange query", text: "Exchange policy সম্পর্কে জানাতে পারবেন?" },
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
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Help & Support</p>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">WhatsApp Support • Quick Help Flow</h1>
          <p className="mt-2 text-sm text-slate-600">One tap chat. Size, fabric, delivery, payment — সবকিছুতে human support।</p>
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
