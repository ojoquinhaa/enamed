"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { EnamedOptions, EnamedRow } from "../../lib/enamed-types";
import {
  buildCourseStats,
  buildGroupStats,
  getExcellenceIndex,
  getStdDev,
} from "../../lib/analytics";
import MiniTable from "../ui/MiniTable";
import SectionCard from "../ui/SectionCard";

type RankingClientProps = {
  rows: EnamedRow[];
  options: EnamedOptions;
};

type FilterState = {
  uf: string;
  organizacao: string;
  categoria: string;
  search: string;
};

type OptionItem = {
  label: string;
  value: string;
};

type SortOrder = "desc" | "asc";

const numberFormatter = new Intl.NumberFormat("pt-BR");
const percentFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const formatPercent = (value: number | null) =>
  value === null ? "-" : `${percentFormatter.format(value)}%`;

const formatScore = (value: number | null) =>
  value === null ? "-" : percentFormatter.format(value);

const SAMPLE_PIVOT = 200;

const buildOptions = (values: string[], allLabel: string): OptionItem[] => [
  { label: allLabel, value: "all" },
  ...values.map((value) => ({ label: value, value })),
];

const orderOptions: OptionItem[] = [
  { label: "Decrescente", value: "desc" },
  { label: "Crescente", value: "asc" },
];

const getSampleWeight = (participants: number) =>
  participants > 0 ? participants / (participants + SAMPLE_PIVOT) : 0;

