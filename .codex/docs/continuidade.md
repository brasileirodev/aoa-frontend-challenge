# Estado e roadmap — Pokédex Explorer

Registro de transferência: 26/10/2026. Estado observado no código nesta data; não é aprovação da entrega.

## Objetivo e escopo

Recuperar fluência de programação por prática manual, aprendendo HTTP, TypeScript, Zod, mapeamento, erros, cache e Server Components do Next. Marcel digita o código; o assistente orienta e revisa. A aplicação base Meridian já existe. Construímos a feature Pokémon desde a integração, preservando sua arquitetura.

Requisito canônico: [US-08 completa](../../scrum/user-stories/us-08-pokedex-explorer.md). A [lista de histórias](../../scrum/user-stories/README.md) e a US já pertencem ao projeto. Não substituir os critérios pelo resumo deste documento.

## Design e API

- [Figma — Pokédex Explorer](https://www.figma.com/design/YwhcG3X1sz9Dd8F6b1WnKr)
- [Catálogo desktop](https://www.figma.com/design/YwhcG3X1sz9Dd8F6b1WnKr?node-id=2-23)
- [Detalhes desktop](https://www.figma.com/design/YwhcG3X1sz9Dd8F6b1WnKr?node-id=2-24)
- [Catálogo mobile](https://www.figma.com/design/YwhcG3X1sz9Dd8F6b1WnKr?node-id=2-25)
- [Detalhes mobile](https://www.figma.com/design/YwhcG3X1sz9Dd8F6b1WnKr?node-id=2-26)
- [Estados](https://www.figma.com/design/YwhcG3X1sz9Dd8F6b1WnKr?node-id=2-27)
- [PokéAPI v2](https://pokeapi.co/docs/v2): GET público, sem autenticação.
- Listagem: `https://pokeapi.co/api/v2/pokemon?limit=6&offset=0`.
- Detalhe: `https://pokeapi.co/api/v2/pokemon/1` ou nome completo.

O Figma contém referências editáveis, não um protótipo navegável comprovado. Os frames não foram reabertos nesta transferência. A outra máquina precisa de acesso ao mesmo arquivo remoto.

## Arquitetura e decisões aceitas

- Reorganização autorizada em 27/10/2026: ver [arquitetura do portfólio](arquitetura.md). AOA e Pokémon são projetos independentes na mesma aplicação. A sugestão anterior de `lib/pokemon-query.ts` foi substituída por `modules/pokemon/routing/query.ts`, ainda não implementado. A autorização excepcional de editar código destinou-se à reorganização, não à conclusão automática do exercício.

- `modules/pokemon/api/`: acesso externo, schemas, erros, constantes, modelos para UI e mapper.
- `app/`: rotas e composição; a página server pode chamar a integração diretamente. Não criar rota `app/api` só para a página do servidor chamar a própria aplicação.
- Projetos independentes em `modules/aoa` e `modules/pokemon`. Componentes de negócio ficam no respectivo módulo; UI reutilizável em `shared/components`, mantendo atoms/molecules/organisms/templates. Reutilizar wrappers MUI e tokens. Ver [arquitetura](arquitetura.md).
- Next 16.2.10 e React 19.2.4 declarados; Zod 3, Tailwind 4, TypeScript, Vitest. Conferir lockfile ao retomar.
- Marcador `server-only` na integração. Não recomendar instalação obrigatória sem verificar o suporte da versão do Next.
- Cache de fetch: `next.revalidate = 3600`; não é um cron. `cacheComponents` não está habilitado na configuração observada. Cache real ainda não validado em produção local.
- `unknown` no JSON antes de `safeParse`; tipos externos inferidos do schema. Modelos da UI explícitos e simplificados pelo mapper.
- `sortBySlot<T extends { slot: number }>` exige slot e ordena cópia. O Zod garante slot na entrada externa; não inserir checagem redundante de propriedade na função.
- `Promise.all` busca detalhes da página, conserva a ordem de entrada e propaga falha; não apresentar grade parcial como sucesso.

## Implementado e revisado incrementalmente

| Arquivo                                      | Conteúdo observado                                                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `modules/pokemon/api/constants.ts`           | URL base, seis itens por página, revalidação de 3600 segundos                                                       |
| `modules/pokemon/api/errors.ts`              | PokemonApiError: INVALID_INPUT, NOT_FOUND, NETWORK_ERROR, HTTP_ERROR, INVALID_RESPONSE                              |
| `modules/pokemon/api/schema.ts`              | Identificador normalizado; Pokémon com tipos, sprites, habilidades, stats; resposta paginada                        |
| `modules/pokemon/models/pokemon.ts`          | Pokemon, habilidades/stats e PokemonPage                                                                            |
| `modules/pokemon/api/mappers.ts`             | Nome/ID de exibição, altura e peso divididos por 10, ordenação por slot, imagens e alternativa, habilidades e stats |
| `modules/pokemon/api/index.ts`               | getPokemon, getPokemonList e getPokemonPage; última etapa com defeito pendente abaixo                               |
| `modules/pokemon/presentation/formatters.ts` | Capitalização, ID com padStart e sortBySlot sem mutação                                                             |
| `.vscode/`                                   | Format on save com Prettier e correções ESLint; recomendações de extensões                                          |

Esses itens não significam que a feature inteira está pronta. O mapper preserva os nomes das stats para a UI identificar cada uma, sem depender da posição. O fallback de imagem no carregamento ainda pertence à futura interface.

## Ponto exato de parada — NÃO VALIDADO

Em `getPokemonPage`, o código calcula `totalPages` com Math.ceil e mínimo 1, busca a primeira página quando a solicitada excede o total, mas retorna `page` em vez de `page: currentPage`.

Primeira ação do aluno: corrigir a propriedade retornada. Primeira ação do revisor: reler o arquivo para confirmar se já foi corrigido e testar o comportamento. Não aplicar automaticamente a correção.

Efeito reproduzido na sessão anterior: solicitação da página 500, catálogo vazio simulado, consultas com offsets 2994 e 0, mas resultado com page 500. Compilação passou: o erro é de comportamento.

Antes de aprovar: testar página normal, página além do total, última página parcial e catálogo vazio; conferir itens, número efetivo e indicadores de anterior/próxima. Página 0, negativa, fracionária e offset inseguro ainda são rejeitados pela camada de listagem. A normalização do texto da URL não foi implementada.

## Evidências e limites

Histórico de verificações desta conversa, não uma execução nova em outra máquina:

- TypeScript passou nas revisões incrementais, inclusive com o defeito atual de paginação.
- Scripts temporários em memória verificaram schemas, unidades, ordenação sem mutação, normalização de ID, fallback nulo, habilidades/stats, erros de fetch e Promise.all.
- Houve consultas reais ao Bulbasaur e à primeira listagem. Não são testes determinísticos versionados.
- Não há aprovação final de lint, build, cobertura, interface, acessibilidade ou cache no runtime Next.
- Testes formais Pokémon e rotas/componentes da feature não estão registrados como concluídos. Verificar a árvore real ao retomar.

## Roadmap de continuidade

Atualização de ritmo em 27/10/2026: Marcel adiou explicitamente os testes unitários Pokémon durante a fase exploratória. O item de testes formais abaixo fica para uma etapa posterior, sem impedir a normalização da URL ou a futura página mínima. Revisar código, tipos e comportamentos pontuais continua permitido. Não reduzir os limites nem apresentar cobertura pendente como aprovada. Nenhum teste unitário Pokémon foi criado na reorganização.

1. **Atual — correção e validação:** retornar a página efetiva; testes de borda descritos acima.
2. **Entrada da URL:** normalizar page ausente, vazia, repetida, não numérica, zero, negativa, fracionária e fora da faixa segura para página 1. Definir política explícita para parâmetros repetidos. Manter q com precedência sobre page. Não aceitar strings parcialmente numéricas por parseInt sem validação.
3. **Testes da integração:** o aluno escreve testes Vitest controlados de sucesso, erro, schema, mapper, cache configurado e paginação. Ajustar isolamento de server-only conforme runtime de testes, sem removê-lo do código de produção.
4. **Página server mínima:** criar `/pokemon` consumindo a integração; confirmar API e cache no Next antes de montar toda a interface. Verificar a assinatura atual de searchParams na documentação da versão instalada.
5. **Catálogo e design (CA-01/06/07):** cards com imagem, nome, ID, tipos, link de detalhes; grade 1/2/3 colunas, tokens e wrappers existentes; tratamento de imagem alternativa e indisponível sem loop.
6. **Paginação (CA-02):** URL compartilhável, anterior/próxima, carregamento sem ações duplicadas, volta ao início dos resultados; sincronizar URL e página efetiva após normalização.
7. **Busca exata (CA-03):** nome/ID em toda a API, submit por Enter/botão, normalização, validação vazia, resultado único, limpar busca, URL e estados de 404/rede.
8. **Detalhes (CA-04):** `/pokemon/[id]`, imagem, tipos, unidades pt-BR, habilidades ocultas, seis stats identificadas pelo nome, barras limitadas a 0–255; retorno ao catálogo preservando origem e fallback para acesso direto.
9. **Estados e navegação (CA-05):** skeletons, erro e tentar novamente preservando consulta, vazio, falhas parciais e respostas antigas; acesso direto e refresh.
10. **Qualidade e entrega (CA-06/08):** teclado, foco, anúncios, responsividade nos tamanhos da US; testes formais, comandos finais, comparação com Figma e documentação de cache/limitações.

Cada item deve ser subdividido em pequenas etapas didáticas. Não implementar todo este roadmap em uma resposta nem considerar sua ordem autorização para escrever código pelo aluno.

## Critério de conclusão

Todos os CA-01 a CA-08 da US, não apenas integração funcionando. Rodar lint, typecheck, format:check, testes/cobertura e build; preservar limites de cobertura de 100% definidos no projeto. Registrar falhas preexistentes separadamente. Fazer revisão funcional no navegador e comparar com Figma. Não declarar entrega aprovada enquanto houver pendências.

## Registro para a próxima sessão

### Proposta de interpretação de q — 27/10/2026

Próximo incremento manual curto: adicionar `parsePokemonSearch` a `modules/pokemon/routing/query.ts`, retornando undefined para q ausente ou `pokemonIdentifierSchema.safeParse(value)` para q presente. Reutiliza normalização existente e preserva distinção entre ausência, busca válida e busca inválida, incluindo arrays/repetição rejeitados e espaços vazios sem requisição. A presença de q terá precedência sobre page ao conectar à página no incremento seguinte. Context7 Next e Zod consultados. Helper apenas proposto; a busca ainda não consulta Pokémon na página. Nenhum código da aplicação foi alterado nesta orientação.

### Primeira revisão do formulário de busca — 27/10/2026

Formulário implementado e composto abaixo do cabeçalho. action /pokemon, name q e botão submit corretos. TypeScript, ESLint e Prettier passaram no escopo. Pendências por leitura: corrigir `arie-describedby` para `aria-describedby`, pois a orientação não fica associada ao campo; mover o Typography de ajuda para fora do flex dos controles (após o fechamento da div), evitando que seja uma terceira coluna no desktop. `sm:w-35` corresponde aos 140 px pretendidos no tema atual. Nenhuma alteração automática ou validação de navegação no navegador nesta rodada. Página ainda consulta catálogo sem interpretar q, conforme escopo incremental.

### Proposta do formulário de busca — 27/10/2026

Primeiro incremento manual da busca: `PokemonSearchForm.tsx` em organisms usando `next/form` com action /pokemon, campo q com wrapper TextField, submit com Button e orientação associada por aria-describedby; composição abaixo do cabeçalho. Formulário envia GET para a URL em navegação Next, sem fetch no componente. Consulta Context7 confirmou action string/onSubmit; Figma busca desktop 4:10 e mobile 4:159 consultados com screenshots. Nesta etapa somente apresentação e submissão para URL; a página ainda não interpreta q. Normalização, bloqueio de espaços, erros inline, resultado único/404, limpar e prevenção de duplicatas ficam para incrementos seguintes. Código ainda proposto, não implementado.

### Cabeçalho aprovado por código — 27/10/2026

Corrigido `lg:text-[40px]` no h1 da introdução. TypeScript, ESLint e Prettier passaram para cabeçalho/página. Verificação da compilação Tailwind confirmou CSS de 40 px no breakpoint lg (64rem), mantendo text-2xl na base. Composição de marca, tagline e introdução aprovada por leitura; sem medição visual em navegador nesta rodada. A pendência da revisão anterior foi resolvida. Próximo incremento manual: busca exata com submissão explícita, estado na URL e precedência de q sobre page, em pequenas etapas.

### Revisão do cabeçalho — 27/10/2026

`PokemonCatalogHeader` implementado e composto na página; h1 na introdução, marca como parágrafo e tagline hidden/lg:block. TypeScript, ESLint e Prettier do escopo passaram. Pendência antes de avançar: título usa `lg:text-10`, classe sem token `--text-10` no tema e sem CSS gerado na compilação Tailwind 4.3.3 conferida. Orientar `lg:text-[40px]` para os 40 px do Figma. Ao contrário de h-38/max-w-300, a escala de font-size não usa automaticamente o token --spacing. Context7 consultado sobre font-size e tokens. Não houve edição automática de código ou revisão visual no navegador. Busca ainda não iniciada.

### Proposta de cabeçalho e introdução — 27/10/2026

Próximo incremento manual: `PokemonCatalogHeader.tsx` em organisms, compondo marca e tagline (oculta abaixo de lg), introdução com h1 de 24 px/mobile e 40 px/desktop, descrição de 16 px e espaçamentos dos frames. Substituir o h1 isolado atual da página pelo componente e aplicar fundo neutral-50, py-6/lg:py-12 e espaço entre blocos. Figma consultado com contexto e screenshots dos nós desktop 4:4/4:7 e mobile 4:154/4:156; Context7 consultado para responsividade Tailwind e composição de Server Components. Código somente proposto, ainda não implementado nem validado. Busca, paginação e detalhe continuam pendentes.

### Container wide aprovado por código — 27/10/2026

Aluno implementou `size?: "default" | "wide"` e aplicou `size="wide"` na página Pokémon. TypeScript, ESLint e Prettier dos dois arquivos passaram. Verificação avulsa confirmou comportamento default/explicit default preservado, classes wide, children e className. Compilação Tailwind confirmou `max-w-300` como `300 × --spacing` (1200 px no tema atual), com px-6 e lg:px-12. A troca de max-w-[1200px] por max-w-300 é válida. Não houve medição visual em navegador nesta revisão. Próximo incremento manual: cabeçalho e introdução do catálogo conforme Figma.

### Grade aprovada por código e proposta de largura — 27/10/2026

`PokemonGrid.tsx` implementado pelo aluno com 1/2/3 colunas, gap-6 e composição dos cards; página usa a grade e mantém o fetch. TypeScript, ESLint e Prettier do escopo passaram. Sem validação visual em navegador nesta rodada. Próximo incremento manual proposto: adicionar `size?: "default" | "wide"` ao Container compartilhado, preservando max-w-5xl por padrão e permitindo max-w-[1200px] com px-6/lg:px-12 para Pokémon; página usará size wide. Proposta ainda não implementada. Figma desktop/mobile e Context7 Tailwind consultados: alvo em 1200 px com conteúdo 1104 px e em 390 px com conteúdo 342 px. Após isso, seguir para cabeçalho e introdução do catálogo.

### Revisão após remoção do import — 27/10/2026

Import `Image` sem uso removido da página. TypeScript e ESLint focado passaram sem avisos. Apenas Prettier continua reprovando `PokemonCard.tsx` e `app/pokemon/page.tsx`; orientar comando de formatação limitado a esses dois arquivos. Estrutura do componente aprovada por leitura; comparação visual ainda pendente. Sem alteração automática de código.

### Terceira revisão do PokemonCard — 27/10/2026

Confirmado: link movido para fora do contêiner dos tipos e altura das etiquetas corrigida. Estrutura do card aprovada por leitura do código. Ainda há import `Image` sem uso na primeira linha de `app/pokemon/page.tsx` e diferenças de formatação nos dois arquivos; TypeScript passou, ESLint apresentou somente esse aviso e Prettier retornou 1. Sem verificação visual nesta rodada e sem edição de código pelo assistente.

### Segunda revisão do PokemonCard — 27/10/2026

`h-[30px]` foi corrigido, e as classes de tipografia/alinhamento foram adicionadas ao link. Ainda pendentes nos arquivos salvos: mover o link para depois do fechamento do contêiner dos tipos e remover o import `Image` não usado da página. TypeScript passou; ESLint mantém um aviso; Prettier mantém pendência nos dois arquivos. Etapa ainda não aprovada; sem alteração automática de código.

### Primeira revisão do PokemonCard — 27/10/2026

O aluno implementou `PokemonCard.tsx` e o conectou à página por props. A composição usa os wrappers compartilhados e mantém a consulta na página server. Pendências: `h-[30x]` nas etiquetas gera CSS `height: 30x`, inválido, devendo ser `h-[30px]`; o link está dentro do flex dos tipos, devendo ficar depois desse contêiner, com as classes de alinhamento/tipografia propostas; remover import `Image` não usado de `app/pokemon/page.tsx`. TypeScript passou; ESLint sem erros, com um aviso de import não usado; Prettier apontou os dois arquivos. `h-38` e `wrap-break-word` são válidos no Tailwind 4.3.3 instalado (confirmados na compilação CSS avulsa); `h-38` representa 152 px com o token atual. Sem edição de código, testes Pokémon versionados ou validação visual em navegador nesta revisão. Etapa ainda não aprovada.

### Padding do Card aprovado — 27/10/2026

Confirmado no código: `padding === "normal" ? "p-6" : "p-4"`, com padrão `normal`. Verificação avulsa em memória conferiu default/normal com 24 px e compact com 16 px, uma única classe de padding, preservação de children, className, rounded-xl e variant outlined. Scanner Tailwind detectou as classes completas. TypeScript sem emissão/cache incremental, ESLint e Prettier do componente passaram. Essa validação não incluiu comparação visual no navegador. As pendências das duas revisões anteriores abaixo foram resolvidas. Próximo incremento manual: conteúdo de `PokemonCard.tsx` com dados recebidos por props, conforme o Figma.

### Segunda revisão do padding — 27/10/2026

A interpolação parcial foi removida, mas a condição agora usa `normal → p-4` e `compact → p-2` (16 px e 8 px). Isso altera o padrão de 24 px dos consumidores AOA e não entrega os 16 px esperados no card Pokémon compacto. Corrigir manualmente para `padding === "normal" ? "p-6" : "p-4"`. A verificação focada rejeitou a ausência de `p-6`; TypeScript, ESLint e Prettier passaram. Etapa ainda não aprovada; nenhuma alteração automática no componente.

### Revisão do padding do Card — 27/10/2026

O aluno adicionou `padding?: "normal" | "compact"`, com padrão `normal`, em `shared/components/atoms/Card.tsx`. Pendência antes de aprovar: o className usa interpolação parcial (`p-${...}`); o scanner Tailwind instalado, focado nesse arquivo, não detectou `p-4` nem `p-6`. Consulta MCP Context7 confirmou a necessidade de classes completas no código-fonte. Orientar substituir pela seleção `padding === "normal" ? "p-6" : "p-4"`, mantendo `rounded-xl` separado. TypeScript e ESLint focado passaram; isso não comprova geração das classes CSS. Não foi alterado código do aluno. O arquivo `PokemonCard.tsx` existe vazio e ainda não deve ser marcado como implementado.

### Conexão Figma — 27/10/2026

Plugin Figma do Codex desktop já instalado e autenticado; identificação da conta e leitura do frame Catálogo / desktop (`2:23`) no arquivo do projeto passaram. Não foi criada uma conexão MCP manual duplicada. Acesso ao design confirmado; apenas metadados foram consultados nesta validação. Antes da próxima orientação de UI, usar a skill de design para código e consultar o contexto de design dos nós pertinentes. Nenhum código da aplicação ou arquivo do Figma foi alterado nesta verificação.

### Revisão da normalização e aliases — 27/10/2026

O aluno implementou `modules/pokemon/routing/query.ts` com `normalizePokemonPage`. Revisão funcional aprovada: 20 cenários avulsos em memória passaram (ausência, vazio, espaços, texto, número parcialmente válido, zero, negativo, fracionário, arrays, zeros à esquerda, página 500 e inteiros/offsets inseguros). Nenhum teste unitário Pokémon foi criado. TypeScript e ESLint focado passaram. Prettier apontou formatação pendente somente no arquivo da função dentro do escopo checado; orientar salvar com o formatador. Os oito aliases, incluindo o legado, tiveram seus destinos conferidos com a resolução do TypeScript; os dois testes de arquitetura passaram sem cobertura. A checagem avulsa foi corrigida para comparar caminhos normalizados no Windows; isso não exigiu alteração na aplicação.

Próxima etapa proposta, ainda não implementada: página Server Component mínima `app/pokemon/page.tsx`, lendo `await searchParams`, normalizando `page` e chamando `getPokemonPage` para mostrar os nomes retornados. Consulta MCP Context7 realizada em `/vercel/next.js/v16.2.9` sobre a assinatura assíncrona de `searchParams`; Next instalado continua 16.2.10. Busca `q`, cards, navegação e estados completos continuam pendentes. Cache real no Next ainda não validado.

### Aliases de importação — 27/10/2026

Aliases principais configurados no `tsconfig.json`: `@app/*`, `@modules/*`, `@shared/*`, `@aoa/*`, `@pokemon/*`, `@components/*` e `@design-system/*`; `@/*` permanece compatível. Imports existentes foram migrados. Vitest, regras ESLint e detector de ciclos usam o mesmo mapa por `tooling/import-paths.mjs`. TypeScript, ESLint, build, formatação do escopo alterado e os 42 testes existentes passaram. A suíte foi executada sem cobertura nesta validação; o gate global e a pendência de cobertura Pokémon permanecem inalterados. O arquivo `modules/pokemon/routing/query.ts` já existe como arquivo vazio criado pelo aluno, ainda sem implementação. Não foi implementada a função nem criado teste unitário Pokémon. Próximo passo: orientar a função usando `import { POKEMON_PAGE_SIZE } from "@pokemon/api/constants"`.

### Reorganização do portfólio — 27/10/2026

Estrutura, mapa de migração, decisão de adiar testes unitários Pokémon e resultados de validação estão em [arquitetura](arquitetura.md). AOA está em `modules/aoa`, Pokémon em `modules/pokemon` e recursos genéricos em `shared`. Imports e testes existentes foram atualizados; a correção `page: currentPage` foi preservada. TypeScript, ESLint, build e os 42 testes existentes passaram. Cobertura global ainda reprova apenas pelos arquivos Pokémon sem testes; o gate de 100% foi mantido. Smoke HTTP das páginas AOA e do Pix passou. A formatação global tem 33 pendências em arquivos não alterados. Sem commit ou push.

Próximo passo de estudo: explicar novamente e deixar Marcel criar `modules/pokemon/routing/query.ts`. Não foi criado `lib/pokemon-query.ts`, nem implementada a normalização ou a rota Pokémon durante a reorganização. Os registros a seguir são históricos e usam os caminhos vigentes na respectiva revisão.

### Revisão de retomada — 27/10/2026

- Confirmado no código: `getPokemonPage` retorna `page: currentPage`; a pendência funcional registrada acima foi corrigida pelo aluno.
- `npx tsc --noEmit --incremental false` e ESLint focado em `lib/api/pokemon` e `lib/util/dataFormaters.ts` passaram, ambos com código de saída 0.
- Verificação avulsa em memória: 86 asserções passaram com respostas controladas, incluindo páginas 1/2/3, última página parcial, página 500 com retorno à primeira, catálogo vazio nas páginas 1 e 500, offsets, ordem dos itens, indicadores de navegação, entradas numéricas inválidas, normalização de identificador, mapper sem mutação, imagens nulas e erros de rede/HTTP/JSON/schema e falha de um detalhe propagada pela página.
- A opção `next.revalidate = 3600` foi conferida nas chamadas simuladas. O marcador `server-only` foi contornado somente no carregador em memória; nenhum arquivo da aplicação ou teste foi alterado. Isso não valida cache no runtime Next nem substitui testes Vitest versionados.
- Prettier focado encontrou pendências nos sete arquivos: `lib/api/pokemon/{constants,errors,index,mappers,schema,types}.ts` e `lib/util/dataFormaters.ts`. Não foi aplicada formatação automática.
- Próximo passo funcional: normalização dos parâmetros da URL, em pequena etapa manual. Interface, testes formais e revisão final continuam pendentes. Os registros anteriores descrevem o estado histórico da transferência.

- Última alteração feita pelo assistente nesta transferência: documentação e instruções de continuidade somente.
- Última etapa do aluno: tratamento de página além do total; pendente do retorno correto e revalidação.
- Próximo passo autorizado: orientar a correção e validar; então ensinar normalização de parâmetros.
- Sem commit ou push realizado pelo assistente nesta transferência.
