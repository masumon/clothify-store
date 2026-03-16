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
  role = "AI Solutions Architect | Full Stack Python Developer | Multimedia & Tech Specialist",
  business = "ABO ENTERPRISE",
  email1 = "abo.enterprise@gmail.com",
  email2 = "m.a.sumon92@gmail.com",
  whatsapp = "+8801825007977",
  phone = "+8801885411007",
  address = "Kashir Abdullahpur, Bairagi Bazar, Beanibazar, Sylhet, Bangladesh"
}: Props) {

  return (
    <div className="mt-10 border-t border-white/10 pt-8">

      <p className="text-xs uppercase tracking-widest text-slate-400 text-center">
        Developed & Managed By
      </p>

      <div className="mt-5 flex flex-col items-center text-center">

        <img
          src="/abo-logo.png"
          alt="ABO Enterprise"
          className="w-20 h-20 rounded-full object-cover border border-white/20 shadow-lg"
        />

        <h4 className="mt-4 text-lg font-bold text-white">
          {name}
        </h4>

        <p className="text-sm text-slate-300 max-w-xl">
          {role}
        </p>

        <p className="mt-2 text-sm text-slate-400">
          {business}
        </p>

        <p className="mt-2 text-xs text-slate-500 max-w-md">
          {address}
        </p>

        <div className="mt-3 text-xs text-slate-400 space-y-1">

          <p>Email: {email1}</p>
          <p>Email: {email2}</p>

          <p>WhatsApp: {whatsapp}</p>

          <p>Phone: {phone}</p>

        </div>

      </div>

    </div>
  )
}
