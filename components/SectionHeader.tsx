export default function SectionHeader({
  title,
  subtitle,
  rightText,
}: {
  title: string;
  subtitle?: string;
  rightText?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>

      {rightText ? (
        <div className="text-sm font-medium text-slate-500">{rightText}</div>
      ) : null}
    </div>
  );
}
