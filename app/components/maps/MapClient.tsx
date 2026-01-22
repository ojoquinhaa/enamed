"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import * as echarts from "echarts";
import type { EnamedOptions, EnamedRow } from "../../lib/enamed-types";
import {
  buildGroupStats,
  getExcellenceIndex,
  normalizeText,
} from "../../lib/analytics";
import DashboardFilters from "../dashboard/DashboardFilters";
import type { FilterState, OptionItem } from "../dashboard/types";
import {
  formatPercent,
  formatRate,
  formatScore,
  numberFormatter,
} from "../dashboard/formatters";
import MiniTable from "../ui/MiniTable";
import SectionCard from "../ui/SectionCard";
import StatGrid from "../ui/StatGrid";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

type MapClientProps = {
  rows: EnamedRow[];
  options: EnamedOptions;
};

type MetricId =
  | "performance"
  | "proficiencia"
  | "conceito"
  | "participacao"
  | "participantes"
  | "cursos";

type MetricDef = {
  id: MetricId;
  label: string;
  mapValue: (stat: ReturnType<typeof buildGroupStats>[number]) => number | null;
  display: (value: number | null) => string;
};

const UF_BY_NAME: Record<string, string> = {
  ACRE: "AC",
  ALAGOAS: "AL",
  AMAPA: "AP",
  AMAZONAS: "AM",
  BAHIA: "BA",
  CEARA: "CE",
  "DISTRITO FEDERAL": "DF",
  "ESPIRITO SANTO": "ES",
  GOIAS: "GO",
  MARANHAO: "MA",
  "MATO GROSSO": "MT",
  "MATO GROSSO DO SUL": "MS",
  "MINAS GERAIS": "MG",
  PARA: "PA",
  PARAIBA: "PB",
  PARANA: "PR",
  PERNAMBUCO: "PE",
  PIAUI: "PI",
  "RIO DE JANEIRO": "RJ",
  "RIO GRANDE DO NORTE": "RN",
  "RIO GRANDE DO SUL": "RS",
  RONDONIA: "RO",
  RORAIMA: "RR",
  "SANTA CATARINA": "SC",
  "SAO PAULO": "SP",
  SERGIPE: "SE",
  TOCANTINS: "TO",
};

const GEOJSON_URL = "/data/br-uf.geojson";
const MAP_NAME = "BR-UF";

const metricDefs: MetricDef[] = [
  {
    id: "performance",
    label: "Performance (score)",
    mapValue: (stat) =>
      getExcellenceIndex(stat.conceptWeighted, stat.profWeighted),
    display: formatScore,
  },
  {
    id: "proficiencia",
    label: "Proficiencia",
    mapValue: (stat) => stat.profWeighted ?? stat.profAvg,
    display: formatPercent,
  },
  {
    id: "conceito",
    label: "Conceito medio",
    mapValue: (stat) => stat.conceptWeighted ?? stat.conceptAvg,
    display: (value) => (value === null ? "-" : value.toFixed(2)),
  },
  {
    id: "participacao",
    label: "Taxa de participacao",
    mapValue: (stat) =>
      typeof stat.participationRate === "number"
        ? stat.participationRate * 100
        : null,
    display: formatRate,
  },
  {
    id: "participantes",
    label: "Participantes",
    mapValue: (stat) => stat.participants,
    display: (value) => (value === null ? "-" : numberFormatter.format(value)),
  },
  {
    id: "cursos",
    label: "Cursos",
    mapValue: (stat) => stat.courses,
    display: (value) => (value === null ? "-" : numberFormatter.format(value)),
  },
];

const buildOptions = (values: string[], allLabel: string): OptionItem[] => [
  { label: allLabel, value: "all" },
  ...values.map((value) => ({ label: value, value })),
];

const ChartShell = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="rounded-md border border-border bg-(--surface-soft) p-4">
    <div className="flex items-center justify-between gap-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>
      {children}
    </div>
  </div>
);

