import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import CartClient from "@/components/CartClient";
import { getStoreSettings } from "@/lib/data";

export const revalidate = 60;

export default async function CartPage() {
  const settings = await getStoreSettings();

  return (
    <main className="pb-20">
      <Header
        storeName={settings?.store_name || "Clothify"}
        slogan={settings?.slogan || "Find Your Fit"}
        logoUrl={settings?.logo_url || ""}
        whatsappNumber={settings?.whatsapp_number || "8801811314262"}
      />

      <CartClient />

      <BottomNav />
    </main>
  );
}
