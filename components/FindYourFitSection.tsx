import Link from "next/link";

const profiles = [
  {
    name: "Slim",
    note: "Body-hugging modern cut for sharp occasions.",
    badge: "Best for lean fit",
  },
  {
    name: "Regular",
    note: "Balanced comfort for daily wear and office look.",
    badge: "Most popular",
  },
  {
    name: "Tailored",
    note: "Premium structured silhouette for festive style.",
    badge: "Premium finish",
  },
];

export default function FindYourFitSection() {
  return (
    <section className="mb-10 rounded-[28px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.6)] sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-600">Smart Size Guide</p>
          <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Find Your Fit
          </h3>
        </div>
        <Link
          href="/settings"
          className="inline-flex items-center rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Size preference
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {profiles.map((profile, index) => (
          <article
            key={profile.name}
            className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4"
          >
            <p className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-amber-700">
              {profile.badge}
            </p>
            <h4 className="mt-3 text-xl font-extrabold text-slate-900">{profile.name}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-600">{profile.note}</p>
            <p className="mt-3 text-xs font-semibold text-slate-500">Profile #{index + 1}</p>
          </article>
        ))}
      </div>
    </section>
  );
}