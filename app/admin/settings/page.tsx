import StoreSettingsForm from "@/components/StoreSettingsForm";
import AdminTopbar from "@/components/AdminTopbar";
import { getStoreSettings } from "@/lib/data";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <section>
      <AdminTopbar />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Store Settings</h1>
        <p className="mt-2 text-slate-600">
          Update your brand identity, contact numbers, logo, and bKash QR.
        </p>
      </div>

      <StoreSettingsForm initialData={settings} />
    </section>
  );
}
