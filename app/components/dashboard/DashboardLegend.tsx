const legendItems = [
  { label: "Prof", value: "% proficiencia" },
  { label: "Conc", value: "conceito" },
  { label: "Perf", value: "score conc+prof" },
  { label: "Part", value: "participantes" },
  { label: "Taxa", value: "part/inscr" },
  { label: "C1-2", value: "conceitos baixos" },
  { label: "C4-5", value: "conceitos altos" },
];

export default function DashboardLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
      <span className="text-slate-500">Legenda</span>
      {legendItems.map((item) => (
        <span
          key={item.label}
          className="rounded-full border border-border bg-white px-2.5 py-1 text-slate-500"
        >
          {item.label}: {item.value}
        </span>
      ))}
    </div>
  );
}
