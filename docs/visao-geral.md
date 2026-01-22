# Visao geral do projeto

## Contexto
O projeto ENAMED 2025 tem como base a planilha `public/data/conceito-enade-2025-medicina.xlsx`, com dados oficiais sobre o desempenho de cursos de Medicina no Brasil. A proposta e transformar a base em um painel institucional, claro e acionavel.

## Objetivos principais
- Centralizar indicadores de desempenho em um unico dashboard.
- Permitir filtros dinamicos por UF, IES, organizacao academica e categoria administrativa.
- Apoiar analises comparativas e tomadas de decisao regulatoria e academica.
- Oferecer uma experiencia de uso profissional, limpa e responsiva.

## Publico-alvo
- Gestores academicos e direcoes de cursos.
- Times de regulacao e avaliacao institucional.
- Analistas de dados educacionais e pesquisadores.

## KPIs priorizados
- Total de IES avaliadas.
- Total de cursos de Medicina avaliados.
- Total de concluintes participantes.
- Percentual medio de concluintes acima da proficiencia.
- Distribuicao do conceito ENADE (faixa).

## Escopo do dashboard
- Visao geral com indicadores e distribuicoes.
- Filtros sempre disponiveis e responsivos.
- Tabela completa para leitura detalhada.
- Destaques estrategicos (top IES, UFs com maior volume).

## Tecnologia base
- Next.js para rendering client-side e server-side.
- Leitura da planilha no servidor com cache interno.
- Componentes de UI reutilizaveis com Tailwind.

