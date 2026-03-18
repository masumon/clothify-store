import Image from "next/image";

export default function LoadingPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-900 px-4">
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-amber-500/25 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-teal-400/25 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/10 px-6 py-10 text-center shadow-2xl backdrop-blur-md">
        <div className="flex justify-center">
          <Image
            src="/icons/icon-192.png"
            alt="CLOTHIFY"
            width={72}
            height={72}
            className="h-[72px] w-[72px] rounded-full border border-white/20 object-cover"
          />
        </div>
        <p className="text-3xl font-black uppercase tracking-[0.5em] text-white sm:text-4xl">CLOTHIFY</p>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.28em] text-amber-200 sm:text-base">
          FIND YOUR FIT
        </p>

        <div className="mx-auto mt-6 h-1.5 w-44 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-amber-300 via-white to-teal-300" />
        </div>
      </div>
    </main>
  );
}
