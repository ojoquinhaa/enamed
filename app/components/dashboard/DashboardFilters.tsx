import type { FilterState, OptionItem } from "./types";

type FilterOptions = {
  ufs: OptionItem[];
  ies: OptionItem[];
  organizacoes: OptionItem[];
  categorias: OptionItem[];
};

type DashboardFiltersProps = {
  filters: FilterState;
  options: FilterOptions;
  onChange: (next: Partial<FilterState>) => void;
  onClear: () => void;
  resultCount: number;
};

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: OptionItem[];
}) => (
  <label className="flex min-w-0 flex-col gap-2 text-sm text-slate-600">
    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
      {label}
    </span>
    <select
      className="w-full rounded-md border border-[color:var(--border-200)] bg-white px-3 py-2 text-sm text-slate-700 focus:border-[color:var(--brand-900)] focus:outline-none"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={`${label}-${option.value}`} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

export default function DashboardFilters({
  filters,
  options,
  onChange,
  onClear,
  resultCount,
}: DashboardFiltersProps) {
  return (
    <section className="rounded-md border border-[color:var(--border-200)] bg-white p-5">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <FilterSelect
            label="UF"
            value={filters.uf}
            onChange={(value) => onChange({ uf: value })}
            options={options.ufs}
          />
          <FilterSelect
            label="IES"
            value={filters.ies}
            onChange={(value) => onChange({ ies: value })}
            options={options.ies}
          />
          <FilterSelect
            label="Organizacao"
            value={filters.organizacao}
            onChange={(value) => onChange({ organizacao: value })}
            options={options.organizacoes}
          />
          <FilterSelect
            label="Categoria"
            value={filters.categoria}
            onChange={(value) => onChange({ categoria: value })}
            options={options.categorias}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-4 rounded-md border border-[color:var(--border-200)] bg-[color:var(--surface-soft)] p-4">
          <label className="flex min-w-0 flex-col gap-2 text-sm text-slate-600">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Busca
            </span>
            <input
              className="w-full rounded-md border border-[color:var(--border-200)] bg-white px-3 py-2 text-sm text-slate-700 focus:border-[color:var(--brand-900)] focus:outline-none"
              placeholder="IES, municipio ou sigla"
              value={filters.search}
              onChange={(event) => onChange({ search: event.target.value })}
            />
          </label>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-slate-600">
              {resultCount} registros
            </span>
            <button
              className="rounded-md border border-[color:var(--border-200)] px-3 py-1 font-semibold text-slate-600 transition hover:border-[color:var(--brand-900)] hover:text-[color:var(--brand-900)]"
              type="button"
              onClick={onClear}
            >
              Limpar filtros
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
