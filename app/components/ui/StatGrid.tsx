type StatItem = {
  label: string;
  value: string;
  tone?: "default" | "brand";
  hint?: string;
};

type StatGridProps = {
  items: StatItem[];
  columns?: string;
  size?: "default" | "compact";
  align?: "left" | "center";
};

const sizeStyles = {
  default: {
    card: "px-4 py-3",
    label: "text-[11px]",
    value: "mt-2 text-xl",
  },
  compact: {
    card: "px-3 py-2",
    label: "text-[10px]",
    value: "mt-1 text-lg",
  },
};

export default function StatGrid({
  items,
  columns,
  size = "default",
  align = "left",
}: StatGridProps) {
  const styles = sizeStyles[size];
  return (
    <div className={columns ?? "grid gap-3 md:grid-cols-2 xl:grid-cols-4"}>
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-md border border-[color:var(--border-200)] bg-white ${styles.card} ${
            align === "center" ? "text-center" : ""
          }`}
        >
          <p
            className={`${styles.label} uppercase tracking-[0.2em] text-slate-500`}
          >
            {item.label}
          </p>
          <p
            className={`${styles.value} font-semibold ${
              item.tone === "brand"
                ? "text-[color:var(--brand-900)]"
                : "text-slate-900"
            }`}
          >
            {item.value}
          </p>
          {item.hint ? (
            <p className="mt-1 text-[10px] text-slate-500">{item.hint}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
