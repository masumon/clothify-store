export default function HomeSectionDivider() {
  return (
    <div className="my-8 flex items-center gap-4">
      <div className="h-px flex-1 bg-slate-200" />
      <div className="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Clothify
      </div>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}
