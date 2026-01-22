import type { GroupStat } from "../../../lib/analytics";
import MiniTable from "../../ui/MiniTable";
import SectionCard from "../../ui/SectionCard";
import StatGrid from "../../ui/StatGrid";
import { formatRate } from "../formatters";

type SectionParticipationProps = {
  corrParticipationConcept: number | null;
  corrParticipationProf: number | null;
  corrParticipationPerf: number | null;
  ufLowParticipation: GroupStat[];
  iesFullParticipation: GroupStat[];
};

export default function SectionParticipation({
  corrParticipationConcept,
  corrParticipationProf,
  corrParticipationPerf,
  ufLowParticipation,
  iesFullParticipation,
}: SectionParticipationProps) {
  return (
    <SectionCard
      title="Participação"
      description="Taxa de adesão e impacto no desempenho."
    >
      <div className="flex flex-col gap-4">
        <div className="mx-auto w-full max-w-xl">
          <StatGrid
            items={[
              {
                label: "Taxa x Conceito",
                value:
                  corrParticipationConcept === null
                    ? "-"
                    : corrParticipationConcept.toFixed(2),
                hint:
                  "Quase nenhuma relação entre taxa de participação e conceito.",
              },
              {
                label: "Taxa x Prof",
                value:
                  corrParticipationProf === null
                    ? "-"
                    : corrParticipationProf.toFixed(2),
                hint:
                  "Quase nenhuma relação entre taxa de participação e proficiência.",
              },
              {
                label: "Taxa x Perf",
                value:
                  corrParticipationPerf === null
                    ? "-"
                    : corrParticipationPerf.toFixed(2),
                hint:
                  "Quase nenhuma relação entre taxa de participação e performance.",
              },
            ]}
            columns="grid gap-2 sm:grid-cols-3"
            size="compact"
            align="center"
          />
        </div>
        <MiniTable
          columns={[
            { label: "UF" },
            { label: "Taxa", align: "right" },
          ]}
          rows={ufLowParticipation.map((item) => [
            item.label,
            formatRate(item.participationRate),
          ])}
        />
      </div>
      <div className="mt-6">
        <MiniTable
          columns={[
            { label: "IES" },
            { label: "Taxa", align: "right" },
          ]}
          rows={iesFullParticipation.map((item) => [
            item.label,
            formatRate(item.participationRate),
          ])}
        />
      </div>
    </SectionCard>
  );
}
