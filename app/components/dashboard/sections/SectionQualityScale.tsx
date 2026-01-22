import type { GroupStat } from "../../../lib/analytics";
import MiniTable from "../../ui/MiniTable";
import SectionCard from "../../ui/SectionCard";
import StatGrid from "../../ui/StatGrid";
import { formatPercent, formatScore, numberFormatter } from "../formatters";

type SectionQualityScaleProps = {
  corrParticipantsConcept: number | null;
  corrParticipantsProf: number | null;
  corrParticipantsPerf: number | null;
  corrIesCoursesPerformance: number | null;
  smallCourseConcept: number | null;
  smallCourseProf: number | null;
  smallCoursePerf: number | null;
  largeCourseConcept: number | null;
  largeCourseProf: number | null;
  largeCoursePerf: number | null;
  ufTopByCourses: GroupStat[];
};

export default function SectionQualityScale({
  corrParticipantsConcept,
  corrParticipantsProf,
  corrParticipantsPerf,
  corrIesCoursesPerformance,
  smallCourseConcept,
  smallCourseProf,
  smallCoursePerf,
  largeCourseConcept,
  largeCourseProf,
  largeCoursePerf,
  ufTopByCourses,
}: SectionQualityScaleProps) {
  return (
    <SectionCard
      title="Qualidade vs Escala"
      description="Relação entre tamanho, participação e desempenho."
    >
      <div className="flex flex-col gap-4">
        <div className="mx-auto w-full max-w-2xl">
          <StatGrid
            items={[
              {
                label: "Part x Conceito",
                value:
                  corrParticipantsConcept === null
                    ? "-"
                    : corrParticipantsConcept.toFixed(2),
                hint:
                  "Cursos com mais participantes tendem a ter conceito um pouco menor; relação fraca.",
              },
              {
                label: "Part x Prof",
                value:
                  corrParticipantsProf === null
                    ? "-"
                    : corrParticipantsProf.toFixed(2),
                hint:
                  "Mais participantes tende a menor % de proficiência; relação fraca.",
              },
              {
                label: "Part x Perf",
                value:
                  corrParticipantsPerf === null
                    ? "-"
                    : corrParticipantsPerf.toFixed(2),
                hint:
                  "Mais participantes tende a menor performance; relação fraca.",
              },
              {
                label: "IES Cursos x Perf",
                value:
                  corrIesCoursesPerformance === null
                    ? "-"
                    : corrIesCoursesPerformance.toFixed(2),
                hint:
                  "Quase nenhuma relação entre qtde de cursos por IES e performance média.",
              },
            ]}
            columns="grid gap-2 sm:grid-cols-2"
            size="compact"
            align="center"
          />
        </div>
        <MiniTable
          columns={[
            { label: "Grupo" },
            { label: "Conceito", align: "right" },
            { label: "Prof", align: "right" },
            { label: "Perf", align: "right" },
          ]}
          rows={[
            [
              "Cursos pequenos",
              smallCourseConcept ? smallCourseConcept.toFixed(2) : "-",
              formatPercent(smallCourseProf),
              formatScore(smallCoursePerf),
            ],
            [
              "Cursos grandes",
              largeCourseConcept ? largeCourseConcept.toFixed(2) : "-",
              formatPercent(largeCourseProf),
              formatScore(largeCoursePerf),
            ],
          ]}
        />
      </div>
      <div className="mt-6">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Estados com mais cursos
        </div>
        <MiniTable
          columns={[
            { label: "UF" },
            { label: "Cursos", align: "right" },
            { label: "Perf", align: "right" },
          ]}
          rows={ufTopByCourses.map((item) => [
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
    </SectionCard>
  );
}
