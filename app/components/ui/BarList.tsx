type BarItem = {
  label: string;
  value: number;
  display?: string;
  tone?: "brand" | "soft";
};

type BarListProps = {
  items: BarItem[];
};

export default function BarList({ items }: BarListProps) {
  const max = Math.max(1, ...items.map((item) => item.value));
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="grid gap-2">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>{item.label}</span>
            <span className="font-semibold text-slate-700">
              {item.display ?? item.value.toString()}
            </span>
          </div>
          <div className="h-2 rounded-md bg-(--surface-soft)">
            <div
              className={`h-2 rounded-md ${
                item.tone === "soft" ? "bg-brand-soft" : "bg-brand"
              }`}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
