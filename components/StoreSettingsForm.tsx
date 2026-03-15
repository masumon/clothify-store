"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

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

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      setUrl(data.publicUrl);
      alert("Upload successful");
    } catch (error: any) {
      alert(error.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        id: 1,
        store_name: storeName,
        slogan,
        logo_url: logoUrl,
        address,
        contact_phone: contactPhone,
        whatsapp_number: whatsappNumber,
        bkash_number: bkashNumber,
        bkash_qr_url: bkashQrUrl,
      };

      const { error } = await supabase.from("store_settings").upsert(payload);

      if (error) throw error;

      alert("Store settings updated successfully");
    } catch (error: any) {
      alert(error.message || "Failed to update store settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Store Name</label>
        <input
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Slogan</label>
        <input
          type="text"
          value={slogan}
          onChange={(e) => setSlogan(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="min-h-[100px] w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Contact Phone</label>
          <input
            type="text"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">WhatsApp Number</label>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">bKash Number</label>
          <input
            type="text"
            value={bkashNumber}
            onChange={(e) => setBkashNumber(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Logo Upload</label>
          <input
            type="file"
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
            <img src={logoUrl} alt="Logo" className="mt-4 h-24 w-24 rounded-xl border object-cover" />
          ) : null}
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <label className="mb-2 block text-sm font-semibold text-slate-700">bKash QR Upload</label>
          <input
            type="file"
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
            <img src={bkashQrUrl} alt="QR" className="mt-4 h-32 w-32 rounded-xl border object-cover" />
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
