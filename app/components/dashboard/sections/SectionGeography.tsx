import type { GroupStat } from "../../../lib/analytics";
import MiniTable from "../../ui/MiniTable";
import SectionCard from "../../ui/SectionCard";
import { formatPercent, formatRate, formatScore, numberFormatter } from "../formatters";

type SectionGeographyProps = {
  ufPerformanceWeighted: Array<GroupStat & { excellence: number | null }>;
  municipioMulti: GroupStat[];
  municipioRanking: GroupStat[];
  capitalStats: GroupStat[];
};

export default function SectionGeography({
  ufPerformanceWeighted,
  municipioMulti,
  municipioRanking,
  capitalStats,
}: SectionGeographyProps) {
  return (
    <SectionCard
      title="Geografia"
      description="Ponderacoes e recortes territoriais."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <MiniTable
          columns={[
            { label: "UF" },
            { label: "Prof P", align: "right" },
            { label: "Conc P", align: "right" },
            { label: "Score", align: "right" },
          ]}
          rows={ufPerformanceWeighted.map((item) => [
            item.label,
            formatPercent(item.profWeighted),
            item.conceptWeighted ? item.conceptWeighted.toFixed(2) : "-",
            formatScore(item.excellence),
          ])}
        />
        <MiniTable
          columns={[
            { label: "Municipio" },
            { label: "Cursos", align: "right" },
            { label: "Perf", align: "right" },
          ]}
          rows={municipioMulti.map((item) => [
            item.label,
            numberFormatter.format(item.courses),
            formatScore(
              typeof item.performanceAvg === "number"
                ? item.performanceAvg * 100
                : null
            ),
          ])}
        />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <MiniTable
          columns={[
            { label: "Municipio" },
            { label: "Perf", align: "right" },
            { label: "Prof", align: "right" },
          ]}
          rows={municipioRanking.map((item) => [
            item.label,
            formatScore(
              typeof item.performanceAvg === "number"
                ? item.performanceAvg * 100
                : null
            ),
            formatPercent(item.profAvg),
          ])}
        />
        <MiniTable
          columns={[
            { label: "Area" },
            { label: "Conceito", align: "right" },
            { label: "Prof", align: "right" },
            { label: "Taxa", align: "right" },
          ]}
          rows={capitalStats.map((item) => [
            item.label,
            item.conceptAvg ? item.conceptAvg.toFixed(2) : "-",
            formatPercent(item.profAvg),
            formatRate(item.participationRate),
          ])}
        />
      </div>
    </SectionCard>
  );
}
