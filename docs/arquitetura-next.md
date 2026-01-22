# Arquitetura em Next.js

## Visao geral
O projeto utiliza o App Router do Next.js para combinar renderizacao server-side e interatividade client-side. A leitura da planilha ocorre no servidor para evitar exposicao do arquivo completo no browser e permitir processamento centralizado.

## Fluxo de dados
1. `app/lib/enamed.ts` carrega a planilha e converte para objetos.
2. Os dados normalizados sao enviados para componentes client-side.
3. Os filtros sao aplicados no client para resposta imediata.

## Pastas principais
- `app/` - paginas e componentes do dashboard.
- `app/components/` - layout, sidebar, componentes client-side.
- `app/lib/` - leitura da planilha e tipos compartilhados.
- `public/data/` - arquivo `.xlsx` oficial.
- `docs/` - documentacao funcional e tecnica.

## Caching
`getEnamedData` utiliza `cache` do React para evitar leituras repetidas durante o ciclo de renderizacao.

## Ponto de extensao
- API interna para exportacao (CSV/JSON).
- Gatilhos de revalidacao caso a planilha seja atualizada.

