import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import { getStoreSettings } from "@/lib/data";

export const revalidate = 120;

export default async function SizeGuidePage() {
  const settings = await getStoreSettings();

  const rows = [
    { size: "S", chest: "36-38 in", length: "27 in" },
    { size: "M", chest: "38-40 in", length: "28 in" },
    { size: "L", chest: "40-42 in", length: "29 in" },
    { size: "XL", chest: "42-44 in", length: "30 in" },
    { size: "XXL", chest: "44-46 in", length: "31 in" },
  ];

  return (
    <main className="pb-24 md:pb-0">
      <Header
        storeName={settings?.store_name || "Clothify"}
        slogan={settings?.slogan || "Find Your Fit"}
        logoUrl={settings?.logo_url || ""}
        whatsappNumber={settings?.whatsapp_number || "8801811314262"}
      />

      <section className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Size & Policy</p>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">Size Guide + Exchange / Return Policy</h1>
          <p className="mt-2 text-sm text-slate-600">সাইজ নিয়ে কনফিউশন হলে WhatsApp-এ message দিন, আমরা fit suggest করবো।</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Shirt / Panjabi Size Chart</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2">Size</th>
                  <th className="px-3 py-2">Chest</th>
                  <th className="px-3 py-2">Length</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.size} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-semibold text-slate-900">{row.size}</td>
                    <td className="px-3 py-2 text-slate-700">{row.chest}</td>
                    <td className="px-3 py-2 text-slate-700">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
          <h3 className="text-base font-bold">Exchange Policy</h3>
          <ul className="mt-2 space-y-1">
            <li>1. Product পাওয়ার 7 দিনের মধ্যে exchange request করা যাবে।</li>
            <li>2. Used, washed, damage করা item exchange হবে না।</li>
            <li>3. Wrong size / defect হলে exchange priority support পাবেন।</li>
            <li>4. Refund policy order-specific condition অনুযায়ী apply হবে।</li>
          </ul>
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
