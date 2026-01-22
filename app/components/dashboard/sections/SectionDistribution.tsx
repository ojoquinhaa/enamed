import BarList from "../../ui/BarList";
import SectionCard from "../../ui/SectionCard";

type DistributionItem = {
  label: string;
  value: number;
  display: string;
};

type SectionDistributionProps = {
  items: DistributionItem[];
};

export default function SectionDistribution({ items }: SectionDistributionProps) {
  return (
    <SectionCard
      title="Distribuição Percentual"
      description="Perfil geral dos conceitos."
    >
      <BarList
        items={items.map((item) => ({
          label: item.label,
          value: item.value,
          display: item.display,
        }))}
      />
    </SectionCard>
  );
}
