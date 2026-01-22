# ENAMED 2025 Dashboard

Dashboard visual para analise dos resultados do ENAMED 2025, com ranking de IES, tabela detalhada, mapa por UF e graficos de distribuicao e correlacao.

## Principais recursos
- Ranking ajustado por amostra (score) com ordenacao asc/desc.
- Tabela estilo planilha com filtros por coluna e ordenacao rapida.
- Mapa por UF com metricas selecionaveis e painel lateral de detalhes.
- Graficos essenciais: distribuicoes, dispersao e pareto.
- Responsivo e focado em leitura rapida.

## Paginas
- `/` Dashboard
- `/ranking` Ranking de IES, cursos e UFs
- `/tabela` Tabela completa com filtros
- `/mapas` Mapa interativo por UF
- `/sobre` Contexto institucional

## Metricas (resumo)
- Performance: `100 x media(conceito/5, prof/100)`
- Proficiencia: `% acima da proficiencia`
- Taxa: `participantes / inscritos`

## Stack
- Next.js (App Router)
- React 19
- Tailwind CSS
- ECharts (graficos e mapa)

## Como rodar
```bash
pnpm install
pnpm dev
```

Abra `http://localhost:3000`.

## Dados
Os dados sao carregados localmente via `app/lib/enamed`. O GeoJSON de UFs fica em `public/data/br-uf.geojson`.

## Scripts
- `pnpm dev` desenvolvimento
- `pnpm build` build de producao
- `pnpm start` servico local
- `pnpm lint` lint

## Observacoes
Este projeto e informativo e nao substitui comunicados oficiais. Para uso institucional, cite a fonte original dos dados.
