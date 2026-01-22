"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import type { EnamedOptions, EnamedRow } from "../../lib/enamed-types";

type TableClientProps = {
  rows: EnamedRow[];
  options: EnamedOptions;
};

type FilterState = {
  uf: string;
  ies: string;
  organizacao: string;
  categoria: string;
  search: string;
};

type OptionItem = {
  label: string;
  value: string;
};

type ColumnFilters = {
  organizacao: Array<"publica" | "privada" | "outras">;
  conceitos: number[];
};

const numberFormatter = new Intl.NumberFormat("pt-BR");
const percentFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const formatPercent = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return "-";
  return `${percentFormatter.format(value)}%`;
};

const buildOptions = (values: string[], allLabel: string): OptionItem[] => [
  { label: allLabel, value: "all" },
  ...values.map((value) => ({ label: value, value })),
];

const normalizeKey = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const getOrgGroup = (value: string | null) => {
  const normalized = normalizeKey(String(value ?? ""));
  if (!normalized) return "outras";
  if (normalized.includes("publica")) return "publica";
  if (normalized.includes("privada")) return "privada";
  return "outras";
};

const toggleSelection = <T extends string | number>(values: T[], value: T) =>
  values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];

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
      className="w-full min-w-0 rounded-md border border-border bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none"
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

const HeaderDropdown = ({
  label,
  align = "right",
  children,
}: {
  label: string;
  align?: "left" | "right";
  children: ReactNode;
}) => (
  <details className="relative">
    <summary className="flex h-6 w-6 cursor-pointer list-none items-center justify-center rounded-full text-slate-400 transition hover:bg-(--surface-soft) hover:text-slate-600 [&::-webkit-details-marker]:hidden">
      <span className="sr-only">{label}</span>
      <ChevronDownIcon className="h-3 w-3" />
    </summary>
    <div
      className={`absolute z-20 mt-2 min-w-40 rounded-md border border-border bg-white p-2 text-[11px] text-slate-600 shadow-sm ${
        align === "left" ? "left-0" : "right-0"
      }`}
    >
      {children}
    </div>
  </details>
);

const DropdownTitle = ({ label }: { label: string }) => (
  <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
    {label}
  </div>
);

const DropdownButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    className={`flex w-full items-center justify-between rounded px-2 py-1 text-left font-semibold transition ${
      active
        ? "bg-(--surface-soft) text-slate-700"
        : "text-slate-600 hover:bg-slate-50"
    }`}
    type="button"
    onClick={onClick}
  >
    {label}
  </button>
);

const CheckboxOption = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <label className="flex items-center gap-2 rounded px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-50">
    <input
      className="h-3 w-3 rounded border border-border text-brand"
      type="checkbox"
      checked={checked}
      onChange={onChange}
    />
    <span>{label}</span>
  </label>
);

const conceptTone = (value: string) => {
  const numeric = Number(value);
  if (numeric >= 4) return "bg-emerald-100 text-emerald-700";
  if (numeric === 3) return "bg-teal-100 text-teal-700";
  if (numeric === 2) return "bg-amber-100 text-amber-700";
  if (numeric === 1) return "bg-rose-100 text-rose-700";
  return "bg-slate-100 text-slate-600";
};

