import StoreSettingsForm from "@/components/StoreSettingsForm";
import AdminTopbar from "@/components/AdminTopbar";
import { getStoreSettings } from "@/lib/data";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <section>
      <AdminTopbar />

      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Store Settings
        </h1>
        <p className="mt-2 text-slate-600">
          Set up your brand identity, support contacts, logo, and bKash QR for trust.
        </p>
      </div>

      <StoreSettingsForm initialData={settings} />
    </section>
  );
}
