import DashboardShell from "../components/DashboardShell";
import TableClient from "../components/table/TableClient";
import { getEnamedData } from "../lib/enamed";

export default async function TabelaPage() {
  const { rows, options, lastUpdated } = await getEnamedData();

  return (
    <DashboardShell active="tabela" lastUpdated={lastUpdated}>
      <section className="rounded-md border border-border bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              ENAMED
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              Tabela 2025
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="rounded-md border border-border bg-white px-3 py-1 text-slate-600">
              Cursos
            </span>
            <span className="rounded-md bg-brand px-3 py-1 text-white">
              ENADE
            </span>
          </div>
        </div>
      </section>

      <TableClient rows={rows} options={options} />
    </DashboardShell>
  );
}
