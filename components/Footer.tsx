import DeveloperCredit from "./DeveloperCredit"

type Props = {
  storeName?: string
  address?: string
  phone?: string
}

export default function Footer({
  storeName = "Clothify",
  address = "",
  phone = ""
}: Props) {

  return (
    <footer className="mt-16 bg-black text-white">

      <div className="mx-auto max-w-6xl px-4 py-12">

        <div className="grid gap-8 md:grid-cols-3">

          <div>
            <h3 className="text-2xl font-bold">
              {storeName}
            </h3>

            <p className="mt-3 text-sm text-slate-400">
              Premium clothing collection with trusted checkout and fast service.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold">
              Store Information
            </h4>

            <p className="mt-3 text-sm text-slate-400">
              {address || "Address not added yet"}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold">
              Contact
            </h4>

            <p className="mt-3 text-sm text-slate-400">
              {phone || "Phone not added yet"}
            </p>
          </div>

        </div>

        <DeveloperCredit />

        <div className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Clothify. All rights reserved.
        </div>

      </div>

    </footer>
  )
}
