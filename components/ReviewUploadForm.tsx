"use client";

import { useEffect, useState } from "react";

type Review = {
  productId: string;
  name: string;
  rating: number;
  text: string;
  imageUrl: string;
  createdAt: string;
};

const STORAGE_KEY = "clothify-customer-reviews";

type Props = {
  productId: string;
};

export default function ReviewUploadForm({ productId }: Props) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Review[]) : [];
      setReviews(parsed.filter((r) => r.productId === productId).slice(-4).reverse());
    } catch {
      setReviews([]);
    }
  }, [productId, refreshKey]);

  const submit = async () => {
    if (!name.trim() || !text.trim()) {
      setMessage("Name এবং review লিখুন");
      return;
    }

    const payload: Review = {
      productId,
      name: name.trim(),
      rating,
      text: text.trim(),
      imageUrl: imageUrl.trim(),
      createdAt: new Date().toISOString(),
    };

    // Local fallback workflow for lightweight deployments.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? (JSON.parse(raw) as Review[]) : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...list, payload]));
      setMessage("Review saved. Thank you!");
      setRefreshKey((k) => k + 1);
      setText("");
      setImageUrl("");
    } catch {
      setMessage("Review save failed. আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-extrabold text-slate-900">📝 Customer Review</h3>
      <p className="mt-1 text-xs text-slate-500">নিজের photo link দিয়ে real feedback দিন।</p>

      <div className="mt-3 grid gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        />

        <select
          aria-label="Rating"
          title="Rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star
            </option>
          ))}
        </select>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your review"
          className="min-h-[90px] rounded-xl border border-slate-300 px-3 py-2 text-sm"
        />

        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Photo URL (optional)"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        />

        <button
          type="button"
          onClick={submit}
          className="rounded-full bg-teal-700 px-4 py-2 text-sm font-bold text-white"
        >
          Submit Review
        </button>
      </div>

      {message ? <p className="mt-2 text-xs font-semibold text-emerald-700">{message}</p> : null}

      {reviews.length > 0 ? (
        <div className="mt-4 space-y-2">
          {reviews.map((r) => (
            <div key={r.createdAt} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700">{r.name}</p>
                <p className="text-xs font-bold text-amber-600">{"⭐".repeat(r.rating)}</p>
              </div>
              <p className="mt-1 text-sm text-slate-700">{r.text}</p>
              {r.imageUrl ? (
                <a className="mt-1 inline-block text-xs font-semibold text-teal-700 underline" href={r.imageUrl} target="_blank" rel="noreferrer">
                  View customer photo
                </a>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
