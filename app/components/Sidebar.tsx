"use client";

import Link from "next/link";
import {
  Squares2X2Icon,
  TableCellsIcon,
  TrophyIcon,
  InformationCircleIcon,
  MapIcon,
} from "@heroicons/react/24/solid";

type SidebarProps = {
  active: "dashboard" | "ranking" | "tabela" | "mapas" | "sobre";
  lastUpdated: string | null;
  isOpen?: boolean;
  onClose?: () => void;
};

const formatDate = (value: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("pt-BR");
};

export default function Sidebar({
  active,
  lastUpdated,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const navItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: Squares2X2Icon,
      isActive: active === "dashboard",
    },
    {
      label: "Ranking",
      href: "/ranking",
      icon: TrophyIcon,
      isActive: active === "ranking",
    },
    {
      label: "Tabela",
      href: "/tabela",
      icon: TableCellsIcon,
      isActive: active === "tabela",
    },
    {
      label: "Mapas",
      href: "/mapas",
      icon: MapIcon,
      isActive: active === "mapas",
    },
    {
      label: "Sobre",
      href: "/sobre",
      icon: InformationCircleIcon,
      isActive: active === "sobre",
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen w-60 border-r border-[color:var(--border-200)] bg-white transition-transform duration-200 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="flex h-full flex-col">
        <div className="px-6 py-6">
          <a
            className="flex items-center justify-center"
            href="https://enamed.inep.gov.br/enamed/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/images/enamed-logo.png"
              alt="Enamed"
              className="h-12 w-auto max-w-full"
            />
          </a>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium transition ${
                  item.isActive
                    ? "bg-[color:var(--brand-900)] text-white"
                    : "text-slate-700 hover:bg-[color:var(--surface-soft)]"
                }`}
                onClick={() => onClose?.()}
              >
                <Icon className="h-4 w-4 text-[color:inherit]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-6 py-6 text-xs text-slate-500">
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-[0.2em]">Atualizacao</span>
            <span className="text-slate-600">{formatDate(lastUpdated)}</span>
          </div>
          <a
            className="mt-3 inline-flex text-xs font-semibold text-[color:var(--brand-900)]"
            href="https://www.gov.br/mec/pt-br/assuntos/noticias/2026/janeiro/enamed-divulgadas-avaliacao-dos-cursos-de-medicina-e-medidas-de-supervisao"
            target="_blank"
            rel="noreferrer"
          >
            Fonte MEC
          </a>
          <a
            className="mt-4 inline-flex text-[10px] text-slate-400 transition hover:text-slate-500"
            href="https://thejohn.com.br/pt"
            target="_blank"
            rel="noreferrer"
          >
            Site feito e desenvolvido com amor por TheJohn
          </a>
        </div>
      </div>
    </aside>
  );
}
