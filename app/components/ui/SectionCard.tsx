import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description?: string;
  right?: ReactNode;
  children: ReactNode;
};

export default function SectionCard({
  title,
  description,
  right,
  children,
}: SectionCardProps) {
  return (
    <section className="min-w-0 rounded-md border border-border bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
            {title}
          </h2>
          {description ? (
            <p className="text-xs text-slate-500">{description}</p>
          ) : null}
        </div>
        {right ? <div className="text-xs text-slate-500">{right}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
