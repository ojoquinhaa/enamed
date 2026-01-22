"use client";

import { useMemo, type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { CourseStat, GroupStat } from "../../../lib/analytics";
import SectionCard from "../../ui/SectionCard";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

type SectionChartsProps = {
  courseStats: CourseStat[];
  ufStats: GroupStat[];
  orgGroupStats: GroupStat[];
  totalParticipants: number;
};

const conceptKeys = ["1", "2", "3", "4", "5"] as const;

const conceptColors: Record<(typeof conceptKeys)[number], string> = {
  "1": "#fecaca",
  "2": "#fdba74",
  "3": "#fde047",
  "4": "#86efac",
  "5": "#34d399",
};

const numberFormatter = new Intl.NumberFormat("pt-BR");

const ChartShell = ({
  title,
  description,
  heightClass = "h-64",
  children,
}: {
  title: string;
  description?: string;
  heightClass?: string;
  children: ReactNode;
}) => (
  <div className="min-w-0 w-full overflow-hidden rounded-md border border-[color:var(--border-200)] bg-[color:var(--surface-soft)] p-4">
    <div className="flex flex-col gap-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>
      {description ? (
        <p className="text-xs text-slate-500">{description}</p>
      ) : null}
    </div>
    <div className={`mt-3 w-full ${heightClass}`}>{children}</div>
  </div>
);

export default function SectionCharts({
  courseStats,
  ufStats,
  orgGroupStats,
  totalParticipants,
}: SectionChartsProps) {
  const ufConceptTop = useMemo(
    () => [...ufStats].sort((a, b) => b.courses - a.courses).slice(0, 8),
    [ufStats],
  );

  const orgConceptTop = useMemo(
    () => [...orgGroupStats].sort((a, b) => b.courses - a.courses).slice(0, 6),
    [orgGroupStats],
  );

  const profHistogram = useMemo(() => {
    const bins = Array.from({ length: 10 }, (_, index) => ({
      label: `${index * 10}-${(index + 1) * 10}`,
      count: 0,
    }));
    for (const course of courseStats) {
      if (typeof course.proficiencia !== "number") continue;
      const clamped = Math.max(0, Math.min(99.999, course.proficiencia));
      const binIndex = Math.floor(clamped / 10);
      bins[binIndex].count += 1;
    }
    return bins;
  }, [courseStats]);

  const scatterData = useMemo(() => {
    const raw = courseStats
      .filter(
        (course) =>
          typeof course.performance === "number" && course.participantes > 0,
      )
      .map((course) => [
        course.participantes,
        course.performance * 100,
        typeof course.conceito === "number" ? course.conceito : 0,
        course.inscritos || course.participantes,
      ]);
    const limit = 1200;
    if (raw.length <= limit) return raw;
    const step = Math.ceil(raw.length / limit);
    return raw.filter((_, index) => index % step === 0);
  }, [courseStats]);

  const paretoUf = useMemo(() => {
    const top = [...ufStats]
      .sort((a, b) => b.participants - a.participants)
      .slice(0, 10);
    let cumulative = 0;
    return top.map((item) => {
      cumulative += item.participants;
      return {
        label: item.label,
        participants: item.participants,
        cumulativeShare: totalParticipants
          ? (cumulative / totalParticipants) * 100
          : 0,
      };
    });
  }, [totalParticipants, ufStats]);

  const stackedUfOption = useMemo(() => {
    const categories = ufConceptTop.map((item) => item.label);
    return {
      color: conceptKeys.map((key) => conceptColors[key]),
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: {
        top: 0,
        textStyle: { color: "#94a3b8", fontSize: 10 },
      },
      grid: { left: 16, right: 16, top: 28, bottom: 24, containLabel: true },
      xAxis: {
        type: "category",
        data: categories,
        axisLabel: { color: "#64748b", fontSize: 10 },
      },
      yAxis: {
        type: "value",
        axisLabel: { formatter: "{value}%", color: "#64748b", fontSize: 10 },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      series: conceptKeys.map((key) => ({
        name: `C${key}`,
        type: "bar",
        stack: "total",
        barMaxWidth: 30,
        emphasis: { focus: "series" },
        data: ufConceptTop.map((item) => {
          const count = item.conceptDist[key] ?? 0;
          return item.courses ? (count / item.courses) * 100 : 0;
        }),
      })),
    };
  }, [ufConceptTop]);

  const stackedOrgOption = useMemo(() => {
    const categories = orgConceptTop.map((item) => item.label);
    return {
      color: conceptKeys.map((key) => conceptColors[key]),
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: {
        top: 0,
        textStyle: { color: "#94a3b8", fontSize: 10 },
      },
      grid: { left: 16, right: 16, top: 28, bottom: 24, containLabel: true },
      xAxis: {
        type: "category",
        data: categories,
        axisLabel: { color: "#64748b", fontSize: 10 },
      },
      yAxis: {
        type: "value",
        axisLabel: { formatter: "{value}%", color: "#64748b", fontSize: 10 },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      series: conceptKeys.map((key) => ({
        name: `C${key}`,
        type: "bar",
        stack: "total",
        barMaxWidth: 30,
        emphasis: { focus: "series" },
        data: orgConceptTop.map((item) => {
          const count = item.conceptDist[key] ?? 0;
          return item.courses ? (count / item.courses) * 100 : 0;
        }),
      })),
    };
  }, [orgConceptTop]);

  const histogramOption = useMemo(() => {
    return {
      color: ["#0f766e"],
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { left: 16, right: 16, top: 16, bottom: 32, containLabel: true },
      xAxis: {
        type: "category",
        data: profHistogram.map((bin) => bin.label),
        axisLabel: { color: "#64748b", fontSize: 10 },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#64748b", fontSize: 10 },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      series: [
        {
          type: "bar",
          barMaxWidth: 28,
          data: profHistogram.map((bin) => bin.count),
        },
      ],
    };
  }, [profHistogram]);

  const scatterOption = useMemo(() => {
    return {
      tooltip: {
        trigger: "item",
        formatter: (params: { value: number[] }) => {
          const [participants, performance, concept, inscritos] = params.value;
          const conceptLabel = concept ? `C${concept}` : "SC";
          return [
            `Participantes: ${numberFormatter.format(participants)}`,
            `Performance: ${performance.toFixed(1)}`,
            `Conceito: ${conceptLabel}`,
            `Inscritos: ${numberFormatter.format(inscritos)}`,
          ].join("<br/>");
        },
      },
      grid: { left: 16, right: 16, top: 16, bottom: 48, containLabel: true },
      xAxis: {
        type: "value",
        name: "Participantes",
        nameLocation: "middle",
        nameGap: 28,
        axisLabel: { color: "#64748b", fontSize: 10 },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      yAxis: {
        type: "value",
        name: "Performance",
        nameLocation: "middle",
        nameGap: 32,
        axisLabel: { color: "#64748b", fontSize: 10 },
        splitLine: { lineStyle: { color: "#e2e8f0" } },
      },
      visualMap: {
        type: "piecewise",
        orient: "horizontal",
        bottom: 0,
        left: "center",
        textStyle: { color: "#94a3b8", fontSize: 10 },
        dimension: 2,
        pieces: [
          { value: 5, label: "C5", color: conceptColors["5"] },
          { value: 4, label: "C4", color: conceptColors["4"] },
          { value: 3, label: "C3", color: conceptColors["3"] },
          { value: 2, label: "C2", color: conceptColors["2"] },
          { value: 1, label: "C1", color: conceptColors["1"] },
          { value: 0, label: "SC", color: "#cbd5f5" },
        ],
      },
      series: [
        {
          type: "scatter",
          data: scatterData,
          symbolSize: (value: number[]) => {
            const sizeBase = value[3] || value[0];
            const size = Math.sqrt(sizeBase) / 3;
            return Math.max(6, Math.min(24, size));
          },
          itemStyle: { opacity: 0.8 },
          emphasis: { focus: "series" },
        },
      ],
    };
  }, [scatterData]);

  const paretoOption = useMemo(() => {
    return {
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { left: 16, right: 24, top: 24, bottom: 32, containLabel: true },
      xAxis: {
        type: "category",
        data: paretoUf.map((item) => item.label),
        axisLabel: { color: "#64748b", fontSize: 10 },
      },
      yAxis: [
        {
          type: "value",
          name: "Participantes",
          axisLabel: { color: "#64748b", fontSize: 10 },
          splitLine: { lineStyle: { color: "#e2e8f0" } },
        },
        {
          type: "value",
          name: "% acumulado",
          min: 0,
          max: 100,
          axisLabel: { formatter: "{value}%", color: "#64748b", fontSize: 10 },
        },
      ],
      series: [
        {
          type: "bar",
          barMaxWidth: 30,
          data: paretoUf.map((item) => item.participants),
          itemStyle: { color: "#0f766e" },
        },
        {
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          data: paretoUf.map((item) => Number(item.cumulativeShare.toFixed(1))),
          itemStyle: { color: "#f97316" },
        },
      ],
    };
  }, [paretoUf]);

  return (
    <SectionCard
      title="Graficos essenciais"
      description="Distribuicoes e relacoes para leitura rapida."
    >
      <div className="grid min-w-0 gap-6">
        <div className="grid min-w-0 gap-6 lg:grid-cols-2">
          <ChartShell
            title="Distribuicao de conceitos por UF"
            description="Percentual de conceitos (C1-C5) nos estados com mais cursos."
          >
            <ReactECharts
              option={stackedUfOption}
              style={{ height: "100%", width: "100%" }}
            />
          </ChartShell>
          <ChartShell
            title="Distribuicao de conceitos por organizacao"
            description="Percentual de conceitos por tipo de organizacao."
          >
            <ReactECharts
              option={stackedOrgOption}
              style={{ height: "100%", width: "100%" }}
            />
          </ChartShell>
        </div>
        <div className="grid min-w-0 gap-6 lg:grid-cols-2">
          <ChartShell
            title="Histograma de proficiencia"
            description="Quantidade de cursos por faixa de %."
          >
            <ReactECharts
              option={histogramOption}
              style={{ height: "100%", width: "100%" }}
            />
          </ChartShell>
          <ChartShell
            title="Pareto de participantes por UF"
            description="Top 10 UFs e % acumulado."
          >
            <ReactECharts
              option={paretoOption}
              style={{ height: "100%", width: "100%" }}
            />
          </ChartShell>
        </div>
        <ChartShell
          title="Dispersao: participantes vs performance"
          description="Bolha = inscritos. Cor = conceito."
          heightClass="h-72"
        >
          <ReactECharts
            option={scatterOption}
            style={{ height: "100%", width: "100%" }}
          />
        </ChartShell>
      </div>
    </SectionCard>
  );
}
