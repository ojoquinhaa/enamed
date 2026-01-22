export type EnamedRow = {
  ano: number | null;
  codigoArea: string;
  areaAvaliacao: string;
  grauAcademico: string;
  codigoIes: string;
  nomeIes: string;
  siglaIes: string;
  organizacaoAcademica: string;
  categoriaAdministrativa: string;
  codigoCurso: string;
  codigoMunicipio: string;
  municipioCurso: string;
  uf: string;
  inscritos: number | null;
  participantes: number | null;
  totalAcimaProficiencia: number | null;
  percentualAcimaProficiencia: number | null;
  conceito: string;
};

export type EnamedOptions = {
  ufs: string[];
  ies: string[];
  organizacoes: string[];
  categorias: string[];
};

export type EnamedData = {
  rows: EnamedRow[];
  options: EnamedOptions;
  lastUpdated: string | null;
};
