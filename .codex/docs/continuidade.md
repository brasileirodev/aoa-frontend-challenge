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

- `lib/api/pokemon/`: acesso externo, schemas, erros, constantes, modelos para UI e mapper.
- `app/`: rotas e composição; a página server pode chamar a integração diretamente. Não criar rota `app/api` só para a página do servidor chamar a própria aplicação.
- Componentes seguem atoms/molecules/organisms/templates existentes; reutilizar wrappers MUI e tokens, sem importar MUI diretamente em componentes de negócio.
- Next 16.2.10 e React 19.2.4 declarados; Zod 3, Tailwind 4, TypeScript, Vitest. Conferir lockfile ao retomar.
- Marcador `server-only` na integração. Não recomendar instalação obrigatória sem verificar o suporte da versão do Next.
- Cache de fetch: `next.revalidate = 3600`; não é um cron. `cacheComponents` não está habilitado na configuração observada. Cache real ainda não validado em produção local.
- `unknown` no JSON antes de `safeParse`; tipos externos inferidos do schema. Modelos da UI explícitos e simplificados pelo mapper.
- `sortBySlot<T extends { slot: number }>` exige slot e ordena cópia. O Zod garante slot na entrada externa; não inserir checagem redundante de propriedade na função.
- `Promise.all` busca detalhes da página, conserva a ordem de entrada e propaga falha; não apresentar grade parcial como sucesso.

## Implementado e revisado incrementalmente

| Arquivo | Conteúdo observado |
| --- | --- |
| `lib/api/pokemon/constants.ts` | URL base, seis itens por página, revalidação de 3600 segundos |
| `lib/api/pokemon/errors.ts` | PokemonApiError: INVALID_INPUT, NOT_FOUND, NETWORK_ERROR, HTTP_ERROR, INVALID_RESPONSE |
| `lib/api/pokemon/schema.ts` | Identificador normalizado; Pokémon com tipos, sprites, habilidades, stats; resposta paginada |
| `lib/api/pokemon/types.ts` | Pokemon, habilidades/stats e PokemonPage |
| `lib/api/pokemon/mappers.ts` | Nome/ID de exibição, altura e peso divididos por 10, ordenação por slot, imagens e alternativa, habilidades e stats |
| `lib/api/pokemon/index.ts` | getPokemon, getPokemonList e getPokemonPage; última etapa com defeito pendente abaixo |
| `lib/util/dataFormaters.ts` | Capitalização, ID com padStart e sortBySlot sem mutação |
| `.vscode/` | Format on save com Prettier e correções ESLint; recomendações de extensões |

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

- Última alteração feita pelo assistente nesta transferência: documentação e instruções de continuidade somente.
- Última etapa do aluno: tratamento de página além do total; pendente do retorno correto e revalidação.
- Próximo passo autorizado: orientar a correção e validar; então ensinar normalização de parâmetros.
- Sem commit ou push realizado pelo assistente nesta transferência.
