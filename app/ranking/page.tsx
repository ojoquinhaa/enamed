import DashboardShell from "../components/DashboardShell";
import RankingClient from "../components/ranking/RankingClient";
import { getEnamedData } from "../lib/enamed";

export default async function RankingPage() {
  const { rows, options, lastUpdated } = await getEnamedData();

  return (
    <DashboardShell active="ranking" lastUpdated={lastUpdated}>
      <section className="rounded-md border border-[color:var(--border-200)] bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              ENAMED
            </p>
            <h1 className="text-2xl font-semibold text-[color:var(--ink-900)]">
              Ranking 2025
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="rounded-md border border-[color:var(--border-200)] bg-white px-3 py-1 text-slate-600">
              Medicina
            </span>
            <span className="rounded-md bg-[color:var(--brand-900)] px-3 py-1 text-white">
              ENADE
            </span>
          </div>
        </div>
      </section>

      <RankingClient rows={rows} options={options} />
    </DashboardShell>
  );
}
