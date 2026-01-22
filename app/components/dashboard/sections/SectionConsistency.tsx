import type { GroupStat } from "../../../lib/analytics";
import MiniTable from "../../ui/MiniTable";
import SectionCard from "../../ui/SectionCard";

type ConsistencyRow = GroupStat & { consistency: number | null };

type SectionConsistencyProps = {
  iesConsistency: ConsistencyRow[];
};

export default function SectionConsistency({ iesConsistency }: SectionConsistencyProps) {
  return (
    <SectionCard
      title="Consistencia"
      description="Variacao interna por IES."
    >
      <MiniTable
        columns={[
          { label: "IES" },
          { label: "Indice", align: "right" },
        ]}
        rows={iesConsistency
          .filter((item) => typeof item.consistency === "number")
          .sort((a, b) => (a.consistency ?? 0) - (b.consistency ?? 0))
          .slice(0, 10)
          .map((item) => [
            item.label,
            item.consistency ? item.consistency.toFixed(2) : "-",
          ])}
      />
    </SectionCard>
  );
}
