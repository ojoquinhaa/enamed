import MiniTable from "../../ui/MiniTable";
import SectionCard from "../../ui/SectionCard";
import { formatRate, numberFormatter, percentFormatter } from "../formatters";

type SectionSimulationProps = {
  totalParticipants: number;
  estimatedProficient: number | null;
  simulatedTopQuartile: number | null;
  simulatedTarget90: number | null;
  topQuartileProf: number | null;
};

export default function SectionSimulation({
  totalParticipants,
  estimatedProficient,
  simulatedTopQuartile,
  simulatedTarget90,
  topQuartileProf,
}: SectionSimulationProps) {
  const rows = [
    {
      label: "Atual estimado",
      value: estimatedProficient,
    },
    {
      label: "Se todos Top 25%",
      value: simulatedTopQuartile,
    },
    {
      label: "Se todos 90%",
      value: simulatedTarget90,
    },
  ];

  return (
    <SectionCard
      title="Simulacoes"
      description="Cenarios hipoteticos para proficiencia."
    >
      <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
        <span className="rounded-full border border-[color:var(--border-200)] bg-white px-3 py-1 font-semibold uppercase tracking-[0.12em]">
          Top 25% Prof:{" "}
          {typeof topQuartileProf === "number"
            ? `${percentFormatter.format(topQuartileProf)}%`
            : "-"}
        </span>
      </div>
      <MiniTable
        columns={[
          { label: "Cenario" },
          { label: "Proficientes", align: "right" },
          { label: "Taxa", align: "right" },
        ]}
        rows={rows.map((row) => [
          row.label,
          row.value === null ? "-" : numberFormatter.format(Math.round(row.value)),
          row.value === null || totalParticipants === 0
            ? "-"
            : formatRate(row.value / totalParticipants),
        ])}
      />
    </SectionCard>
  );
}
