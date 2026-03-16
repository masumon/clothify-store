"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  initialData: {
    id: number;
    store_name: string;
    slogan: string;
    logo_url: string | null;
    address: string | null;
    contact_phone: string | null;
    whatsapp_number: string | null;
    bkash_number: string | null;
    bkash_qr_url: string | null;
  } | null;
};

export default function StoreSettingsForm({ initialData }: Props) {
  const router = useRouter();
  const [storeName, setStoreName] = useState(initialData?.store_name || "");
  const [slogan, setSlogan] = useState(initialData?.slogan || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [contactPhone, setContactPhone] = useState(initialData?.contact_phone || "");
  const [whatsappNumber, setWhatsappNumber] = useState(initialData?.whatsapp_number || "");
  const [bkashNumber, setBkashNumber] = useState(initialData?.bkash_number || "");
  const [logoUrl, setLogoUrl] = useState(initialData?.logo_url || "");
  const [bkashQrUrl, setBkashQrUrl] = useState(initialData?.bkash_qr_url || "");
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);

  const uploadFile = async (
    e: ChangeEvent<HTMLInputElement>,
    bucket: "store-assets",
    folder: string,
    setUrl: (url: string) => void,
    setLoading: (value: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const filePath = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setUrl(result.url || "");
      alert("Upload successful");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Upload failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        store_name: storeName,
        slogan,
        logo_url: logoUrl,
        address,
        contact_phone: contactPhone,
        whatsapp_number: whatsappNumber,
        bkash_number: bkashNumber,
        bkash_qr_url: bkashQrUrl,
      };

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update store settings");
      }

      alert("Store settings updated successfully");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update store settings";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">🏪 Store Name</label>
        <input
          type="text"
          title="Store Name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">✨ Slogan</label>
        <input
          type="text"
          title="Slogan"
          value={slogan}
          onChange={(e) => setSlogan(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">📍 Address</label>
        <textarea
          title="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="min-h-[100px] w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">☎️ Contact Phone</label>
          <input
            type="text"
            title="Contact Phone"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">💬 WhatsApp Number</label>
          <input
            type="text"
            title="WhatsApp Number"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">💳 bKash Number</label>
          <input
            type="text"
            title="bKash Number"
            value={bkashNumber}
            onChange={(e) => setBkashNumber(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <label className="mb-2 block text-sm font-semibold text-slate-700">🖼️ Logo Upload</label>
          <input
            type="file"
            title="Logo Upload"
            aria-label="Logo Upload"
            accept="image/*"
            onChange={(e) =>
              uploadFile(e, "store-assets", "logos", setLogoUrl, setUploadingLogo)
            }
            className="w-full text-sm"
          />
          <p className="mt-2 text-xs text-slate-500">
            {uploadingLogo ? "Uploading logo..." : "Upload store logo"}
          </p>

          {logoUrl ? (
            <Image src={logoUrl} alt="Logo" width={96} height={96} className="mt-4 h-24 w-24 rounded-xl border object-cover" />
          ) : null}
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <label className="mb-2 block text-sm font-semibold text-slate-700">📲 bKash QR Upload</label>
          <input
            type="file"
            title="bKash QR Upload"
            aria-label="bKash QR Upload"
            accept="image/*"
            onChange={(e) =>
              uploadFile(e, "store-assets", "bkash", setBkashQrUrl, setUploadingQr)
            }
            className="w-full text-sm"
          />
          <p className="mt-2 text-xs text-slate-500">
            {uploadingQr ? "Uploading QR..." : "Upload bKash QR image"}
          </p>

          {bkashQrUrl ? (
            <Image src={bkashQrUrl} alt="QR" width={128} height={128} className="mt-4 h-32 w-32 rounded-xl border object-cover" />
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-emerald-700 px-5 py-3 font-medium text-white transition hover:bg-emerald-800 disabled:opacity-60"
      >
        {saving ? "Saving..." : "✅ Save Settings"}
      </button>
    </form>
  );
}
