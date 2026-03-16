"use client";

import { FormEvent, useEffect, useState } from "react";
import { getProfile, saveProfile } from "@/lib/profile";

export default function ProfileForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profile = getProfile();
    if (profile) {
      setName(profile.name);
      setPhone(profile.phone);
      setAddress(profile.address);
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !address) {
      alert("Please fill all fields");
      return;
    }

    saveProfile({ name, phone, address });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Full Name
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Phone Number
        </label>
        <input
          type="text"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Delivery Address
        </label>
        <textarea
          placeholder="Enter your delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="min-h-[120px] w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-slate-800"
      >
        Save Profile
      </button>

      {saved && (
        <p className="text-center text-sm font-medium text-green-600">
          ✓ Profile saved successfully
        </p>
      )}
    </form>
  );
}
