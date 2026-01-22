import type { GroupStat } from "../../../lib/analytics";
import MiniTable from "../../ui/MiniTable";
import SectionCard from "../../ui/SectionCard";
import { formatPercent, formatRate, formatScore, percentFormatter } from "../formatters";

type SectionInstitutionalProps = {
  categoriaTop: GroupStat[];
  orgTop: GroupStat[];
  adminStats: GroupStat[];
  faculdadesUniversidades: GroupStat[];
};

const conceptPercent = (item: GroupStat, concept: string) =>
  item.courses ? (item.conceptDist[concept] ?? 0) / item.courses * 100 : 0;

export default function SectionInstitutional({
  categoriaTop,
  orgTop,
  adminStats,
  faculdadesUniversidades,
}: SectionInstitutionalProps) {
  return (
    <SectionCard
      title="Institucional"
      description="Comparativo por categoria, organização e setor."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <MiniTable
          columns={[
            { label: "Categoria" },
            { label: "C1-2", align: "right" },
            { label: "C4-5", align: "right" },
            { label: "Conceito", align: "right" },
          ]}
          rows={categoriaTop.map((item) => {
            const low = (item.conceptDist["1"] ?? 0) + (item.conceptDist["2"] ?? 0);
            const high = (item.conceptDist["4"] ?? 0) + (item.conceptDist["5"] ?? 0);
            return [
              item.label,
              item.courses
                ? `${percentFormatter.format((low / item.courses) * 100)}%`
                : "-",
              item.courses
                ? `${percentFormatter.format((high / item.courses) * 100)}%`
                : "-",
              item.conceptAvg ? item.conceptAvg.toFixed(2) : "-",
            ];
          })}
        />
        <MiniTable
          columns={[
            { label: "Grupo" },
            { label: "Conceito", align: "right" },
            { label: "Prof", align: "right" },
            { label: "Taxa", align: "right" },
          ]}
          rows={adminStats.map((item) => [
            item.label,
            item.conceptAvg ? item.conceptAvg.toFixed(2) : "-",
            formatPercent(item.profAvg),
            formatRate(item.participationRate),
          ])}
        />
        <MiniTable
          columns={[
            { label: "Org" },
            { label: "C1-2", align: "right" },
            { label: "C4-5", align: "right" },
            { label: "Conceito", align: "right" },
          ]}
          rows={orgTop.map((item) => {
            const low = (item.conceptDist["1"] ?? 0) + (item.conceptDist["2"] ?? 0);
            const high = (item.conceptDist["4"] ?? 0) + (item.conceptDist["5"] ?? 0);
            return [
              item.label,
              item.courses
                ? `${percentFormatter.format((low / item.courses) * 100)}%`
                : "-",
              item.courses
                ? `${percentFormatter.format((high / item.courses) * 100)}%`
                : "-",
              item.conceptAvg ? item.conceptAvg.toFixed(2) : "-",
            ];
          })}
        />
      </div>
      <div className="mt-6">
        <MiniTable
          columns={[
            { label: "Grupo" },
            { label: "C5", align: "right" },
            { label: "C1-2", align: "right" },
            { label: "Perf", align: "right" },
          ]}
          rows={faculdadesUniversidades.map((item) => {
            const high = item.courses
              ? ((item.conceptDist["5"] ?? 0) / item.courses) * 100
              : 0;
            const low = item.courses
              ? ((item.conceptDist["1"] ?? 0) + (item.conceptDist["2"] ?? 0)) /
                  item.courses *
                100
              : 0;
            return [
              item.label,
              `${percentFormatter.format(high)}%`,
              `${percentFormatter.format(low)}%`,
              formatScore(
                typeof item.performanceAvg === "number"
                  ? item.performanceAvg * 100
                  : null
              ),
            ];
          })}
        />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <MiniTable
          columns={[
            { label: "Categoria" },
            { label: "C1", align: "right" },
            { label: "C2", align: "right" },
            { label: "C3", align: "right" },
            { label: "C4", align: "right" },
            { label: "C5", align: "right" },
          ]}
          rows={categoriaTop.map((item) => [
            item.label,
            `${percentFormatter.format(conceptPercent(item, "1"))}%`,
            `${percentFormatter.format(conceptPercent(item, "2"))}%`,
            `${percentFormatter.format(conceptPercent(item, "3"))}%`,
            `${percentFormatter.format(conceptPercent(item, "4"))}%`,
            `${percentFormatter.format(conceptPercent(item, "5"))}%`,
          ])}
        />
        <MiniTable
          columns={[
            { label: "Org" },
            { label: "C1", align: "right" },
            { label: "C2", align: "right" },
            { label: "C3", align: "right" },
            { label: "C4", align: "right" },
            { label: "C5", align: "right" },
          ]}
          rows={orgTop.map((item) => [
            item.label,
            `${percentFormatter.format(conceptPercent(item, "1"))}%`,
            `${percentFormatter.format(conceptPercent(item, "2"))}%`,
            `${percentFormatter.format(conceptPercent(item, "3"))}%`,
            `${percentFormatter.format(conceptPercent(item, "4"))}%`,
            `${percentFormatter.format(conceptPercent(item, "5"))}%`,
          ])}
        />
      </div>
    </SectionCard>
  );
}
