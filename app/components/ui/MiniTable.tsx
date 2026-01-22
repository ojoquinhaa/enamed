import type { ReactNode } from "react";

type Column = {
  label: string;
  align?: "left" | "right";
};

type MiniTableProps = {
  columns: Column[];
  rows: ReactNode[][];
};

export default function MiniTable({ columns, rows }: MiniTableProps) {
  return (
    <div className="min-w-0 w-full overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-2 text-sm">
        <thead className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
          <tr>
            {columns.map((column) => (
              <th
                key={column.label}
                className={`px-3 py-2 ${
                  column.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`row-${index}`}
              className="rounded-md bg-[color:var(--surface-soft)] text-slate-700"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`cell-${index}-${cellIndex}`}
                  className={`px-3 py-2 ${
                    columns[cellIndex]?.align === "right" ? "text-right" : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
