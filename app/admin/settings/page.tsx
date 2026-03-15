import StoreSettingsForm from "@/components/StoreSettingsForm";
import AdminTopbar from "@/components/AdminTopbar";
import { getStoreSettings } from "@/lib/data";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <section>
      <AdminTopbar />
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Store Settings</h1>
      <StoreSettingsForm initialData={settings} />
    </section>
  );
}
