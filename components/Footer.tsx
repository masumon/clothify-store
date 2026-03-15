type Props = {
  storeName?: string;
  address?: string;
  phone?: string;
};

export default function Footer({
  storeName = "Clothify",
  address = "",
  phone = "",
}: Props) {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center">
        <h3 className="text-lg font-bold text-slate-900">{storeName}</h3>
        {address ? <p className="mt-2 text-sm text-slate-600">{address}</p> : null}
        {phone ? <p className="mt-1 text-sm text-slate-600">{phone}</p> : null}
        <p className="mt-3 text-xs text-slate-500">
          © {new Date().getFullYear()} {storeName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
