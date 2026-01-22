# Dados e estrutura da planilha

## Origem
- Arquivo base: `public/data/conceito-enade-2025-medicina.xlsx`
- Fonte: ENADE / INEP
- Escopo: cursos de Medicina avaliados no ciclo 2025

## Colunas esperadas

| Campo | Uso no dashboard |
| --- | --- |
| Ano | Filtro temporal (se houver multiplos anos) |
| Codigo da Area | Identificador da area de avaliacao |
| Area de Avaliacao | Nome da area (Medicina) |
| Grau Academico | Graduacao, tecnologo, etc. |
| Codigo da IES | Identificador institucional |
| Nome da IES | Base para ranking e busca |
| Sigla da IES | Apoio visual nos cards e tabela |
| Organizacao Academica | Filtro institucional |
| Categoria Administrativa | Filtro institucional |
| Codigo do Curso | Identificador do curso |
| Codigo do Municipio | Identificador do municipio |
| Municipio do Curso | Apoio geografico |
| Sigla da UF | Filtro principal por estado |
| N de Concluintes Inscritos | Base para volume |
| N de Concluintes Participantes | Indicador de adesao |
| Total de Concluintes Participantes Igual ou Acima da Proficiencia | Resultado absoluto |
| Percentual de Concluintes Participantes Igual ou Acima da Proficiencia | KPI principal |
| Conceito Enade (Faixa) | Faixa de desempenho |

## Normalizacao aplicada
- Remocao de acentos e padronizacao de chaves para localizar colunas.
- Conversao de numeros com separador decimal brasileiro.
- Tratamento de vazios como string vazia ou nulo.

## Premissas de interpretacao
- O percentual de proficiencia e tratado como valor direto (0-100).
- Linhas sem IES e sem UF sao descartadas por consistencia.

## Possiveis evolucoes
- Validacao de consistencia por curso e IES.
- Inclusao de series historicas para comparacao.
- Enriquecimento com dados socioeconomicos ou demograficos.

