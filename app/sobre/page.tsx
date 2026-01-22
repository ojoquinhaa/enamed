import DashboardShell from "../components/DashboardShell";

export default function SobrePage() {
  return (
    <DashboardShell active="sobre" lastUpdated={null}>
      <section className="rounded-md border border-border bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              ENAMED
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              Sobre
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="rounded-md border border-border bg-white px-3 py-1 text-slate-600">
              MEC
            </span>
            <span className="rounded-md bg-brand px-3 py-1 text-white">
              2025
            </span>
          </div>
        </div>
      </section>

      <article className="rounded-md border border-border bg-white p-6 text-sm leading-7 text-slate-700">
        <h2 className="text-base font-semibold text-slate-900">
          Enamed: divulgadas avaliacao dos cursos de medicina e medidas de
          supervisao
        </h2>
        <p className="mt-3">
          Ao todo, 204 cursos de medicina do Sistema Federal de Ensino obtiveram
          conceito Enade satisfatorio. Outros 99 ficaram com conceito 1 e 2 e
          passarao por medidas de supervisao do MEC.
        </p>
        <div className="mt-6 space-y-4">
          <p>
            O Ministerio da Educacao (MEC) e o Ministerio da Saude (MS)
            divulgaram, nesta segunda-feira, 19 de janeiro, a analise dos
            resultados do Exame Nacional de Avaliacao da Formacao Medica
            (Enamed) 2025. O Enamed e a modalidade do Exame Nacional de
            Desempenho dos Estudantes (Enade) para os cursos de medicina e
            permite o aproveitamento de seus resultados nos processos seletivos
            de programas de residencia medica. Os resultados apresentados
            referem-se aos 351 cursos de medicina que participaram do Enamed
            2025. Desses, 304 pertencem ao Sistema Federal de Ensino, que inclui
            as instituicoes publicas federais e as instituicoes privadas. Os
            demais sao regulados pelos sistemas estaduais. Os resultados finais
            dos cursos avaliados estao disponiveis aqui.
          </p>
          <p>
            Os resultados individuais dos participantes do Enamed foram
            divulgados no dia 12 de dezembro de 2025. Os candidatos sao
            classificados conforme os criterios adicionais estabelecidos no
            edital do Exame Nacional de Residencia (Enare). A nota final sera
            divulgada em 21 de janeiro de 2026.
          </p>
          <p>
            De acordo com a analise, dos 304 cursos de medicina de instituicoes
            de educacao superior publicas federais e privadas que participaram
            do Enamed, 204 (67,1%) alcancaram conceito 3 a 5 do Enade,
            considerados satisfatorios. Outros 99 cursos (32%) obtiveram
            conceito Enade nas faixas 1 e 2 - menos de 60% dos seus estudantes
            apresentaram desempenho considerado adequado no Enamed - e passarao
            por acoes de supervisao da Secretaria de Regulacao e Supervisao da
            Educacao Superior (Seres) do MEC.
          </p>
          <p className="text-slate-600">
            Leia mais: Cursos de medicina com baixo desempenho passarao por
            supervisao
          </p>
          <p>
            O ministro da Educacao, Camilo Santana, reforcou o papel do Enamed
            como um instrumento de diagnostico da formacao medica no pais,
            mostrando as instituicoes que estao tendo um bom desempenho e que
            precisam melhorar. Para ele, e fundamental que os medicos tenham uma
            boa formacao para garantir o atendimento dos cidadaos nos hospitais,
            postos de saude e Unidades de Pronto Atendimento (UPAs). &quot;Ha uma
            grande preocupacao nos ministerios da Educacao e da Saude em
            assegurar que os cursos oferecidos aos alunos brasileiros possam
            garantir a qualidade da formacao medica nesse pais, ate porque sao
            profissionais que cuidam da vida das pessoas&quot;.
          </p>
          <p>
            Santana destacou que os resultados do Enamed mostraram que 85% dos
            cursos municipais foram considerados insatisfatorios. Tambem
            ressaltou que mais de 80% dos cursos superiores de medicina no
            Brasil sao oferecidos por instituicoes de ensino superior privadas e
            que instituicoes que cobram mensalidade dos alunos devem apresentar
            qualidade no ensino. &quot;O que estamos avaliando e se os cursos tem uma
            boa infraestrutura, se eles tem monitoria, laboratorio, se tem bons
            professores. E isso a gente so pode fazer avaliando os resultados e,
            tambem, dialogando com as instituicoes para que possam melhorar&quot;,
            considerou.
          </p>
          <p>
            Sobre as medidas aplicadas as universidades cujos concluintes nao
            atingiram o nivel minimo de aprendizagem ao final do curso - como a
            supervisao ou a suspensao das graduacoes - Santana destacou que
            nenhum aluno sera prejudicado. Segundo ele, o objetivo &quot;nao e
            aplicar sancoes ou penalidades intencionais a qualquer instituicao,
            mas assegurar a formacao de medicos de qualidade no Brasil&quot;.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Acoes de supervisao
          </h3>
          <p>
            Os cursos com conceito 1 e 2 pertencem a 93 instituicoes de educacao
            superior e estao sujeitos a um processo de supervisao, com a
            aplicacao de diferentes medidas cautelares, de forma escalonada,
            conforme o percentual de concluintes considerados proficientes.
            Quanto maior o risco ou ameaca ao interesse publico e aos
            estudantes, mais graves serao as medidas adotadas.
          </p>
          <p>
            Na faixa 1, oito cursos tiveram menos de 30% de concluintes
            proficientes e sofrerao suspensao de ingresso. Ja os 13 cursos que
            tiveram o percentual de proficiencia entre 30% e 40% terao reducao
            de 50% da oferta de vagas. Na faixa 2, os 33 cursos com 40% a 50% de
            concluintes proficientes passam por reducao de 25% das vagas.
          </p>
          <p>
            Esses tres primeiros grupos estao impedidos de ampliar vagas e terao
            suspensa a participacao no Fundo de Financiamento Estudantil (Fies)
            e em outros programas federais.
          </p>
          <p>
            Os 45 cursos da faixa 2 que tiveram percentual de proficiencia acima
            de 50% sofrerao apenas a proibicao de aumento de vagas, sem medidas
            cautelares especificas adicionais, por ora.
          </p>
          <p>
            Cabe a Seres dar ciencia as instituicoes responsaveis por esses
            cursos acerca da instauracao de um processo administrativo de
            supervisao, podendo a instituicao se manifestar, no prazo de 30
            dias, e requerer a concessao de prazo para saneamento das
            deficiencias. As medidas devem durar ate a publicacao do Conceito
            Enade 2026.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Balanco</h3>
          <p>
            De acordo com o levantamento do Instituto Nacional de Estudos e
            Pesquisas Educacionais Anisio Teixeira (Inep), o exame avaliou
            89.024 estudantes e profissionais de medicina, dos quais 75%
            obtiveram desempenho proficiente. Entre eles, 39.258 eram estudantes
            concluintes do curso. Desses, 67% tiveram proficiencia. Ja o publico
            geral (49.766), que inclui medicos formados e inscritos no Exame
            Nacional de Residencia (Enare), teve 81% dos participantes com
            proficiencia.
          </p>
          <p className="text-slate-600">
            Leia mais: Enamed: mais de 96 mil inscricoes foram confirmadas
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Conceito Enade
          </h3>
          <p>
            Ao analisar a distribuicao dos cursos por Conceito Enade, o
            levantamento mostra que um curso ficou sem conceito (SC) e teve
            menos de 10 estudantes avaliados.
          </p>
          <p>
            Entre os cursos avaliados, 24 (7,1%) obtiveram conceito 1, com ate
            39,9% de estudantes proficientes. O conceito 2 foi atribuido a 83
            cursos (23,6%), que apresentaram entre 40% e 59,9% de alunos
            proficientes. Ja 80 cursos (22,7%) alcancaram o conceito 3, com
            percentuais entre 60% e 74,9%.
          </p>
          <p>
            Na faixa superior, 114 cursos (33,0%) obtiveram conceito 4, com 75%
            a 89,9% de estudantes proficientes, enquanto 49 cursos (13,6%)
            alcancaram o conceito maximo, 5, ao registrar percentual igual ou
            superior a 90% de alunos proficientes.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Categoria administrativa
          </h3>
          <p>
            Na analise por categoria administrativa, 6.502 estudantes das
            instituicoes de educacao superior federal foram avaliados, dos quais
            83,1% dos estudantes de medicina alcancaram percentual de
            proficiencia. Entre os estudantes de medicina das instituicoes
            estaduais, 86,6% dos 2.402 avaliados tiveram proficiencia. Ja as
            instituicoes de educacao superior municipais tiveram 944 estudantes
            participantes no exame, dos quais 49,7% tiveram conceito
            proficiente.
          </p>
          <p>
            As instituicoes privadas com fins lucrativos tiveram 15.409
            estudantes participantes, sendo 57,2% deles com resultado
            proficiente no curso de medicina; e as instituicoes privadas sem
            fins lucrativos foram representadas por 12.960 estudantes, dos quais
            70,1% alcancaram a proficiencia.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Enare</h3>
          <p>
            O Enamed aprimora a selecao para a residencia medica e unifica a
            avaliacao do Enade e a prova teorica do Enare, otimizando o acesso a
            residencia na area medica de acesso direto. O Exame Nacional de
            Residencia e uma iniciativa que democratiza o acesso a residencias
            medicas (acesso direto e com pre-requisitos), multiprofissional e em
            area profissional da saude dos hospitais universitarios federais,
            assim como de instituicoes publicas e privadas com e sem fins
            lucrativos que fizerem adesao.
          </p>
          <p>
            Em 2025, o Enare contou com a participacao de 262 instituicoes, um
            crescimento de 61,7% em relacao com a edicao de 2024, que teve 162
            instituicoes participantes. Em 2022, o exame contava apenas com 92
            instituicoes. O numero de inscritos tambem aumentou, passando de
            53.172 inscricoes em 2024 para 87.035, em 2025, um crescimento de
            63,7%. Esse percentual e muito maior ao comparar com a edicao de
            2022, quando o numero de inscricoes era de apenas 27.755,
            representando um crescimento de aproximadamente 213,6% no periodo.
          </p>
          <p>
            Ao comparar com a oferta de residencia medica, o crescimento do
            Enare e nitido. O numero de programas passou de 790, em 2022, para
            1.868, em 2025 - um aumento absoluto de 1.078 programas, um
            crescimento de aproximadamente 136,5% no periodo.
          </p>
          <p>
            A evolucao da serie historica segue no comparativo das ofertas de
            vagas de residencia medica. Em 2025, foram ofertadas 7.197 vagas
            pelo Enare, enquanto, em 2024, o programa ofereceu 4.998. Ao
            comparar a ultima edicao com a de 2022, que teve 2.682 vagas
            ofertadas, o crescimento no periodo representa 168,3%.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Enamed</h3>
          <p>
            O Exame Nacional de Avaliacao da Formacao Medica sera realizado
            anualmente, com inicio em 2025, e unificara as matrizes de
            referencia e os instrumentos de avaliacao no ambito do Enade para os
            cursos de medicina e da prova objetiva de acesso direto ao Enare. O
            novo exame possui relevancia estrategica nacional, no escopo da
            avaliacao da formacao medica no Brasil, e seus resultados impactam
            diretamente o Sistema Unico de Saude (SUS) e o ingresso de novos
            medicos no mercado de trabalho.
          </p>
          <p>
            O MEC prospecta um ciclo de fortalecimento mutuo entre os exames.
            Para o ministerio, o Enamed impulsiona o engajamento dos estudantes
            no Enade, tendo em vista que a nota pode servir como meio de
            ingresso em programas de residencia medica de acesso direto. Isso
            tem impacto positivo para o Enare, visto que todos os concluintes
            dos cursos de medicina passarao a fazer a prova anualmente.
          </p>
          <p>
            O novo resultado, baseado em padroes de desempenho, traz um
            aperfeicoamento importante na avaliacao desses cursos, permitindo
            que os cursos de medicina passem a ter resultados divulgados em uma
            escala interpretativa dos padroes de desempenho esperados ao final
            da graduacao. Aliado a periodicidade anual, o formato permitira o
            monitoramento da qualidade dos cursos de medicina ao longo dos anos.
          </p>
          <p>
            A utilizacao dos resultados do Enamed para fins de acesso aos
            programas de residencia medica garante maior interesse e engajamento
            dos estudantes na realizacao do exame e resultados mais fidedignos
            para avaliacao dos cursos. Alem disso, os resultados baseados em
            padroes de desempenho fornecem informacoes mais completas e passam a
            subsidiar melhor as politicas de regulacao, supervisao,
            financiamento e inducao da qualidade dos cursos. A periodicidade
            anual de realizacao do exame garante que todos os alunos passem pela
            prova, ampliando a amostra de estudantes avaliados e minimizando os
            riscos de resultados enviesados. Alem de garantir que o ingresso na
            residencia seja mais qualificado.
          </p>
        </div>

        <div className="mt-8 text-xs text-slate-500">
          Assessoria de Comunicacao Social do MEC, com informacoes da Seres, da
          Empresa Brasileira de Servicos Hospitalares (Ebserh) e do Inep.
        </div>
      </article>
    </DashboardShell>
  );
}
