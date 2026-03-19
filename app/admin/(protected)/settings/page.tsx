import AppIcon from "@/components/AppIcon";
import StoreSettingsForm from "@/components/StoreSettingsForm";
import AdminTopbar from "@/components/AdminTopbar";
import { getStoreSettings } from "@/lib/data";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <section>
      <AdminTopbar />

      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 shadow-sm">
          <AppIcon name="settings" className="h-4 w-4" />
          Store Settings
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Store settings</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Configure brand identity, support channels, payment details, and trust assets from one polished form.
        </p>
      </div>

      <StoreSettingsForm initialData={settings} />
    </section>
  );
}
