import type { CourseStat, GroupStat } from "../../../lib/analytics";
import MiniTable from "../../ui/MiniTable";
import SectionCard from "../../ui/SectionCard";
import { formatPercent, formatScore } from "../formatters";

type SectionOutliersProps = {
  concept5LowProf: CourseStat[];
  concept3HighProf: CourseStat[];
  ufFewHigh: GroupStat[];
  iesManyLow: GroupStat[];
  smallCoursesHighPerf: CourseStat[];
};

export default function SectionOutliers({
  concept5LowProf,
  concept3HighProf,
  ufFewHigh,
  iesManyLow,
  smallCoursesHighPerf,
}: SectionOutliersProps) {
  const emptyRow: [string, string] = ["Sem dados", "-"];
  return (
    <SectionCard
      title="Destaques e Excecoes"
      description="Casos fora da curva por conceito, escala e prof."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <MiniTable
          columns={[
            { label: "Conceito 5" },
            { label: "Prof", align: "right" },
          ]}
          rows={
            concept5LowProf.length
              ? concept5LowProf.map((item) => [
                  `${item.ies} - ${item.municipio}`,
                  formatPercent(item.proficiencia),
                ])
              : [emptyRow]
          }
        />
        <MiniTable
          columns={[
            { label: "Conceito 3" },
            { label: "Prof", align: "right" },
          ]}
          rows={
            concept3HighProf.length
              ? concept3HighProf.map((item) => [
                  `${item.ies} - ${item.municipio}`,
                  formatPercent(item.proficiencia),
                ])
              : [emptyRow]
          }
        />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <MiniTable
          columns={[
            { label: "UF baixo volume" },
            { label: "Perf", align: "right" },
          ]}
          rows={
            ufFewHigh.length
              ? ufFewHigh.map((item) => [
                  item.label,
                  formatScore(
                    typeof item.performanceAvg === "number"
                      ? item.performanceAvg * 100
                      : null,
                  ),
                ])
              : [emptyRow]
          }
        />
        <MiniTable
          columns={[
            { label: "IES alto volume" },
            { label: "Perf", align: "right" },
          ]}
          rows={
            iesManyLow.length
              ? iesManyLow.map((item) => [
                  item.label,
                  formatScore(
                    typeof item.performanceAvg === "number"
                      ? item.performanceAvg * 100
                      : null,
                  ),
                ])
              : [emptyRow]
          }
        />
        <MiniTable
          columns={[
            { label: "Cursos pequenos" },
            { label: "Perf", align: "right" },
          ]}
          rows={
            smallCoursesHighPerf.length
              ? smallCoursesHighPerf.map((item) => [
                  `${item.ies} - ${item.municipio}`,
                  formatScore(
                    typeof item.performance === "number"
                      ? item.performance * 100
                      : null,
                  ),
                ])
              : [emptyRow]
          }
        />
      </div>
    </SectionCard>
  );
}
