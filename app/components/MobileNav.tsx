import Link from "next/link";

type MobileNavProps = {
  active: "dashboard" | "ranking" | "tabela" | "mapas" | "sobre";
};

export default function MobileNav({ active }: MobileNavProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-[color:var(--border-200)] bg-white p-3 lg:hidden">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Enamed
        </p>
        <p className="text-lg font-semibold text-[color:var(--ink-900)]">
          Medicina 2025
        </p>
      </div>
      <div className="flex gap-2">
        <Link
          className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
            active === "dashboard"
              ? "bg-[color:var(--brand-900)] text-white"
              : "border border-[color:var(--border-200)] bg-white text-slate-600"
          }`}
          href="/"
        >
          Dashboard
        </Link>
        <Link
          className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
            active === "ranking"
              ? "bg-[color:var(--brand-900)] text-white"
              : "border border-[color:var(--border-200)] bg-white text-slate-600"
          }`}
          href="/ranking"
        >
          Ranking
        </Link>
        <Link
          className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
            active === "mapas"
              ? "bg-[color:var(--brand-900)] text-white"
              : "border border-[color:var(--border-200)] bg-white text-slate-600"
          }`}
          href="/mapas"
        >
          Mapas
        </Link>
        <Link
          className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
            active === "sobre"
              ? "bg-[color:var(--brand-900)] text-white"
              : "border border-[color:var(--border-200)] bg-white text-slate-600"
          }`}
          href="/sobre"
        >
          Sobre
        </Link>
        <Link
          className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
            active === "tabela"
              ? "bg-[color:var(--brand-900)] text-white"
              : "border border-[color:var(--border-200)] bg-white text-slate-600"
          }`}
          href="/tabela"
        >
          Tabela
        </Link>
      </div>
    </div>
  );
}

