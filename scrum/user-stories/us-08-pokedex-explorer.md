# US-08: Pokédex Explorer

Status: pronta para implementação manual por Marcel.
Prioridade: Must have para este exercício.
Data da especificação: 13/10/2026.

## User Story

Como uma pessoa que quer conhecer Pokémon, quero navegar por um catálogo,
buscar um Pokémon pelo nome ou número e consultar suas características,
para descobrir informações sem precisar conhecer a API ou recarregar toda
a experiência a cada interação.

## Objetivo do exercício

Praticar integração HTTP real, contratos TypeScript, composição de componentes,
navegação, estados assíncronos, acessibilidade e testes na arquitetura existente.
Marcel escreverá o código da aplicação e dos testes. Esta US descreve a entrega,
sem fornecer a implementação. Ao concluir, o código será revisado contra os
critérios abaixo e a experiência será validada no navegador.

## Design de referência

[Abrir Figma — Pokédex Explorer](https://www.figma.com/design/YwhcG3X1sz9Dd8F6b1WnKr)

- [Catálogo desktop, 1200 px](https://www.figma.com/design/YwhcG3X1sz9Dd8F6b1WnKr?node-id=2-23)
- [Detalhes desktop, 1200 px](https://www.figma.com/design/YwhcG3X1sz9Dd8F6b1WnKr?node-id=2-24)
- [Catálogo mobile, 390 px](https://www.figma.com/design/YwhcG3X1sz9Dd8F6b1WnKr?node-id=2-25)
- [Detalhes mobile, 390 px](https://www.figma.com/design/YwhcG3X1sz9Dd8F6b1WnKr?node-id=2-26)
- [Referências de busca e e\stados](https://www.figma.com/design/YwhcG3X1sz9Dd8F6b1WnKr?node-id=2-27)

As telas são referências editáveis, não um protótipo navegável. O quadro de estados
mostra alternativas de apresentação; elas não devem aparecer simultaneamente na
aplicação. As anotações desse quadro orientam o desenvolvimento e não são textos
obrigatórios da interface.

Usar Inter, as cores e os tokens já presentes em `design-system/tokens.css`.
Manter a hierarquia, o espaçamento, a legibilidade e os comportamentos do design.
Os tipos aparecem como etiquetas informativas em azul, sem interação de filtro.
Os dados do Figma exemplificam a resposta real da API; não devem virar mocks de
produção. A lista mobile completa rola verticalmente.

## API pública

[Documentação oficial da PokéAPI v2](https://pokeapi.co/docs/v2).
API gratuita, sem autenticação, de leitura via GET. A política de uso solicita
cache dos recursos consultados. A listagem usa `limit` e `offset` e retorna
`count`, `next`, `previous` e `results` com nome e URL. Consulte o recurso individual
para os dados do card e dos detalhes.

| Finalidade       | Endpoint GET                                         |
| ---------------- | ---------------------------------------------------- |
| Primeira página  | `https://pokeapi.co/api/v2/pokemon?limit=6&offset=0` |
| Segunda página   | `https://pokeapi.co/api/v2/pokemon?limit=6&offset=6` |
| Busca por nome   | `https://pokeapi.co/api/v2/pokemon/pikachu`          |
| Busca por ID     | `https://pokeapi.co/api/v2/pokemon/25`               |
| Exemplo do Figma | `https://pokeapi.co/api/v2/pokemon/1`                |

Campos relevantes: `id`, `name`, `types[].type.name`, `abilities[].ability.name`,
`abilities[].is_hidden`, `stats[].stat.name`, `stats[].base_stat`, `height`, `weight`
e `sprites.other["official-artwork"].front_default`.
Altura vem em decímetros e peso em hectogramas; dividir por 10 para metros e quilos.
Usar `sprites.front_default` como alternativa à arte oficial.

Referências verificadas em 13/10/2026. Não fixar o total de Pokémon no código.

## Escopo e navegação

- Catálogo em `/pokemon`.
- Detalhes em `/pokemon/[id]`, usando o ID numérico retornado pela API.
- Deve ser possível abrir essas rotas diretamente e atualizar o navegador.
- Página e busca submetida devem ser representadas na URL do catálogo para
  permitir compartilhar e restaurar a consulta. Exemplos: `/pokemon?page=2`
  e `/pokemon?q=pikachu`. A presença de `q` tem precedência sobre `page`.
- A nova experiência é independente do checkout existente. Não precisa adicionar
  um item ao menu de marketing do Meridian nesta primeira US.
- Interface em português. Nomes próprios, tipos e habilidades podem permanecer
  em inglês, como na API e no Figma. Capitalizar o nome exibido é suficiente.

## Critérios de aceite

### CA-01 — Catálogo

Dado que acesso `/pokemon`, quando os dados carregam, vejo seis cards na ordem
retornada pela API. Cada card apresenta imagem, ID com no mínimo três dígitos
(`#001`), nome, todos os tipos e um link “Ver detalhes”. IDs maiores não são truncados.

A primeira página apresenta Bulbasaur, Ivysaur, Venusaur, Charmander, Charmeleon
e Charizard. Não restringir o catálogo aos 151 primeiros ou à primeira geração.
Não carregar todo o catálogo antecipadamente: buscar apenas os dados necessários
à página ou ao Pokémon solicitado.

### CA-02 — Paginação

“Próxima” troca o conjunto de resultados e atualiza a página exibida e sua URL.
“Anterior” fica desabilitado na primeira página. “Próxima” fica desabilitado quando
não houver próxima página. A última página pode ter menos de seis cards.
Usar os dados de paginação da resposta, sem pressupor que IDs são consecutivos.

Durante a troca, impedir novas ações de paginação e informar o carregamento.
Ao concluir, levar o usuário ao início da área de resultados. Valores de página
inválidos, negativos, fracionários ou além da última página conhecida voltam à
primeira página, sem quebrar a interface.

### CA-03 — Busca exata

Ao clicar em “Buscar” ou pressionar Enter, pesquisar por nome completo ou ID
em toda a API, independentemente da página atual. Não filtrar apenas os seis
cards carregados. Remover espaços nas extremidades e ignorar diferença entre
maiúsculas e minúsculas. Aceitar `025` como o ID `25`.

A busca `PIKACHU` deve retornar Pikachu (#025). A busca `pika` não precisa
retornar sugestões: busca parcial e autocomplete estão fora do escopo.
Nomes válidos com hífen devem continuar funcionando.

O resultado substitui a grade por um card e oculta a paginação. Mostrar o termo
submetido e a ação “Limpar busca”, que retorna à primeira página do catálogo.
Uma busca vazia ou só com espaços mostra uma orientação junto ao campo e não
dispara consulta. Editar o campo sozinho não altera os resultados nem dispara busca.
Durante uma busca, impedir submissões duplicadas.

### CA-04 — Detalhes

Ao acionar “Ver detalhes”, abrir a rota do ID selecionado e apresentar:

- Imagem, nome, ID e todos os tipos.
- Altura em metros e peso em quilos, com formatação pt-BR.
- Habilidades, identificando as que têm `is_hidden` como “oculta”.
- HP, ataque, defesa, ataque especial, defesa especial e velocidade, com valores
  numéricos e barras em escala visual de 0 a 255. A barra não representa percentual
  de progresso e seu preenchimento deve permanecer limitado à largura disponível.

Exemplo verificável: Bulbasaur tem 0,7 m, 6,9 kg e estatísticas 45, 49, 49, 65,
65 e 45, nessa ordem. Mapear estatísticas pelo nome, sem depender de posições fixas.

“Voltar ao catálogo” restaura a página ou busca de origem. Em acesso direto aos
detalhes, sem origem conhecida, volta à primeira página. O botão Voltar do
navegador também deve manter uma navegação coerente.

### CA-05 — Carregamento, falhas e respostas vazias

- No carregamento inicial, mostrar seis skeletons no catálogo. No detalhe,
  reservar as áreas de imagem e informações. Identificar o estado como carregando.
- HTTP 404 na busca significa “Nenhum Pokémon encontrado”, com possibilidade
  de corrigir o termo e limpar a busca; não é erro de conexão.
- ID inexistente ou inválido nos detalhes mostra “Pokémon não encontrado” e
  oferece retorno ao catálogo.
- Falha de rede ou HTTP 5xx mostra mensagem compreensível e “Tentar novamente”.
  Essa ação repete a operação que falhou, preservando seu termo, página ou ID.
- Se qualquer recurso necessário à montagem de uma página falhar, a área de
  resultados mostra o estado de erro da página. Não exibir silenciosamente uma
  grade incompleta como se fosse a resposta completa.
- Uma listagem válida com `results` vazio mostra “Nenhum Pokémon disponível”.
- Se a arte oficial estiver ausente ou falhar, tentar o sprite alternativo.
  Se ele também estiver indisponível, mostrar “Imagem indisponível”, mantendo
  nome, demais informações e área reservada. Não entrar em ciclo de tentativas.
- Respostas antigas não podem sobrescrever uma navegação ou busca mais recente.

### CA-06 — Responsividade e acessibilidade

- Três colunas a partir de 1024 px, duas entre 640 e 1023 px e uma abaixo de 640 px.
- Campo e botão de busca ficam empilhados no mobile. Detalhes viram uma coluna.
- Usável em 360, 390, 768 e 1200 px, sem rolagem horizontal ou texto cortado.
- Campo com label associado; ações acessíveis por teclado e foco visível.
- Imagens com texto alternativo apropriado. Nomes e tipos continuam disponíveis
  como texto; a identificação não depende exclusivamente de cor ou imagem.
- Títulos com hierarquia semântica. Alterações de resultado, carregamento e erro
  são anunciadas de forma adequada a tecnologias assistivas.
- Cada link de detalhes deve identificar seu Pokémon para leitores de tela.
- Conteúdo muito longo deve quebrar linha sem alterar a ordem de leitura.

### CA-07 — Arquitetura e integração

Seguir os padrões observados no repositório, mantendo responsabilidades claras:

| Área existente          | Responsabilidade esperada                                                         |
| ----------------------- | --------------------------------------------------------------------------------- |
| `app/`                  | Rotas, composição e integração com a navegação                                    |
| `components/atoms/`     | Reutilizar Button, TextField, Chip, Card, Typography e outros wrappers aplicáveis |
| `components/molecules/` | Combinações pequenas e reutilizáveis, como o card de Pokémon                      |
| `components/organisms/` | Busca, grade, paginação e seção de detalhes                                       |
| `components/templates/` | Composição estrutural das páginas, quando necessário                              |
| `lib/api/`              | HTTP, contratos e normalização dos dados da PokéAPI                               |
| `tests/`                | Testes unitários e de integração de comportamento                                 |

Os nomes de novos arquivos e a decomposição final são decisões suas. A tabela
indica responsabilidades, não uma obrigação de criar cada componente sugerido.

Não importar Material UI diretamente em componentes de negócio; preservar o
encapsulamento adotado pelo projeto. Não espalhar chamadas HTTP em componentes
visuais. Evitar `any`, duplicação de contratos e estado redundante. Zustand já
existe, mas não é obrigatório: justificar seu uso caso seja necessário.

Reutilizar dados já consultados com uma estratégia de cache documentada e evitar
consultas repetidas sem necessidade. A escolha entre consulta no servidor,
cliente ou rota interna é sua, desde que respeite a separação de responsabilidades
e os comportamentos exigidos. Não é necessário adicionar backend externo.

### CA-08 — Testes e definição de pronto

Os testes automatizados usam respostas controladas, sem depender da disponibilidade
da PokéAPI. Incluir casos de sucesso e falha da integração, paginação nas bordas,
normalização e submissão da busca, 404 versus falha de rede, repetição após erro,
conversões de unidades, retorno ao catálogo e fallback de imagem.

Os testes devem verificar comportamentos, não apenas reproduzir a implementação.
Manter os testes existentes passando e os limites de cobertura configurados:
100% em statements, branches, functions e lines. Não reduzir esses limites nem
excluir a feature da cobertura para obter aprovação.

Comandos previstos para validação final:

- `npm run lint`
- `npm run typecheck`
- `npm run format:check`
- `npm test`
- `npm run build`

Registrar eventuais problemas preexistentes separadamente. Esta especificação
não afirma que o baseline já foi executado. Na entrega, incluir uma nota curta
sobre decisões, cache e limitações conhecidas.

## Fora do escopo desta entrega

Favoritos, persistência de coleção, login, criação de times, filtro por tipo,
evoluções, comparação, autocomplete, busca parcial, ordenação personalizada,
tradução completa da API, infinite scroll, dark mode e animações elaboradas.

## Roteiro da revisão final

1. Comparar implementação e testes com CA-01 a CA-08.
2. Revisar contratos, componentes, estado, concorrência de requisições e cache.
3. Executar os comandos de qualidade e registrar os resultados reais.
4. Abrir catálogo, paginar, buscar `PIKACHU` e `025`, testar termo inexistente,
   limpar a busca e navegar entre lista e detalhes.
5. Validar acesso direto, atualização de página, teclado e tamanhos de tela.
6. Simular conexão lenta, falhas e imagens ausentes; comparar com o Figma.
7. Apresentar achados por severidade, com arquivo/linha e critério afetado,
   distinguindo correções obrigatórias de sugestões opcionais.

Ao terminar, avise: “Concluí a US-08; revise minha implementação”. A revisão
fornecerá feedback para você corrigir; alterações automáticas no código só serão
feitas se você pedir.
