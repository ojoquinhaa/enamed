import type { GroupStat } from "../../../lib/analytics";
import MiniTable from "../../ui/MiniTable";
import SectionCard from "../../ui/SectionCard";
import { formatPercent, formatRate, numberFormatter } from "../formatters";

type SectionUfIesProps = {
  ufTop: GroupStat[];
  iesTop: GroupStat[];
};

export default function SectionUfIes({ ufTop, iesTop }: SectionUfIesProps) {
  return (
    <SectionCard
      title="UF e IES"
      description="Escala e desempenho por unidade e instituicao."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <MiniTable
          columns={[
            { label: "UF" },
            { label: "Cursos", align: "right" },
            { label: "IES", align: "right" },
            { label: "Part", align: "right" },
            { label: "Conceito", align: "right" },
            { label: "Prof", align: "right" },
            { label: "Taxa", align: "right" },
          ]}
          rows={ufTop.map((item) => [
            item.label,
            numberFormatter.format(item.courses),
            numberFormatter.format(item.iesCount),
            numberFormatter.format(item.participants),
            item.conceptAvg ? item.conceptAvg.toFixed(2) : "-",
            formatPercent(item.profAvg),
            formatRate(item.participationRate),
          ])}
        />
        <MiniTable
          columns={[
            { label: "IES" },
            { label: "Cursos", align: "right" },
            { label: "Part", align: "right" },
            { label: "Conceito", align: "right" },
            { label: "Prof", align: "right" },
          ]}
          rows={iesTop.map((item) => [
            item.label,
            numberFormatter.format(item.courses),
            numberFormatter.format(item.participants),
            item.conceptAvg ? item.conceptAvg.toFixed(2) : "-",
            formatPercent(item.profAvg),
          ])}
        />
      </div>
    </SectionCard>
  );
}
