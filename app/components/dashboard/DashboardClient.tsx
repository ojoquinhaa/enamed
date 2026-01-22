"use client";

import { useMemo, useState } from "react";
import type { EnamedOptions, EnamedRow } from "../../lib/enamed-types";
import {
  buildCourseStats,
  buildGroupStats,
  buildMunicipioKey,
  correlation,
  getAdminGroup,
  getExcellenceIndex,
  getOrganizationGroup,
  getStdDev,
  isCapital,
  quantile,
} from "../../lib/analytics";
import StatGrid from "../ui/StatGrid";
import DashboardFilters from "./DashboardFilters";
import DashboardLegend from "./DashboardLegend";
import {
  formatPercent,
  formatRate,
  numberFormatter,
  percentFormatter,
} from "./formatters";
import type { FilterState, OptionItem } from "./types";
import SectionConcentration from "./sections/SectionConcentration";
import SectionConsistency from "./sections/SectionConsistency";
import SectionCharts from "./sections/SectionCharts";
import SectionDistribution from "./sections/SectionDistribution";
import SectionGeography from "./sections/SectionGeography";
import SectionInstitutional from "./sections/SectionInstitutional";
import SectionOutliers from "./sections/SectionOutliers";
import SectionParticipation from "./sections/SectionParticipation";
import SectionQualityScale from "./sections/SectionQualityScale";
import SectionSimulation from "./sections/SectionSimulation";
import SectionUfIes from "./sections/SectionUfIes";

type DashboardClientProps = {
  rows: EnamedRow[];
  options: EnamedOptions;
};

const average = (values: number[]) =>
  values.length
    ? values.reduce((acc, value) => acc + value, 0) / values.length
    : null;

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0);

const buildOptions = (values: string[], allLabel: string): OptionItem[] => [
  { label: allLabel, value: "all" },
  ...values.map((value) => ({ label: value, value })),
];

