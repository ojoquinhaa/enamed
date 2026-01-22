import type { EnamedRow } from "./enamed-types";

export type CourseStat = {
  key: string;
  ies: string;
  uf: string;
  municipio: string;
  organizacao: string;
  categoria: string;
  participantes: number;
  inscritos: number;
  acimaProficiencia: number | null;
  proficiencia: number | null;
  conceito: number | null;
  participacao: number | null;
  performance: number | null;
};

export type GroupStat = {
  key: string;
  label: string;
  courses: number;
  iesCount: number;
  participants: number;
  inscritos: number;
  conceptAvg: number | null;
  profAvg: number | null;
  conceptWeighted: number | null;
  profWeighted: number | null;
  participationRate: number | null;
  performanceAvg: number | null;
  conceptDist: Record<string, number>;
};

const CAPITALS_BY_UF: Record<string, string> = {
  AC: "RIO BRANCO",
  AL: "MACEIO",
  AP: "MACAPA",
  AM: "MANAUS",
  BA: "SALVADOR",
  CE: "FORTALEZA",
  DF: "BRASILIA",
  ES: "VITORIA",
  GO: "GOIANIA",
  MA: "SAO LUIS",
  MT: "CUIABA",
  MS: "CAMPO GRANDE",
  MG: "BELO HORIZONTE",
  PA: "BELEM",
  PB: "JOAO PESSOA",
  PR: "CURITIBA",
  PE: "RECIFE",
  PI: "TERESINA",
  RJ: "RIO DE JANEIRO",
  RN: "NATAL",
  RS: "PORTO ALEGRE",
  RO: "PORTO VELHO",
  RR: "BOA VISTA",
  SC: "FLORIANOPOLIS",
  SP: "SAO PAULO",
  SE: "ARACAJU",
  TO: "PALMAS",
};

export const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

export const getConceptNumber = (value: string) => {
  const match = String(value || "").match(/[1-5]/);
  if (!match) return null;
  const numeric = Number(match[0]);
  return numeric >= 1 && numeric <= 5 ? numeric : null;
};

export const getParticipationRate = (
  participantes: number,
  inscritos: number,
) => {
  if (!Number.isFinite(participantes) || !Number.isFinite(inscritos)) return null;
  if (inscritos <= 0) return null;
  return participantes / inscritos;
};

export const getPerformanceScore = (
  conceito: number | null,
  proficiencia: number | null,
) => {
  const values: number[] = [];
  if (typeof conceito === "number") values.push(conceito / 5);
  if (typeof proficiencia === "number") values.push(proficiencia / 100);
  if (!values.length) return null;
  return values.reduce((acc, val) => acc + val, 0) / values.length;
};

export const getExcellenceIndex = (
  conceito: number | null,
  proficiencia: number | null,
) => {
  const score = getPerformanceScore(conceito, proficiencia);
  return score === null ? null : score * 100;
};

export const quantile = (values: number[], q: number) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  const next = sorted[base + 1] ?? sorted[base];
  return sorted[base] + rest * (next - sorted[base]);
};

export const correlation = (pairs: Array<[number, number]>) => {
  if (pairs.length < 2) return null;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;
  for (const [x, y] of pairs) {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
    sumY2 += y * y;
  }
  const n = pairs.length;
  const numerator = n * sumXY - sumX * sumY;
  const denomX = n * sumX2 - sumX * sumX;
  const denomY = n * sumY2 - sumY * sumY;
  if (denomX <= 0 || denomY <= 0) return null;
  return numerator / Math.sqrt(denomX * denomY);
};

const conceptBucket = (concept: number | null) =>
  concept ? String(concept) : "SC";

type GroupAccumulator = {
  key: string;
  label: string;
  courses: number;
  participants: number;
  inscritos: number;
  conceptSum: number;
  conceptCount: number;
  profSum: number;
  profCount: number;
  conceptWeightedSum: number;
  profWeightedSum: number;
  weightSum: number;
  performanceSum: number;
  performanceCount: number;
  conceptDist: Record<string, number>;
  iesSet: Set<string>;
};

const createAccumulator = (key: string, label: string): GroupAccumulator => ({
  key,
  label,
  courses: 0,
  participants: 0,
  inscritos: 0,
  conceptSum: 0,
  conceptCount: 0,
  profSum: 0,
  profCount: 0,
  conceptWeightedSum: 0,
  profWeightedSum: 0,
  weightSum: 0,
  performanceSum: 0,
  performanceCount: 0,
  conceptDist: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, SC: 0 },
  iesSet: new Set<string>(),
});

