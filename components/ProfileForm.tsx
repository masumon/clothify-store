"use client";

import { FormEvent, useEffect, useState } from "react";
import { clearProfile, getProfile, saveProfile } from "@/lib/profile";

export default function ProfileForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string }>({});
  const [saved, setSaved] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);

  useEffect(() => {
    const profile = getProfile();
    if (profile) {
      setName(profile.name);
      setPhone(profile.phone);
      setAddress(profile.address);
      setHasExisting(true);
    }
  }, []);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!address.trim()) newErrors.address = "Delivery address is required";
    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    saveProfile({ name: name.trim(), phone: phone.trim(), address: address.trim() });
    setHasExisting(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClear = () => {
    clearProfile();
    setName("");
    setPhone("");
    setAddress("");
    setErrors({});
    setHasExisting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {hasExisting && !saved && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          ✓ Profile already saved — update below to change your details.
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Full Name
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })); }}
          className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-500 ${errors.name ? "border-red-400" : "border-slate-300"}`}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Phone Number
        </label>
        <input
          type="text"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setErrors((prev) => ({ ...prev, phone: undefined })); }}
          className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-500 ${errors.phone ? "border-red-400" : "border-slate-300"}`}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Delivery Address
        </label>
        <textarea
          placeholder="Enter your delivery address"
          value={address}
          onChange={(e) => { setAddress(e.target.value); setErrors((prev) => ({ ...prev, address: undefined })); }}
          className={`min-h-[120px] w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-500 ${errors.address ? "border-red-400" : "border-slate-300"}`}
        />
        {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-slate-800"
      >
        Save Profile
      </button>

      {hasExisting && (
        <button
          type="button"
          onClick={handleClear}
          className="w-full rounded-lg border border-red-200 px-5 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
        >
          Clear Saved Profile
        </button>
      )}

      {saved && (
        <p className="text-center text-sm font-medium text-green-600">
          ✓ Profile saved successfully
        </p>
      )}
    </form>
  );
}
