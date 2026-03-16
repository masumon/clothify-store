import Image from "next/image";

type Props = {
  name?: string
  role?: string
  business?: string
  email1?: string
  email2?: string
  whatsapp?: string
  phone?: string
  address?: string
}

export default function DeveloperCredit({
  name = "Mumain Ahmed",
  role = "AI Solutions Architect & Full Stack Developer",
  business = "ABO ENTERPRISE",
  email1 = "abo.enterprise@gmail.com",
  email2 = "m.a.sumon92@gmail.com",
  whatsapp = "+8801825007977",
  phone = "+8801885411007",
  address = "Kashir Abdullahpur, Bairagi Bazar, Beanibazar, Sylhet, Bangladesh"
}: Props) {

  return (
    <div className="mt-8 border-t border-white/10 pt-6">

      <p className="text-xs uppercase tracking-widest text-slate-400 text-center">
        Developed & Managed By
      </p>

      <div className="mt-4 flex flex-col items-center text-center">

        <Image
          src="/abo-logo.png"
          alt="ABO Enterprise"
          width={56}
          height={56}
          className="h-14 w-14 rounded-full border border-white/20 object-cover shadow"
        />

        <h4 className="mt-3 text-base font-bold text-white">
          {name}
        </h4>

        <p className="text-xs text-slate-300 max-w-md">
          {role}
        </p>

        <p className="mt-1 text-xs font-medium tracking-wide text-slate-400">
          {business}
        </p>

        <p className="mt-2 text-[11px] text-slate-500 max-w-md">
          {address}
        </p>

        <div className="mt-3 space-y-1 text-[11px] text-slate-400">
          <p>{email1}</p>
          <p>{email2}</p>
          <p>WhatsApp: {whatsapp} | Phone: {phone}</p>
        </div>

      </div>

    </div>
  )
}