const addToAccumulator = (acc: GroupAccumulator, row: EnamedRow) => {
  const participantes = Number.isFinite(row.participantes)
    ? (row.participantes as number)
    : 0;
  const inscritos = Number.isFinite(row.inscritos) ? (row.inscritos as number) : 0;
  const conceito = getConceptNumber(row.conceito);
  const prof = Number.isFinite(row.percentualAcimaProficiencia)
    ? (row.percentualAcimaProficiencia as number)
    : null;
  const performance = getPerformanceScore(conceito, prof);

  acc.courses += 1;
  acc.participants += participantes;
  acc.inscritos += inscritos;
  if (row.nomeIes) acc.iesSet.add(row.nomeIes);

  const bucket = conceptBucket(conceito);
  acc.conceptDist[bucket] = (acc.conceptDist[bucket] ?? 0) + 1;

  if (typeof conceito === "number") {
    acc.conceptSum += conceito;
    acc.conceptCount += 1;
  }
  if (typeof prof === "number") {
    acc.profSum += prof;
    acc.profCount += 1;
  }
  if (typeof conceito === "number" && participantes > 0) {
    acc.conceptWeightedSum += conceito * participantes;
  }
  if (typeof prof === "number" && participantes > 0) {
    acc.profWeightedSum += prof * participantes;
  }
  if (participantes > 0) {
    acc.weightSum += participantes;
  }
  if (typeof performance === "number") {
    acc.performanceSum += performance;
    acc.performanceCount += 1;
  }
};

const finalizeAccumulator = (acc: GroupAccumulator): GroupStat => {
  const conceptAvg = acc.conceptCount ? acc.conceptSum / acc.conceptCount : null;
  const profAvg = acc.profCount ? acc.profSum / acc.profCount : null;
  const conceptWeighted = acc.weightSum
    ? acc.conceptWeightedSum / acc.weightSum
    : null;
  const profWeighted = acc.weightSum ? acc.profWeightedSum / acc.weightSum : null;
  const participationRate = getParticipationRate(acc.participants, acc.inscritos);
  const performanceAvg = acc.performanceCount
    ? acc.performanceSum / acc.performanceCount
    : null;

  return {
    key: acc.key,
    label: acc.label,
    courses: acc.courses,
    iesCount: acc.iesSet.size,
    participants: acc.participants,
    inscritos: acc.inscritos,
    conceptAvg,
    profAvg,
    conceptWeighted,
    profWeighted,
    participationRate,
    performanceAvg,
    conceptDist: acc.conceptDist,
  };
};

export const buildGroupStats = (
  rows: EnamedRow[],
  keyFn: (row: EnamedRow) => string,
  labelFn: (row: EnamedRow) => string,
) => {
  const map = new Map<string, GroupAccumulator>();
  for (const row of rows) {
    const key = keyFn(row) || "ND";
    const label = labelFn(row) || "ND";
    const current = map.get(key) ?? createAccumulator(key, label);
    addToAccumulator(current, row);
    map.set(key, current);
  }
  return Array.from(map.values()).map(finalizeAccumulator);
};

export const buildCourseStats = (rows: EnamedRow[]): CourseStat[] =>
  rows.map((row, index) => {
    const participantes = Number.isFinite(row.participantes)
      ? (row.participantes as number)
      : 0;
    const inscritos = Number.isFinite(row.inscritos) ? (row.inscritos as number) : 0;
    const acimaProficiencia = Number.isFinite(row.totalAcimaProficiencia)
      ? (row.totalAcimaProficiencia as number)
      : null;
    const conceito = getConceptNumber(row.conceito);
    const proficiencia = Number.isFinite(row.percentualAcimaProficiencia)
      ? (row.percentualAcimaProficiencia as number)
      : null;
    return {
      key: row.codigoCurso || `${row.codigoIes}-${index}`,
      ies: row.nomeIes || "Nao informado",
      uf: row.uf || "-",
      municipio: row.municipioCurso || "-",
      organizacao: row.organizacaoAcademica || "-",
      categoria: row.categoriaAdministrativa || "-",
      participantes,
      inscritos,
      acimaProficiencia,
      proficiencia,
      conceito,
      participacao: getParticipationRate(participantes, inscritos),
      performance: getPerformanceScore(conceito, proficiencia),
    };
  });

export const getAdminGroup = (value: string) => {
  const normalized = normalizeText(value || "");
  if (normalized.includes("FEDERAL")) return "Publica Federal";
  if (normalized.includes("ESTADUAL")) return "Publica Estadual";
  if (normalized.includes("MUNICIPAL")) return "Publica Municipal";
  if (normalized.includes("PRIVADA")) return "Privada";
  return "Outros";
};

export const getOrganizationGroup = (value: string) => {
  const normalized = normalizeText(value || "");
  if (normalized.includes("UNIVERSIDADE")) return "Universidade";
  if (normalized.includes("FACULDADE")) return "Faculdade";
  if (normalized.includes("CENTRO UNIVERSITARIO")) return "Centro Univ";
  return "Outros";
};

export const buildMunicipioKey = (row: EnamedRow) => {
  if (row.codigoMunicipio) return row.codigoMunicipio;
  const uf = row.uf || "ND";
  const municipio = normalizeText(row.municipioCurso || "");
  return `${uf}-${municipio || "ND"}`;
};

export const isCapital = (row: EnamedRow) => {
  if (!row.uf || !row.municipioCurso) return false;
  const capital = CAPITALS_BY_UF[row.uf];
  if (!capital) return false;
  return normalizeText(row.municipioCurso) === normalizeText(capital);
};

export const getStdDev = (values: number[]) => {
  if (values.length < 2) return null;
  const mean = values.reduce((acc, value) => acc + value, 0) / values.length;
  const variance =
    values.reduce((acc, value) => acc + (value - mean) ** 2, 0) /
    (values.length - 1);
  return Math.sqrt(variance);
};