const compareNumbers = (
  a: number | null,
  b: number | null,
  order: SortOrder,
) => {
  const fallback = order === "desc" ? -Infinity : Infinity;
  const aVal = typeof a === "number" ? a : fallback;
  const bVal = typeof b === "number" ? b : fallback;
  if (aVal === bVal) return 0;
  return order === "desc" ? bVal - aVal : aVal - bVal;
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
  <label className="flex flex-col gap-2 text-sm text-slate-600">
    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
      {label}
    </span>
    <select
      className="rounded-md border border-[color:var(--border-200)] bg-white px-3 py-2 text-sm text-slate-700 focus:border-[color:var(--brand-900)] focus:outline-none"
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

export default function RankingClient({ rows, options }: RankingClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    uf: "all",
    organizacao: "all",
    categoria: "all",
    search: "",
  });
  const [page, setPage] = useState(1);
  const [rankOrder, setRankOrder] = useState<SortOrder>("desc");
  const pageSize = 15;

  const ufOptions = useMemo(
    () => buildOptions(options.ufs, "Todas as UFs"),
    [options.ufs],
  );
  const orgOptions = useMemo(
    () => buildOptions(options.organizacoes, "Todas as organizacoes"),
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
      if (!searchTerm) return true;
      return row.nomeIes.toLowerCase().includes(searchTerm);
    });
  }, [filters, rows]);

  const courseStats = useMemo(
    () => buildCourseStats(filteredRows),
    [filteredRows],
  );

  const overallScore = useMemo(() => {
    let conceptSum = 0;
    let conceptWeight = 0;
    let profSum = 0;
    let profWeight = 0;
    for (const course of courseStats) {
      if (typeof course.conceito === "number" && course.participantes > 0) {
        conceptSum += course.conceito * course.participantes;
        conceptWeight += course.participantes;
      }
      if (typeof course.proficiencia === "number" && course.participantes > 0) {
        profSum += course.proficiencia * course.participantes;
        profWeight += course.participantes;
      }
    }
    const conceptWeighted = conceptWeight ? conceptSum / conceptWeight : null;
    const profWeighted = profWeight ? profSum / profWeight : null;
    return getExcellenceIndex(conceptWeighted, profWeighted);
  }, [courseStats]);

  const getAdjustedScore = useCallback(
    (scoreRaw: number | null, participants: number) => {
      if (scoreRaw === null) return null;
      if (overallScore === null) return scoreRaw;
      const sampleWeight = getSampleWeight(participants);
      return scoreRaw * sampleWeight + overallScore * (1 - sampleWeight);
    },
    [overallScore],
  );

  const iesStats = useMemo(
    () =>
      buildGroupStats(
        filteredRows,
        (row) => row.nomeIes || "ND",
        (row) => row.nomeIes || "ND",
      ),
    [filteredRows],
  );

  const ufStats = useMemo(
    () =>
      buildGroupStats(
        filteredRows,
        (row) => row.uf || "ND",
        (row) => row.uf || "ND",
      ),
    [filteredRows],
  );

  const iesUfMap = useMemo(() => {
    const counts = new Map<string, Map<string, number>>();
    for (const row of filteredRows) {
      if (!row.nomeIes || !row.uf) continue;
      const byUf = counts.get(row.nomeIes) ?? new Map<string, number>();
      byUf.set(row.uf, (byUf.get(row.uf) ?? 0) + 1);
      counts.set(row.nomeIes, byUf);
    }
    const map = new Map<string, string>();
    for (const [ies, byUf] of counts.entries()) {
      let bestUf = "-";
      let bestCount = 0;
      for (const [uf, count] of byUf.entries()) {
        if (count > bestCount) {
          bestUf = uf;
          bestCount = count;
        }
      }
      map.set(ies, bestUf);
    }
    return map;
  }, [filteredRows]);

  const iesRanking = useMemo(() => {
    return iesStats
      .map((item) => {
        const conceptBase = item.conceptWeighted ?? item.conceptAvg;
        const profBase = item.profWeighted ?? item.profAvg;
        const scoreRaw = getExcellenceIndex(conceptBase, profBase);
        const sampleWeight = getSampleWeight(item.participants);
        const scoreAdjusted = getAdjustedScore(scoreRaw, item.participants);
        const efficiencyBase = scoreAdjusted ?? scoreRaw;
        const efficiency =
          efficiencyBase === null
            ? null
            : efficiencyBase / Math.log1p(item.participants || 1);
        return {
          ...item,
          score: scoreAdjusted,
          scoreRaw,
          sampleWeight,
          efficiency,
        };
      })
      .sort((a, b) => compareNumbers(a.score, b.score, rankOrder));
  }, [getAdjustedScore, iesStats, rankOrder]);

  const totalPages = Math.max(1, Math.ceil(iesRanking.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return iesRanking.slice(start, start + pageSize);
  }, [page, pageSize, iesRanking]);

  const topIesByEfficiency = useMemo(
    () =>
      [...iesRanking]
        .filter((item) => typeof item.efficiency === "number")
        .sort((a, b) => compareNumbers(a.efficiency, b.efficiency, rankOrder))
        .slice(0, 10),
    [iesRanking, rankOrder],
  );

  const ufRanking = useMemo(
    () =>
      ufStats
        .map((item) => {
          const scoreRaw = getExcellenceIndex(
            item.conceptWeighted,
            item.profWeighted,
          );
          const scoreAdjusted = getAdjustedScore(scoreRaw, item.participants);
          return {
            ...item,
            scoreRaw,
            score: scoreAdjusted ?? scoreRaw,
          };
        })
        .filter((item) => typeof item.score === "number")
        .sort((a, b) => compareNumbers(a.score, b.score, rankOrder))
        .slice(0, 10),
    [getAdjustedScore, rankOrder, ufStats],
  );

  const courseRanking = useMemo(
    () =>
      courseStats
        .map((course) => {
          const scoreRaw = getExcellenceIndex(
            course.conceito,
            course.proficiencia,
          );
          const scoreAdjusted = getAdjustedScore(
            scoreRaw,
            course.participantes,
          );
          return {
            ...course,
            scoreRaw,
            score: scoreAdjusted ?? scoreRaw,
          };
        })
        .filter((course) => typeof course.score === "number")
        .sort((a, b) => compareNumbers(a.score, b.score, rankOrder))
        .slice(0, 10),
    [courseStats, getAdjustedScore, rankOrder],
  );

  const iesConsistency = useMemo(() => {
    const map = new Map<string, number[]>();
    for (const course of courseStats) {
      if (typeof course.performance !== "number") continue;
      const current = map.get(course.ies) ?? [];
      current.push(course.performance * 100);
      map.set(course.ies, current);
    }
    return iesRanking
      .map((item) => ({
        ...item,
        consistency: getStdDev(map.get(item.label) ?? []),
      }))
      .filter((item) => typeof item.consistency === "number")
      .sort((a, b) => (a.consistency ?? 0) - (b.consistency ?? 0))
      .slice(0, 10);
  }, [courseStats, iesRanking]);

  useEffect(() => {
    setPage(1);
  }, [filters, rankOrder]);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-md border border-[color:var(--border-200)] bg-[color:var(--surface-soft)] p-4 text-xs text-slate-600">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Legenda e calculos
        </div>
        <div className="mt-2 grid gap-1">
          <p>
            <span className="font-semibold text-slate-700">Score</span>: 100 x
            media(conceito/5, prof/100).
          </p>
          <p>
            <span className="font-semibold text-slate-700">Score Aj.</span>:
            Score x w + Score Geral x (1-w), w = participantes/(participantes +
            200).
          </p>
          <p>
            <span className="font-semibold text-slate-700">Prof</span>: % acima
            da proficiencia.{" "}
            <span className="font-semibold text-slate-700">Conceito</span>: 1 a
            5.
          </p>
          <p>
            <span className="font-semibold text-slate-700">Indice</span>: Score
            Aj./ln(1+participantes).
          </p>
        </div>
      </section>
      <section className="rounded-md border border-[color:var(--border-200)] bg-white p-5">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="grid gap-4 md:grid-cols-2">
            <FilterSelect
              label="UF"
              value={filters.uf}
              onChange={(value) => setFilters((prev) => ({ ...prev, uf: value }))}
              options={ufOptions}
            />
            <FilterSelect
              label="Organizacao"
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
          <div className="flex flex-col gap-4 rounded-md border border-[color:var(--border-200)] bg-[color:var(--surface-soft)] p-4">
            <label className="flex flex-col gap-2 text-sm text-slate-600">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Busca
              </span>
              <input
                className="rounded-md border border-[color:var(--border-200)] bg-white px-3 py-2 text-sm text-slate-700 focus:border-[color:var(--brand-900)] focus:outline-none"
                placeholder="IES"
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, search: event.target.value }))
                }
              />
            </label>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                {iesRanking.length} IES
              </span>
              <button
                className="rounded-md border border-[color:var(--border-200)] px-3 py-1 font-semibold text-slate-600 transition hover:border-[color:var(--brand-900)] hover:text-[color:var(--brand-900)]"
                type="button"
                onClick={() =>
                  setFilters({
                    uf: "all",
                    organizacao: "all",
                    categoria: "all",
                    search: "",
                  })
                }
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </div>
      </section>

      <SectionCard
        title="Ranking IES"
        description="Score ajustado por amostra de participantes."
        right={
          <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            <span>Ordenacao</span>
            <select
              className="rounded-md border border-[color:var(--border-200)] bg-white px-2 py-1 text-[11px] text-slate-600 focus:border-[color:var(--brand-900)] focus:outline-none"
              value={rankOrder}
              onChange={(event) =>
                setRankOrder(event.target.value === "asc" ? "asc" : "desc")
              }
            >
              {orderOptions.map((option) => (
                <option key={`rank-order-${option.value}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-600">
          <span className="uppercase tracking-[0.2em]">Score ajust.</span>
          <span className="rounded-md border border-[color:var(--border-200)] bg-[color:var(--surface-soft)] px-3 py-2">
            Pagina {page} de {totalPages}
          </span>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-sm">
            <thead className="text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-4 py-2 text-left">Rank</th>
                <th className="px-4 py-2 text-left">IES</th>
                <th className="px-4 py-2 text-left">UF</th>
                <th className="px-4 py-2 text-right">Cursos</th>
                <th className="px-4 py-2 text-right">Participantes</th>
                <th className="px-4 py-2 text-right">Prof</th>
                <th className="px-4 py-2 text-right">Conceito</th>
                <th className="px-4 py-2 text-right">Score Aj.</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, index) => (
                <tr
                  key={`${row.label}-${row.key}`}
                  className="rounded-md bg-[color:var(--surface-soft)] text-slate-700"
                >
                  <td className="px-4 py-3 font-semibold text-slate-700">
                    {index + 1 + (page - 1) * pageSize}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{row.label}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {iesUfMap.get(row.label) || "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-700">
                    {numberFormatter.format(row.courses)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-700">
                    {numberFormatter.format(row.participants)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-[color:var(--brand-900)]">
                    {formatPercent(row.profAvg)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {row.conceptAvg ? row.conceptAvg.toFixed(2) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">
                    {formatScore(row.score)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pageRows.length === 0 ? (
            <div className="mt-6 rounded-md border border-[color:var(--border-200)] bg-white p-6 text-center text-sm text-slate-500">
              Sem dados.
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {pageRows.length} de {iesRanking.length} IES.
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-[color:var(--border-200)] px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-[color:var(--brand-900)] hover:text-[color:var(--brand-900)] disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Anterior
            </button>
            <button
              className="rounded-md border border-[color:var(--border-200)] px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-[color:var(--brand-900)] hover:text-[color:var(--brand-900)] disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Proxima
            </button>
          </div>
        </div>
      </SectionCard>
      <SectionCard
        title="Ranking Cursos"
        description="Score ajustado por amostra de participantes."
      >
        <MiniTable
          columns={[
            { label: "Curso" },
            { label: "Participantes", align: "right" },
            { label: "Score Aj.", align: "right" },
          ]}
          rows={courseRanking.map((item) => [
            `${item.ies} - ${item.municipio}`,
            numberFormatter.format(item.participantes),
            formatScore(item.score),
          ])}
        />
      </SectionCard>

      <SectionCard
        title="Ranking UFs"
        description="Score ajustado por amostra de participantes."
      >
        <MiniTable
          columns={[
            { label: "UF" },
            { label: "Participantes", align: "right" },
            { label: "Score Aj.", align: "right" },
          ]}
          rows={ufRanking.map((item) => [
            item.label,
            numberFormatter.format(item.participants),
            formatScore(item.score),
          ])}
        />
      </SectionCard>

      <SectionCard
        title="Eficiencia"
        description="Score ajustado relativo ao tamanho."
      >
        <MiniTable
          columns={[
            { label: "IES" },
            { label: "Score Aj.", align: "right" },
            { label: "Indice", align: "right" },
          ]}
          rows={topIesByEfficiency.map((item) => [
            item.label,
            formatScore(item.score),
            item.efficiency ? item.efficiency.toFixed(2) : "-",
          ])}
        />
      </SectionCard>

      <SectionCard
        title="Consistencia"
        description="Menor variacao interna por IES."
      >
        <MiniTable
          columns={[
            { label: "IES" },
            { label: "Indice", align: "right" },
          ]}
          rows={iesConsistency.map((item) => [
            item.label,
            item.consistency ? item.consistency.toFixed(2) : "-",
          ])}
        />
      </SectionCard>
    </div>
  );
}
