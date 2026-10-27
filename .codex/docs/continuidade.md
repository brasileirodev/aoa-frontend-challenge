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
