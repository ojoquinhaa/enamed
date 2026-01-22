import BarList from "../../ui/BarList";
import SectionCard from "../../ui/SectionCard";
import { percentFormatter } from "../formatters";

type BarItem = {
  label: string;
  value: number;
};

type SectionConcentrationProps = {
  ufHighConcept: BarItem[];
  ufLowConcept: BarItem[];
  participantsShareByUf: BarItem[];
  top10UfCoursesShare: number;
  top10IesParticipantsShare: number;
};

export default function SectionConcentration({
  ufHighConcept,
  ufLowConcept,
  participantsShareByUf,
  top10UfCoursesShare,
  top10IesParticipantsShare,
}: SectionConcentrationProps) {
  return (
    <SectionCard
      title="Concentracao"
      description="Conceitos altos/baixos e volume de participantes."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            C4-5 por UF
          </div>
          <BarList
            items={ufHighConcept.map((item) => ({
              label: item.label,
              value: item.value,
              display: `${percentFormatter.format(item.value)}%`,
            }))}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            C1-2 por UF
          </div>
          <BarList
            items={ufLowConcept.map((item) => ({
              label: item.label,
              value: item.value,
              display: `${percentFormatter.format(item.value)}%`,
              tone: "soft",
            }))}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Participantes por UF
          </div>
          <BarList
            items={participantsShareByUf.map((item) => ({
              label: item.label,
              value: item.value,
              display: `${percentFormatter.format(item.value)}%`,
            }))}
          />
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <div className="rounded-md border border-[color:var(--border-200)] bg-white px-4 py-3 text-sm text-slate-600">
          Top 10 UFs - cursos: {percentFormatter.format(top10UfCoursesShare)}%
        </div>
        <div className="rounded-md border border-[color:var(--border-200)] bg-white px-4 py-3 text-sm text-slate-600">
          Top 10 IES - participantes:{" "}
          {percentFormatter.format(top10IesParticipantsShare)}%
        </div>
      </div>
    </SectionCard>
  );
}