export default function MapClient({ rows, options }: MapClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    uf: "all",
    ies: "all",
    organizacao: "all",
    categoria: "all",
    search: "",
  });
  const [metricId, setMetricId] = useState<MetricId>("performance");
  const [mapReady, setMapReady] = useState(false);
  const [ufToName, setUfToName] = useState<Record<string, string>>({});
  const [nameToUf, setNameToUf] = useState<Record<string, string>>({});
  const [selectedUf, setSelectedUf] = useState<string | null>(null);

  const ufOptions = useMemo(
    () => buildOptions(options.ufs, "Todas as UFs"),
    [options.ufs],
  );
  const iesOptions = useMemo(
    () => buildOptions(options.ies, "Todas as IES"),
    [options.ies],
  );
  const orgOptions = useMemo(
    () => buildOptions(options.organizacoes, "Todas as organizacoes"),
    [options.organizacoes],
  );
  const categoriaOptions = useMemo(
    () => buildOptions(options.categorias, "Todas as categorias"),
    [options.categorias],
  );

  useEffect(() => {
    let active = true;
    fetch(GEOJSON_URL)
      .then((res) => res.json())
      .then((geojson) => {
        if (!active) return;
        echarts.registerMap(MAP_NAME, geojson);
        const mapUfToName: Record<string, string> = {};
        const mapNameToUf: Record<string, string> = {};
        for (const feature of geojson.features ?? []) {
          const props = feature.properties ?? {};
          const name =
            props.name ||
            props.nome ||
            props.NOME ||
            props.estado ||
            props.ESTADO;
          const sigla =
            props.sigla || props.SIGLA || props.uf || props.UF || null;
          const normalizedName = name ? normalizeText(String(name)) : "";
          const uf =
            sigla || (normalizedName ? UF_BY_NAME[normalizedName] : null);
          if (name && uf) {
            mapUfToName[uf] = name;
            mapNameToUf[name] = uf;
          }
        }
        setUfToName(mapUfToName);
        setNameToUf(mapNameToUf);
        setMapReady(true);
      })
      .catch(() => setMapReady(false));
    return () => {
      active = false;
    };
  }, []);

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
      if (!searchTerm) return true;
      const haystack =
        `${row.nomeIes} ${row.siglaIes} ${row.municipioCurso}`.toLowerCase();
      return haystack.includes(searchTerm);
    });
  }, [filters, rows]);

  const ufStats = useMemo(
    () =>
      buildGroupStats(
        filteredRows,
        (row) => row.uf || "ND",
        (row) => row.uf || "ND",
      ),
    [filteredRows],
  );

  const resolvedSelectedUf = useMemo(() => {
    if (selectedUf && ufStats.some((item) => item.label === selectedUf)) {
      return selectedUf;
    }
    return ufStats[0]?.label ?? null;
  }, [selectedUf, ufStats]);

  const metricDef = useMemo(
    () => metricDefs.find((item) => item.id === metricId) ?? metricDefs[0],
    [metricId],
  );

  const mapData = useMemo(() => {
    return ufStats
      .map((item) => {
        const name = ufToName[item.label];
        if (!name) return null;
        return {
          name,
          value: metricDef.mapValue(item) ?? 0,
          uf: item.label,
        };
      })
      .filter(Boolean) as Array<{ name: string; value: number; uf: string }>;
  }, [metricDef, ufStats, ufToName]);

  const mapRange = useMemo(() => {
    if (!mapData.length) return { min: 0, max: 0 };
    const values = mapData.map((item) => item.value);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [mapData]);

  const ufSummary = useMemo(() => {
    const map = new Map(
      ufStats.map((item) => [
        item.label,
        {
          ...item,
          performance: getExcellenceIndex(
            item.conceptWeighted,
            item.profWeighted,
          ),
        },
      ]),
    );
    return map;
  }, [ufStats]);

  const selectedUfStat = resolvedSelectedUf
    ? ufSummary.get(resolvedSelectedUf)
    : null;
  const selectedUfConcept =
    selectedUfStat?.conceptWeighted ?? selectedUfStat?.conceptAvg ?? null;

  const selectedRows = useMemo(() => {
    if (!resolvedSelectedUf) return filteredRows;
    return filteredRows.filter((row) => row.uf === resolvedSelectedUf);
  }, [filteredRows, resolvedSelectedUf]);

  const iesStatsInUf = useMemo(() => {
    const stats = buildGroupStats(
      selectedRows,
      (row) => row.nomeIes || "ND",
      (row) => row.nomeIes || "ND",
    );
    return stats
      .map((item) => ({
        ...item,
        performance: getExcellenceIndex(
          item.conceptWeighted,
          item.profWeighted,
        ),
      }))
      .sort((a, b) => (b.performance ?? 0) - (a.performance ?? 0))
      .slice(0, 6);
  }, [selectedRows]);

  const tooltipData = useMemo(() => {
    const data = new Map<
      string,
      {
        uf: string;
        courses: number;
        participants: number;
        prof: number | null;
        concept: number | null;
        performance: number | null;
        participation: number | null;
      }
    >();
    for (const item of ufStats) {
      data.set(item.label, {
        uf: item.label,
        courses: item.courses,
        participants: item.participants,
        prof: item.profWeighted ?? item.profAvg,
        concept: item.conceptWeighted ?? item.conceptAvg,
        performance: getExcellenceIndex(
          item.conceptWeighted,
          item.profWeighted,
        ),
        participation: item.participationRate,
      });
    }
    return data;
  }, [ufStats]);

  const mapOption = useMemo(() => {
    return {
      tooltip: {
        trigger: "item",
        formatter: (params: { name: string; data?: { uf?: string } }) => {
          const uf = params.data?.uf ?? nameToUf[params.name];
          if (!uf) return params.name;
          const detail = tooltipData.get(uf);
          if (!detail) return params.name;
          return [
            `<strong>${params.name} (${uf})</strong>`,
            `Cursos: ${numberFormatter.format(detail.courses)}`,
            `Participantes: ${numberFormatter.format(detail.participants)}`,
            `Proficiencia: ${formatPercent(detail.prof)}`,
            `Conceito: ${
              detail.concept === null ? "-" : detail.concept.toFixed(2)
            }`,
            `Performance: ${formatScore(detail.performance)}`,
            `Taxa: ${formatRate(detail.participation)}`,
          ].join("<br/>");
        },
      },
      visualMap: {
        min: mapRange.min,
        max: mapRange.max,
        left: 12,
        bottom: 12,
        textStyle: { color: "#94a3b8", fontSize: 10 },
        inRange: {
          color: ["#e0f2fe", "#38bdf8", "#0284c7", "#075985"],
        },
      },
      series: [
        {
          type: "map",
          map: MAP_NAME,
          roam: true,
          selectedMode: false,
          label: {
            show: false,
          },
          itemStyle: {
            borderColor: "#e2e8f0",
          },
          emphasis: {
            itemStyle: {
              areaColor: "#38bdf8",
            },
          },
          data: mapData.map((item) => ({
            ...item,
            itemStyle:
              resolvedSelectedUf && item.uf === resolvedSelectedUf
                ? {
                    areaColor: "#0ea5e9",
                    borderColor: "#0284c7",
                    borderWidth: 1.5,
                  }
                : undefined,
          })),
        },
      ],
    };
  }, [mapData, mapRange, nameToUf, resolvedSelectedUf, tooltipData]);

  const onEvents = useMemo(
    () => ({
      click: (params: { name: string }) => {
        const uf = nameToUf[params.name];
        if (uf) setSelectedUf(uf);
      },
    }),
    [nameToUf],
  );

  return (
    <div className="flex flex-col gap-6">
      <DashboardFilters
        filters={filters}
        options={{
          ufs: ufOptions,
          ies: iesOptions,
          organizacoes: orgOptions,
          categorias: categoriaOptions,
        }}
        onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
        onClear={() =>
          setFilters({
            uf: "all",
            ies: "all",
            organizacao: "all",
            categoria: "all",
            search: "",
          })
        }
        resultCount={filteredRows.length}
      />

      <section className="rounded-md border border-border bg-(--surface-soft) p-4 text-xs text-slate-600">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Legenda e calculos
        </div>
        <div className="mt-2 grid gap-1">
          <p>
            <span className="font-semibold text-slate-700">Performance</span>:
            100 x media(conceito/5, prof/100).
          </p>
          <p>
            <span className="font-semibold text-slate-700">Proficiencia</span>:
            % acima da proficiencia.
          </p>
          <p>
            <span className="font-semibold text-slate-700">Conceito</span>:
            media ponderada por participantes.
          </p>
          <p>
            <span className="font-semibold text-slate-700">Taxa</span>:
            participantes/inscritos.
          </p>
        </div>
      </section>

      <SectionCard
        title="Mapa por UF"
        description="Selecione uma metrica e clique no estado para ver detalhes."
        right={
          <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            <span>Metrica</span>
            <select
              className="rounded-md border border-border bg-white px-2 py-1 text-[11px] text-slate-600 focus:border-brand focus:outline-none"
              value={metricId}
              onChange={(event) => setMetricId(event.target.value as MetricId)}
            >
              {metricDefs.map((metric) => (
                <option key={metric.id} value={metric.id}>
                  {metric.label}
                </option>
              ))}
            </select>
          </label>
        }
      >
        <div className="grid min-w-0 gap-6 xl:grid-cols-[1.6fr_0.8fr] xl:items-start">
          <div className="min-w-0 rounded-md border border-border bg-white p-4">
            <ChartShell title="Mapa interativo">
              <span className="text-[11px] text-slate-400">
                {metricDef.label}
              </span>
            </ChartShell>
            <div className="mt-4 h-105 sm:h-130 lg:h-155">
              {mapReady ? (
                <ReactECharts
                  option={mapOption}
                  onEvents={onEvents}
                  style={{ height: "100%", width: "100%" }}
                />
              ) : (
                <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border text-sm text-slate-400">
                  Carregando mapa...
                </div>
              )}
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-4 xl:max-h-180 xl:overflow-y-auto xl:pr-1">
            <div className="rounded-md border border-border bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  UF selecionada
                </p>
                <select
                  className="rounded-md border border-border bg-white px-2 py-1 text-[11px] text-slate-600 focus:border-brand focus:outline-none"
                  value={resolvedSelectedUf ?? ""}
                  onChange={(event) =>
                    setSelectedUf(event.target.value || null)
                  }
                >
                  {ufStats.map((item) => (
                    <option key={item.label} value={item.label}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3">
                <StatGrid
                  items={[
                    {
                      label: "Cursos",
                      value: numberFormatter.format(
                        selectedUfStat?.courses ?? 0,
                      ),
                    },
                    {
                      label: "Participantes",
                      value: numberFormatter.format(
                        selectedUfStat?.participants ?? 0,
                      ),
                    },
                    {
                      label: "Proficiencia",
                      value: formatPercent(
                        selectedUfStat?.profWeighted ??
                          selectedUfStat?.profAvg ??
                          null,
                      ),
                    },
                    {
                      label: "Conceito",
                      value:
                        typeof selectedUfConcept === "number"
                          ? selectedUfConcept.toFixed(2)
                          : "-",
                    },
                    {
                      label: "Performance",
                      value: formatScore(selectedUfStat?.performance ?? null),
                    },
                    {
                      label: "Taxa",
                      value: formatRate(
                        selectedUfStat?.participationRate ?? null,
                      ),
                    },
                  ]}
                  columns="grid gap-2 sm:grid-cols-2"
                  size="compact"
                />
              </div>
            </div>

            <div className="rounded-md border border-border bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Top IES na UF
              </p>
              <div className="mt-3">
                <MiniTable
                  columns={[
                    { label: "IES" },
                    { label: "Perf", align: "right" },
                  ]}
                  rows={
                    iesStatsInUf.length
                      ? iesStatsInUf.map((item) => [
                          item.label,
                          formatScore(item.performance ?? null),
                        ])
                      : [["Sem dados", "-"]]
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