export default function TableClient({ rows, options }: TableClientProps) {
  const defaultFilters: FilterState = {
    uf: "all",
    ies: "all",
    organizacao: "all",
    categoria: "all",
    search: "",
  };
  const defaultColumnFilters: ColumnFilters = {
    organizacao: [],
    conceitos: [],
  };
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFilters>(defaultColumnFilters);
  const [sortBy, setSortBy] = useState("percentual");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const ufOptions = useMemo(
    () => buildOptions(options.ufs, "Todas as UFs"),
    [options.ufs],
  );
  const iesOptions = useMemo(
    () => buildOptions(options.ies, "Todas as IES"),
    [options.ies],
  );
  const orgOptions = useMemo(
    () => buildOptions(options.organizacoes, "Todas as organizações"),
    [options.organizacoes],
  );
  const categoriaOptions = useMemo(
    () => buildOptions(options.categorias, "Todas as categorias"),
    [options.categorias],
  );

  const filteredRows = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();
    return rows.filter((row) => {
      if (filters.uf !== "all" && row.uf !== filters.uf) return false;
      if (filters.ies !== "all" && row.nomeIes !== filters.ies) return false;
      if (
        filters.organizacao !== "all" &&
        row.organizacaoAcademica !== filters.organizacao
      )
        return false;
      if (
        filters.categoria !== "all" &&
        row.categoriaAdministrativa !== filters.categoria
      )
        return false;
      if (columnFilters.organizacao.length) {
        const orgGroup = getOrgGroup(row.categoriaAdministrativa);
        if (!columnFilters.organizacao.includes(orgGroup)) return false;
      }
      if (columnFilters.conceitos.length) {
        const conceito = Number(row.conceito);
        if (Number.isNaN(conceito)) return false;
        if (!columnFilters.conceitos.includes(conceito)) return false;
      }
      if (!searchTerm) return true;
      const haystack =
        `${row.nomeIes} ${row.siglaIes} ${row.municipioCurso}`.toLowerCase();
      return haystack.includes(searchTerm);
    });
  }, [columnFilters, filters, rows]);

  const sortedRows = useMemo(() => {
    const sorted = [...filteredRows];
    const multiplier = direction === "asc" ? 1 : -1;
    sorted.sort((a, b) => {
      if (sortBy === "percentual") {
        const aValue = a.percentualAcimaProficiencia ?? -Infinity;
        const bValue = b.percentualAcimaProficiencia ?? -Infinity;
        return (aValue - bValue) * multiplier;
      }
      if (sortBy === "participantes") {
        const aValue = a.participantes ?? -Infinity;
        const bValue = b.participantes ?? -Infinity;
        return (aValue - bValue) * multiplier;
      }
      const aValue = Number(a.conceito) || 0;
      const bValue = Number(b.conceito) || 0;
      return (aValue - bValue) * multiplier;
    });
    return sorted;
  }, [direction, filteredRows, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [page, pageSize, sortedRows]);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <section className="rounded-md border border-border bg-white p-5">
        <div className="grid min-w-0 gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            <FilterSelect
              label="UF"
              value={filters.uf}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, uf: value }))
              }
              options={ufOptions}
            />
            <FilterSelect
              label="IES"
              value={filters.ies}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, ies: value }))
              }
              options={iesOptions}
            />
            <FilterSelect
              label="Organização"
              value={filters.organizacao}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, organizacao: value }))
              }
              options={orgOptions}
            />
            <FilterSelect
              label="Categoria"
              value={filters.categoria}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, categoria: value }))
              }
              options={categoriaOptions}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-4 rounded-md border border-border bg-(--surface-soft) p-4">
            <label className="flex min-w-0 flex-col gap-2 text-sm text-slate-600">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Busca
              </span>
              <input
                className="w-full min-w-0 rounded-md border border-border bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none"
                placeholder="IES, município ou sigla"
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: event.target.value,
                  }))
                }
              />
            </label>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                {filteredRows.length} registros
              </span>
              <button
                className="rounded-md border border-border px-3 py-1 font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
                type="button"
                onClick={() => {
                  setFilters(defaultFilters);
                  setColumnFilters(defaultColumnFilters);
                }}
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-border bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
          <div className="rounded-md border border-border bg-(--surface-soft) px-4 py-2 text-xs font-semibold text-slate-600">
            Página {page} de {totalPages}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-sm">
            <thead className="text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-4 py-2 text-left">Instituicao</th>
                <th className="px-4 py-2 text-left">Localidade</th>
                <th className="px-4 py-2 text-left">
                  <div className="inline-flex items-center gap-2">
                    <span>Organização</span>
                    <HeaderDropdown label="Filtrar organização" align="left">
                      <DropdownTitle label="Organização" />
                      <CheckboxOption
                        label="Publica"
                        checked={columnFilters.organizacao.includes("publica")}
                        onChange={() =>
                          setColumnFilters((prev) => ({
                            ...prev,
                            organizacao: toggleSelection(
                              prev.organizacao,
                              "publica",
                            ),
                          }))
                        }
                      />
                      <CheckboxOption
                        label="Privada"
                        checked={columnFilters.organizacao.includes("privada")}
                        onChange={() =>
                          setColumnFilters((prev) => ({
                            ...prev,
                            organizacao: toggleSelection(
                              prev.organizacao,
                              "privada",
                            ),
                          }))
                        }
                      />
                      <CheckboxOption
                        label="Outras"
                        checked={columnFilters.organizacao.includes("outras")}
                        onChange={() =>
                          setColumnFilters((prev) => ({
                            ...prev,
                            organizacao: toggleSelection(
                              prev.organizacao,
                              "outras",
                            ),
                          }))
                        }
                      />
                      <button
                        className="mt-2 w-full rounded px-2 py-1 text-left text-[11px] font-semibold text-slate-500 transition hover:bg-slate-50"
                        type="button"
                        onClick={() =>
                          setColumnFilters((prev) => ({
                            ...prev,
                            organizacao: [],
                          }))
                        }
                      >
                        Limpar filtro
                      </button>
                    </HeaderDropdown>
                  </div>
                </th>
                <th className="px-4 py-2 text-right">
                  <div className="inline-flex items-center justify-end gap-2">
                    <span>Participantes</span>
                    <HeaderDropdown label="Ordenar participantes">
                      <DropdownTitle label="Ordenação" />
                      <DropdownButton
                        label="Maior"
                        active={
                          sortBy === "participantes" && direction === "desc"
                        }
                        onClick={() => {
                          setSortBy("participantes");
                          setDirection("desc");
                        }}
                      />
                      <DropdownButton
                        label="Menor"
                        active={
                          sortBy === "participantes" && direction === "asc"
                        }
                        onClick={() => {
                          setSortBy("participantes");
                          setDirection("asc");
                        }}
                      />
                      <DropdownButton
                        label="Padrao"
                        active={sortBy === "percentual" && direction === "desc"}
                        onClick={() => {
                          setSortBy("percentual");
                          setDirection("desc");
                        }}
                      />
                    </HeaderDropdown>
                  </div>
                </th>
                <th className="px-4 py-2 text-right">
                  <div className="inline-flex items-center justify-end gap-2">
                    <span>% Proficiência</span>
                    <HeaderDropdown label="Ordenar proficiência">
                      <DropdownTitle label="Ordenação" />
                      <DropdownButton
                        label="Maior"
                        active={sortBy === "percentual" && direction === "desc"}
                        onClick={() => {
                          setSortBy("percentual");
                          setDirection("desc");
                        }}
                      />
                      <DropdownButton
                        label="Menor"
                        active={sortBy === "percentual" && direction === "asc"}
                        onClick={() => {
                          setSortBy("percentual");
                          setDirection("asc");
                        }}
                      />
                    </HeaderDropdown>
                  </div>
                </th>
                <th className="px-4 py-2 text-right">
                  <div className="inline-flex items-center justify-end gap-2">
                    <span>Conceito</span>
                    <HeaderDropdown label="Filtrar conceito">
                      <DropdownTitle label="Conceito" />
                      <div className="grid grid-cols-2 gap-1">
                        {[5, 4, 3, 2, 1].map((value) => (
                          <CheckboxOption
                            key={`conceito-${value}`}
                            label={String(value)}
                            checked={columnFilters.conceitos.includes(value)}
                            onChange={() =>
                              setColumnFilters((prev) => ({
                                ...prev,
                                conceitos: toggleSelection(
                                  prev.conceitos,
                                  value,
                                ),
                              }))
                            }
                          />
                        ))}
                      </div>
                      <button
                        className="mt-2 w-full rounded px-2 py-1 text-left text-[11px] font-semibold text-slate-500 transition hover:bg-slate-50"
                        type="button"
                        onClick={() =>
                          setColumnFilters((prev) => ({
                            ...prev,
                            conceitos: [],
                          }))
                        }
                      >
                        Limpar filtro
                      </button>
                    </HeaderDropdown>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, index) => (
                <tr
                  key={`${row.codigoCurso}-${index}`}
                  className="rounded-md bg-(--surface-soft) text-slate-700"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">
                      {row.nomeIes}
                    </p>
                    <p className="text-xs text-slate-500">{row.siglaIes}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-700">{row.uf}</p>
                    <p className="text-xs text-slate-500">
                      {row.municipioCurso}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-700">
                      {row.organizacaoAcademica || "-"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {row.categoriaAdministrativa || "-"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-700">
                    {numberFormatter.format(row.participantes ?? 0)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-brand">
                    {formatPercent(row.percentualAcimaProficiencia)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${conceptTone(
                        row.conceito,
                      )}`}
                    >
                      {row.conceito || "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pageRows.length === 0 ? (
            <div className="mt-6 rounded-md border border-border bg-white p-6 text-center text-sm text-slate-500">
              Sem dados.
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Mostrando {pageRows.length} de {filteredRows.length} registros.
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-border px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Anterior
            </button>
            <button
              className="rounded-md border border-border px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Próxima
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
