"use client";

import { useState, type ReactNode } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Sidebar from "./Sidebar";

type DashboardShellProps = {
  active: "dashboard" | "ranking" | "tabela" | "mapas" | "sobre";
  lastUpdated: string | null;
  children: ReactNode;
};

export default function DashboardShell({
  active,
  lastUpdated,
  children,
}: DashboardShellProps) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <button
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-slate-600 shadow-sm transition hover:border-brand hover:text-brand lg:hidden"
        type="button"
        aria-label={navOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={navOpen}
        onClick={() => setNavOpen((prev) => !prev)}
      >
        {navOpen ? (
          <XMarkIcon className="h-5 w-5" />
        ) : (
          <Bars3Icon className="h-5 w-5" />
        )}
      </button>
      {navOpen ? (
        <button
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          type="button"
          aria-label="Fechar menu"
          onClick={() => setNavOpen(false)}
        />
      ) : null}
      <Sidebar
        active={active}
        lastUpdated={lastUpdated}
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
      />
      <main className="min-h-screen w-full lg:ml-60 lg:w-[calc(100%-15rem)]">
        <div className="flex min-h-screen flex-col gap-6 px-4 py-6 pt-16 lg:px-6 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
