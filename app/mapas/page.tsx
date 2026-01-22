import DashboardShell from "../components/DashboardShell";
import MapClient from "../components/maps/MapClient";
import { getEnamedData } from "../lib/enamed";

export default async function MapasPage() {
  const { rows, options, lastUpdated } = await getEnamedData();

  return (
    <DashboardShell active="mapas" lastUpdated={lastUpdated}>
      <section className="rounded-md border border-border bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              ENAMED
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              Mapas 2025
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="rounded-md border border-border bg-white px-3 py-1 text-slate-600">
              UFs
            </span>
            <span className="rounded-md bg-brand px-3 py-1 text-white">
              ENADE
            </span>
          </div>
        </div>
      </section>

      <MapClient rows={rows} options={options} />
    </DashboardShell>
  );
}
