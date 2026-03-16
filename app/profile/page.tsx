import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ProfileForm from "@/components/ProfileForm";
import { getStoreSettings } from "@/lib/data";

export const metadata = {
  title: "My Profile | Clothify",
  description: "Manage your profile details for faster checkout",
};

export default async function ProfilePage() {
  const settings = await getStoreSettings();

  return (
    <main className="pb-20">
      <Header
        storeName={settings?.store_name || "Clothify"}
        slogan={settings?.slogan || "Find Your Fit"}
        logoUrl={settings?.logo_url || ""}
      />

      <section className="mx-auto max-w-lg px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="mt-2 text-sm text-slate-500">
            Save your details to speed up checkout next time.
          </p>

          <div className="mt-6">
            <ProfileForm />
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
