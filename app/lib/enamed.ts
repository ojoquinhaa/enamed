import "server-only";

import fs from "fs/promises";
import path from "path";
import { cache } from "react";
import * as XLSX from "xlsx";
import type { EnamedData, EnamedOptions, EnamedRow } from "./enamed-types";

const normalizeKey = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u00BA\u00B0]/g, "o")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const toText = (value: unknown) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const toNumber = (value: unknown) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const normalized = String(value).replace(/\./g, "").replace(",", ".");
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : null;
};

const normalizePercent = (value: number | null) => {
  if (value === null) return null;
  if (value >= 0 && value <= 1) return value * 100;
  return value;
};

const KEY_MAP = {
  ano: ["ano"],
  codigoArea: ["codigo da area"],
  areaAvaliacao: ["area de avaliacao"],
  grauAcademico: ["grau academico"],
  codigoIes: ["codigo da ies"],
  nomeIes: ["nome da ies", "nome da ies*"],
  siglaIes: ["sigla da ies", "sigla da ies*"],
  organizacaoAcademica: ["organizacao academica"],
  categoriaAdministrativa: ["categoria administrativa"],
  codigoCurso: ["codigo do curso"],
  codigoMunicipio: ["codigo do municipio"],
  municipioCurso: ["municipio do curso"],
  uf: ["sigla da uf", "uf"],
  inscritos: ["no de concluintes inscritos"],
  participantes: ["no de concluintes participantes"],
  totalAcimaProficiencia: [
    "total de concluintes participantes igual ou acima da proficiencia",
  ],
  percentualAcimaProficiencia: [
    "percentual de concluintes participantes igual ou acima da proficiencia",
  ],
  conceito: ["conceito enade (faixa)"],
};

const normalizeRow = (row: Record<string, unknown>) => {
  const normalized = new Map<string, unknown>();
  for (const [key, value] of Object.entries(row)) {
    normalized.set(normalizeKey(key), value);
  }
  return normalized;
};

const pickValue = (row: Map<string, unknown>, candidates: string[]) => {
  for (const candidate of candidates) {
    if (row.has(candidate)) return row.get(candidate);
  }
  return undefined;
};

const parseRow = (row: Record<string, unknown>): EnamedRow => {
  const normalized = normalizeRow(row);
  return {
    ano: toNumber(pickValue(normalized, KEY_MAP.ano)),
    codigoArea: toText(pickValue(normalized, KEY_MAP.codigoArea)),
    areaAvaliacao: toText(pickValue(normalized, KEY_MAP.areaAvaliacao)),
    grauAcademico: toText(pickValue(normalized, KEY_MAP.grauAcademico)),
    codigoIes: toText(pickValue(normalized, KEY_MAP.codigoIes)),
    nomeIes: toText(pickValue(normalized, KEY_MAP.nomeIes)),
    siglaIes: toText(pickValue(normalized, KEY_MAP.siglaIes)),
    organizacaoAcademica: toText(
      pickValue(normalized, KEY_MAP.organizacaoAcademica),
    ),
    categoriaAdministrativa: toText(
      pickValue(normalized, KEY_MAP.categoriaAdministrativa),
    ),
    codigoCurso: toText(pickValue(normalized, KEY_MAP.codigoCurso)),
    codigoMunicipio: toText(pickValue(normalized, KEY_MAP.codigoMunicipio)),
    municipioCurso: toText(pickValue(normalized, KEY_MAP.municipioCurso)),
    uf: toText(pickValue(normalized, KEY_MAP.uf)),
    inscritos: toNumber(pickValue(normalized, KEY_MAP.inscritos)),
    participantes: toNumber(pickValue(normalized, KEY_MAP.participantes)),
    totalAcimaProficiencia: toNumber(
      pickValue(normalized, KEY_MAP.totalAcimaProficiencia),
    ),
    percentualAcimaProficiencia: normalizePercent(
      toNumber(pickValue(normalized, KEY_MAP.percentualAcimaProficiencia)),
    ),
    conceito: toText(pickValue(normalized, KEY_MAP.conceito)),
  };
};

const uniqueSorted = (values: string[]) =>
  Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );

const buildOptions = (rows: EnamedRow[]): EnamedOptions => ({
  ufs: uniqueSorted(rows.map((row) => row.uf)),
  ies: uniqueSorted(rows.map((row) => row.nomeIes)),
  organizacoes: uniqueSorted(rows.map((row) => row.organizacaoAcademica)),
  categorias: uniqueSorted(rows.map((row) => row.categoriaAdministrativa)),
});

export const getEnamedData = cache(async (): Promise<EnamedData> => {
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    "conceito-enade-2025-medicina.xlsx",
  );

  const [buffer, stats] = await Promise.all([
    fs.readFile(filePath),
    fs.stat(filePath),
  ]);

  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });

  const rows = rawRows.map(parseRow).filter((row) => row.nomeIes || row.uf);
  const options = buildOptions(rows);

  return {
    rows,
    options,
    lastUpdated: stats?.mtime ? stats.mtime.toISOString() : null,
  };
});
