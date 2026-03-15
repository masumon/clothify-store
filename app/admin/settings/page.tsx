import { getStoreSettings } from "@/lib/data";

export default async function AdminSettingsPage() {

  const settings = await getStoreSettings();

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Store Settings</h1>

      <div className="bg-white p-6 rounded-xl border">

        <p><b>Store Name:</b> {settings?.store_name}</p>
        <p><b>Slogan:</b> {settings?.slogan}</p>
        <p><b>Phone:</b> {settings?.contact_phone}</p>
        <p><b>bKash:</b> {settings?.bkash_number}</p>

        <img
          src={settings?.logo_url}
          className="mt-4 w-32"
        />

      </div>

    </section>
  );
}