export default function DashboardClient({
  rows,
  options,
}: DashboardClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    uf: "all",
    ies: "all",
    organizacao: "all",
    categoria: "all",
    search: "",
  });

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

  const courseStats = useMemo(
    () => buildCourseStats(filteredRows),
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

  const iesStats = useMemo(
    () =>
      buildGroupStats(
        filteredRows,
        (row) => row.nomeIes || "ND",
        (row) => row.nomeIes || "ND",
      ),
    [filteredRows],
  );

  const orgStats = useMemo(
    () =>
      buildGroupStats(
        filteredRows,
        (row) => row.organizacaoAcademica || "ND",
        (row) => row.organizacaoAcademica || "ND",
      ),
    [filteredRows],
  );

  const categoriaStats = useMemo(
    () =>
      buildGroupStats(
        filteredRows,
        (row) => row.categoriaAdministrativa || "ND",
        (row) => row.categoriaAdministrativa || "ND",
      ),
    [filteredRows],
  );

  const adminStats = useMemo(
    () =>
      buildGroupStats(
        filteredRows,
        (row) => getAdminGroup(row.categoriaAdministrativa),
        (row) => getAdminGroup(row.categoriaAdministrativa),
      ),
    [filteredRows],
  );

  const orgGroupStats = useMemo(
    () =>
      buildGroupStats(
        filteredRows,
        (row) => getOrganizationGroup(row.organizacaoAcademica),
        (row) => getOrganizationGroup(row.organizacaoAcademica),
      ),
    [filteredRows],
  );

  const categoriaTop = useMemo(
    () => [...categoriaStats].sort((a, b) => b.courses - a.courses).slice(0, 8),
    [categoriaStats],
  );

  const orgTop = useMemo(
    () => [...orgStats].sort((a, b) => b.courses - a.courses).slice(0, 8),
    [orgStats],
  );

  const municipioStats = useMemo(
    () =>
      buildGroupStats(
        filteredRows,
        (row) => buildMunicipioKey(row),
        (row) => row.municipioCurso || "ND",
      ),
    [filteredRows],
  );

  const capitalStats = useMemo(
    () =>
      buildGroupStats(
        filteredRows,
        (row) => (isCapital(row) ? "Capital" : "Interior"),
        (row) => (isCapital(row) ? "Capital" : "Interior"),
      ),
    [filteredRows],
  );

  const totalCourses = courseStats.length;
  const totalParticipants = sum(
    courseStats.map((course) => course.participantes),
  );
  const totalInscritos = sum(courseStats.map((course) => course.inscritos));
  const uniqueIes = new Set(
    filteredRows.map((row) => row.nomeIes).filter(Boolean),
  ).size;

  const profMedia = average(
    courseStats
      .map((course) => course.proficiencia)
      .filter((value): value is number => typeof value === "number"),
  );
  const conceitoMedio = average(
    courseStats
      .map((course) => course.conceito)
      .filter((value): value is number => typeof value === "number"),
  );

  const taxaParticipacao = totalInscritos
    ? totalParticipants / totalInscritos
    : null;

  const conceptDist = useMemo(() => {
    const dist = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, SC: 0 } as Record<
      string,
      number
    >;
    for (const course of courseStats) {
      const key = course.conceito ? String(course.conceito) : "SC";
      dist[key] = (dist[key] ?? 0) + 1;
    }
    return dist;
  }, [courseStats]);

  const conceptDistItems = useMemo(
    () =>
      Object.entries(conceptDist).map(([key, count]) => ({
        label: key === "SC" ? "SC" : `C${key}`,
        value: totalCourses ? (count / totalCourses) * 100 : 0,
        display: `${percentFormatter.format(
          totalCourses ? (count / totalCourses) * 100 : 0,
        )}%`,
      })),
    [conceptDist, totalCourses],
  );

  const ufTopByParticipants = useMemo(
    () =>
      [...ufStats].sort((a, b) => b.participants - a.participants).slice(0, 10),
    [ufStats],
  );

  const iesTopByParticipants = useMemo(
    () =>
      [...iesStats]
        .sort((a, b) => b.participants - a.participants)
        .slice(0, 10),
    [iesStats],
  );

  const ufTopByCourses = useMemo(
    () => [...ufStats].sort((a, b) => b.courses - a.courses).slice(0, 8),
    [ufStats],
  );

  const ufPerformanceWeighted = useMemo(
    () =>
      [...ufStats]
        .map((item) => ({
          ...item,
          excellence: getExcellenceIndex(
            item.conceptWeighted,
            item.profWeighted,
          ),
        }))
        .sort((a, b) => (b.excellence ?? 0) - (a.excellence ?? 0))
        .slice(0, 10),
    [ufStats],
  );

  const municipioMulti = useMemo(
    () =>
      [...municipioStats]
        .filter((item) => item.courses >= 2)
        .sort((a, b) => (b.performanceAvg ?? 0) - (a.performanceAvg ?? 0))
        .slice(0, 10),
    [municipioStats],
  );

  const municipioRanking = useMemo(
    () =>
      [...municipioStats]
        .sort((a, b) => (b.performanceAvg ?? 0) - (a.performanceAvg ?? 0))
        .slice(0, 10),
    [municipioStats],
  );

  const ufHighConcept = useMemo(
    () =>
      [...ufStats]
        .map((item) => {
          const high =
            (item.conceptDist["4"] ?? 0) + (item.conceptDist["5"] ?? 0);
          return {
            label: item.label,
            value: item.courses ? (high / item.courses) * 100 : 0,
          };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 8),
    [ufStats],
  );

  const ufLowConcept = useMemo(
    () =>
      [...ufStats]
        .map((item) => {
          const low =
            (item.conceptDist["1"] ?? 0) + (item.conceptDist["2"] ?? 0);
          return {
            label: item.label,
            value: item.courses ? (low / item.courses) * 100 : 0,
          };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 8),
    [ufStats],
  );

  const participantsShareByUf = useMemo(
    () =>
      [...ufStats]
        .map((item) => ({
          label: item.label,
          value: totalParticipants
            ? (item.participants / totalParticipants) * 100
            : 0,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8),
    [ufStats, totalParticipants],
  );

  const top10UfCoursesShare = useMemo(() => {
    const topCourses = [...ufStats]
      .sort((a, b) => b.courses - a.courses)
      .slice(0, 10)
      .reduce((acc, item) => acc + item.courses, 0);
    return totalCourses ? (topCourses / totalCourses) * 100 : 0;
  }, [ufStats, totalCourses]);

  const top10IesParticipantsShare = useMemo(() => {
    const topParticipants = [...iesStats]
      .sort((a, b) => b.participants - a.participants)
      .slice(0, 10)
      .reduce((acc, item) => acc + item.participants, 0);
    return totalParticipants ? (topParticipants / totalParticipants) * 100 : 0;
  }, [iesStats, totalParticipants]);

  const participantsValues = useMemo(
    () =>
      courseStats.map((course) => course.participantes).filter((v) => v > 0),
    [courseStats],
  );

  const profValues = useMemo(
    () =>
      courseStats
        .map((course) => course.proficiencia)
        .filter((value): value is number => typeof value === "number"),
    [courseStats],
  );

  const performanceValues = useMemo(
    () =>
      courseStats
        .map((course) => course.performance)
        .filter((value): value is number => typeof value === "number"),
    [courseStats],
  );

  const smallThreshold = quantile(participantsValues, 0.25);
  const largeThreshold = quantile(participantsValues, 0.75);
  const lowProfThreshold = quantile(profValues, 0.25);
  const highProfThreshold = quantile(profValues, 0.75);
  const perfHigh = quantile(performanceValues, 0.75);
  const topQuartileProf = profValues.length ? highProfThreshold : null;

  const estimatedProficient = useMemo(() => {
    const values = courseStats
      .map((course) => {
        if (typeof course.acimaProficiencia === "number") {
          return course.acimaProficiencia;
        }
        if (typeof course.proficiencia === "number") {
          return (course.participantes * course.proficiencia) / 100;
        }
        return null;
      })
      .filter((value): value is number => typeof value === "number");
    return values.length ? sum(values) : null;
  }, [courseStats]);

  const simulatedTopQuartile =
    typeof topQuartileProf === "number" && totalParticipants
      ? (topQuartileProf / 100) * totalParticipants
      : null;
  const simulatedTarget90 = totalParticipants ? totalParticipants * 0.9 : null;

  const smallCourses = courseStats.filter(
    (course) =>
      course.participantes > 0 && course.participantes <= smallThreshold,
  );
  const largeCourses = courseStats.filter(
    (course) => course.participantes >= largeThreshold,
  );

  const smallCourseProf = average(
    smallCourses
      .map((course) => course.proficiencia)
      .filter((value): value is number => typeof value === "number"),
  );
  const largeCourseProf = average(
    largeCourses
      .map((course) => course.proficiencia)
      .filter((value): value is number => typeof value === "number"),
  );
  const smallCourseConcept = average(
    smallCourses
      .map((course) => course.conceito)
      .filter((value): value is number => typeof value === "number"),
  );
  const largeCourseConcept = average(
    largeCourses
      .map((course) => course.conceito)
      .filter((value): value is number => typeof value === "number"),
  );
  const smallCoursePerf = average(
    smallCourses
      .map((course) => course.performance)
      .filter((value): value is number => typeof value === "number"),
  );
  const largeCoursePerf = average(
    largeCourses
      .map((course) => course.performance)
      .filter((value): value is number => typeof value === "number"),
  );
  const smallCoursePerfScore =
    typeof smallCoursePerf === "number" ? smallCoursePerf * 100 : null;
  const largeCoursePerfScore =
    typeof largeCoursePerf === "number" ? largeCoursePerf * 100 : null;

  const corrParticipantsConcept = useMemo(() => {
    const pairs = courseStats
      .filter(
        (course) =>
          typeof course.conceito === "number" && course.participantes > 0,
      )
      .map(
        (course) =>
          [course.participantes, course.conceito as number] as [number, number],
      );
    return correlation(pairs);
  }, [courseStats]);

  const corrParticipantsProf = useMemo(() => {
    const pairs = courseStats
      .filter(
        (course) =>
          typeof course.proficiencia === "number" && course.participantes > 0,
      )
      .map(
        (course) =>
          [course.participantes, course.proficiencia as number] as [
            number,
            number,
          ],
      );
    return correlation(pairs);
  }, [courseStats]);

  const corrParticipantsPerf = useMemo(() => {
    const pairs = courseStats
      .filter(
        (course) =>
          typeof course.performance === "number" && course.participantes > 0,
      )
      .map(
        (course) =>
          [course.participantes, course.performance as number] as [
            number,
            number,
          ],
      );
    return correlation(pairs);
  }, [courseStats]);

  const corrParticipationProf = useMemo(() => {
    const pairs = courseStats
      .filter(
        (course) =>
          typeof course.participacao === "number" &&
          typeof course.proficiencia === "number",
      )
      .map(
        (course) =>
          [course.participacao as number, course.proficiencia as number] as [
            number,
            number,
          ],
      );
    return correlation(pairs);
  }, [courseStats]);

  const corrParticipationConcept = useMemo(() => {
    const pairs = courseStats
      .filter(
        (course) =>
          typeof course.participacao === "number" &&
          typeof course.conceito === "number",
      )
      .map(
        (course) =>
          [course.participacao as number, course.conceito as number] as [
            number,
            number,
          ],
      );
    return correlation(pairs);
  }, [courseStats]);

  const corrParticipationPerf = useMemo(() => {
    const pairs = courseStats
      .filter(
        (course) =>
          typeof course.participacao === "number" &&
          typeof course.performance === "number",
      )
      .map(
        (course) =>
          [course.participacao as number, course.performance as number] as [
            number,
            number,
          ],
      );
    return correlation(pairs);
  }, [courseStats]);

  const corrIesCoursesPerformance = useMemo(() => {
    const pairs = iesStats
      .filter((item) => typeof item.performanceAvg === "number")
      .map(
        (item) =>
          [item.courses, item.performanceAvg as number] as [number, number],
      );
    return correlation(pairs);
  }, [iesStats]);

  const ufCoursesLow = quantile(
    ufStats.map((item) => item.courses),
    0.25,
  );
  const ufPerfHigh = quantile(
    ufStats
      .map((item) => item.performanceAvg)
      .filter((value): value is number => typeof value === "number"),
    0.75,
  );

  const iesCoursesHigh = quantile(
    iesStats.map((item) => item.courses),
    0.75,
  );
  const iesPerfLow = quantile(
    iesStats
      .map((item) => item.performanceAvg)
      .filter((value): value is number => typeof value === "number"),
    0.25,
  );

  const ufFewHigh = useMemo(
    () =>
      ufStats
        .filter(
          (item) =>
            item.courses <= ufCoursesLow &&
            (item.performanceAvg ?? 0) >= ufPerfHigh,
        )
        .slice(0, 6),
    [ufStats, ufCoursesLow, ufPerfHigh],
  );

  const iesManyLow = useMemo(
    () =>
      iesStats
        .filter(
          (item) =>
            item.courses >= iesCoursesHigh &&
            (item.performanceAvg ?? 0) <= iesPerfLow,
        )
        .slice(0, 6),
    [iesStats, iesCoursesHigh, iesPerfLow],
  );

  const concept5LowProf = useMemo(
    () =>
      courseStats
        .filter(
          (course) =>
            course.conceito === 5 &&
            typeof course.proficiencia === "number" &&
            course.proficiencia <= lowProfThreshold,
        )
        .sort((a, b) => (a.proficiencia ?? 0) - (b.proficiencia ?? 0))
        .slice(0, 6),
    [courseStats, lowProfThreshold],
  );

  const concept3HighProf = useMemo(
    () =>
      courseStats
        .filter(
          (course) =>
            course.conceito === 3 &&
            typeof course.proficiencia === "number" &&
            course.proficiencia >= highProfThreshold,
        )
        .sort((a, b) => (b.proficiencia ?? 0) - (a.proficiencia ?? 0))
        .slice(0, 6),
    [courseStats, highProfThreshold],
  );

  const smallCoursesHighPerf = useMemo(
    () =>
      courseStats
        .filter(
          (course) =>
            course.participantes > 0 &&
            course.participantes <= smallThreshold &&
            (course.performance ?? 0) >= perfHigh,
        )
        .sort((a, b) => (b.performance ?? 0) - (a.performance ?? 0))
        .slice(0, 6),
    [courseStats, perfHigh, smallThreshold],
  );

  const ufLowParticipation = useMemo(
    () =>
      ufStats
        .filter((item) => typeof item.participationRate === "number")
        .sort((a, b) => (a.participationRate ?? 0) - (b.participationRate ?? 0))
        .slice(0, 8),
    [ufStats],
  );

  const iesFullParticipation = useMemo(
    () =>
      iesStats
        .filter((item) => (item.participationRate ?? 0) >= 0.999)
        .slice(0, 8),
    [iesStats],
  );

  const faculdadesUniversidades = useMemo(
    () =>
      orgGroupStats.filter(
        (item) => item.label === "Faculdade" || item.label === "Universidade",
      ),
    [orgGroupStats],
  );

  const iesConsistency = useMemo(() => {
    const map = new Map<string, number[]>();
    for (const course of courseStats) {
      if (typeof course.performance !== "number") continue;
      const current = map.get(course.ies) ?? [];
      current.push(course.performance * 100);
      map.set(course.ies, current);
    }
    return iesStats.map((item) => ({
      ...item,
      consistency: getStdDev(map.get(item.label) ?? []),
    }));
  }, [courseStats, iesStats]);

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

      <DashboardLegend />

      <StatGrid
        items={[
          { label: "Cursos", value: numberFormatter.format(totalCourses) },
          { label: "IES", value: numberFormatter.format(uniqueIes) },
          {
            label: "Participantes",
            value: numberFormatter.format(totalParticipants),
          },
          {
            label: "Proficiencia media",
            value: formatPercent(profMedia),
            tone: "brand",
          },
          {
            label: "Conceito medio",
            value: conceitoMedio ? conceitoMedio.toFixed(2) : "-",
          },
          {
            label: "Taxa participacao",
            value: formatRate(taxaParticipacao),
          },
        ]}
        columns="grid gap-3 md:grid-cols-3 xl:grid-cols-6"
      />

      <SectionUfIes ufTop={ufTopByParticipants} iesTop={iesTopByParticipants} />

      <SectionQualityScale
        corrParticipantsConcept={corrParticipantsConcept}
        corrParticipantsProf={corrParticipantsProf}
        corrParticipantsPerf={corrParticipantsPerf}
        corrIesCoursesPerformance={corrIesCoursesPerformance}
        smallCourseConcept={smallCourseConcept}
        smallCourseProf={smallCourseProf}
        smallCoursePerf={smallCoursePerfScore}
        largeCourseConcept={largeCourseConcept}
        largeCourseProf={largeCourseProf}
        largeCoursePerf={largeCoursePerfScore}
        ufTopByCourses={ufTopByCourses}
      />

      <SectionCharts
        courseStats={courseStats}
        ufStats={ufStats}
        orgGroupStats={orgGroupStats}
        totalParticipants={totalParticipants}
      />

      <SectionConcentration
        ufHighConcept={ufHighConcept}
        ufLowConcept={ufLowConcept}
        participantsShareByUf={participantsShareByUf}
        top10UfCoursesShare={top10UfCoursesShare}
        top10IesParticipantsShare={top10IesParticipantsShare}
      />

      <SectionInstitutional
        categoriaTop={categoriaTop}
        orgTop={orgTop}
        adminStats={adminStats}
        faculdadesUniversidades={faculdadesUniversidades}
      />

      <SectionGeography
        ufPerformanceWeighted={ufPerformanceWeighted}
        municipioMulti={municipioMulti}
        municipioRanking={municipioRanking}
        capitalStats={capitalStats}
      />

      <SectionParticipation
        corrParticipationConcept={corrParticipationConcept}
        corrParticipationProf={corrParticipationProf}
        corrParticipationPerf={corrParticipationPerf}
        ufLowParticipation={ufLowParticipation}
        iesFullParticipation={iesFullParticipation}
      />

      <SectionOutliers
        concept5LowProf={concept5LowProf}
        concept3HighProf={concept3HighProf}
        ufFewHigh={ufFewHigh}
        iesManyLow={iesManyLow}
        smallCoursesHighPerf={smallCoursesHighPerf}
      />

      <SectionSimulation
        totalParticipants={totalParticipants}
        estimatedProficient={estimatedProficient}
        simulatedTopQuartile={simulatedTopQuartile}
        simulatedTarget90={simulatedTarget90}
        topQuartileProf={topQuartileProf}
      />

      <SectionDistribution items={conceptDistItems} />

      <SectionConsistency iesConsistency={iesConsistency} />
    </div>
  );
}
