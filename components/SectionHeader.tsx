import type { ReactNode } from "react";

export default function SectionHeader({
  title,
  subtitle,
  rightText,
  icon,
}: {
  title: string;
  subtitle?: string;
  rightText?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-3">
          {icon ? (
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-teal-700 shadow-[0_12px_30px_-26px_rgba(15,23,42,0.65)]">
              {icon}
            </span>
          ) : null}
          <div>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 sm:text-[2rem]">{title}</h3>
            {subtitle ? (
              <p className="mt-1 text-sm leading-6 text-slate-500 sm:text-[15px]">{subtitle}</p>
            ) : null}
          </div>
        </div>
      </div>

      {rightText ? (
        <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 shadow-[0_10px_24px_-26px_rgba(2,6,23,0.8)]">
          {rightText}
        </div>
      ) : null}
    </div>
  );
}
