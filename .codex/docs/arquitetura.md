# Arquitetura do portfólio

Decisão de 27/10/2026: uma aplicação Next.js hospeda projetos independentes de portfólio. AOA e Pokémon não representam partes do mesmo produto. A organização usa módulos por contexto e camadas internas por responsabilidade, sem exigir arquitetura hexagonal.

## Organização atual

```text
app/                       Rotas públicas e composição do Next.js
  api/payments/            Adaptadores HTTP dos pagamentos simulados AOA
  register/                Página de cadastro AOA
  pix-payment/             Página de confirmação simulada AOA
modules/
  aoa/
    checkout/
      api/                 Cliente HTTP das rotas de pagamento
      components/          UI de cadastro e checkout, organizada por Atomic Design
      data/                Catálogo simulado de planos
      hooks/               Comportamento React de pagamento e feedback
      models/              Tipos, schemas e funções de negócio
      server/              Persistência em memória e integração técnica de cartões
      services/            Carregamento de planos
      state/               Estado de checkout com Zustand
    marketing/
      components/          Home, cabeçalho, rodapé e template da AOA
  pokemon/
    api/                   PokéAPI HTTP, schemas externos, mapper, erros e configuração
    models/                Modelo de Pokémon e página consumidos pela aplicação
    presentation/          Formatação específica dos dados Pokémon
shared/
  components/              UI reutilizável sem regras dos projetos
  design-system/           Provider MUI e tokens
  server/                  Utilitários HTTP compartilháveis do servidor
  services/                Geração genérica de QR Code
  utils/                   Utilitários genéricos
tests/                     Testes de comportamento e arquitetura
tooling/                   Regras de arquitetura do ESLint
```

A pasta `app` continua seguindo as convenções de arquivos do Next. As URLs existentes foram preservadas: a home ainda é da AOA. Hospedar os projetos juntos não obriga a compartilhar sua interface, estado ou regras. Um futuro índice do portfólio ou prefixo de URL será uma decisão separada.

## Regras de dependência

### Aliases de importação

| Alias              | Pasta                                        |
| ------------------ | -------------------------------------------- |
| `@app/*`           | `app/*`                                      |
| `@modules/*`       | `modules/*`                                  |
| `@aoa/*`           | `modules/aoa/*`                              |
| `@pokemon/*`       | `modules/pokemon/*`                          |
| `@shared/*`        | `shared/*`                                   |
| `@components/*`    | `shared/components/*`                        |
| `@design-system/*` | `shared/design-system/*`                     |
| `@/*`              | Raiz do projeto, mantido por compatibilidade |

Exemplos: `import { getPokemonPage } from "@pokemon/api"` e `import { Button } from "@components/atoms/Button"`. Preferir o alias mais específico. `@components` sempre indica UI compartilhada; componentes exclusivos de um projeto usam `@pokemon/components/...` ou `@aoa/checkout/components/...`.

O `tsconfig.json` é a fonte dos mapeamentos. Next/TypeScript os interpretam diretamente; Vitest e as regras de arquitetura usam `tooling/import-paths.mjs` para resolver os mesmos destinos. O detector de ciclos também considera esses aliases. Imports relativos continuam válidos, especialmente no bootstrap das configurações e ferramentas Node. O alias não permite dependências proibidas entre projetos ou camadas. Não foi adicionado plugin ou pacote.

Context7 consultado nesta configuração: suporte a `paths` do Next (16.2.9, versão disponível mais próxima da 16.2.10 instalada) e aliases absolutos/mesclagem de aliases do Vitest (documentação principal, conferida com o Vitest 4.1.11 instalado).

- [Aliases no Next.js](https://github.com/vercel/next.js/blob/v16.2.9/docs/01-app/01-getting-started/01-installation.mdx)
- [Aliases no Vitest](https://vitest.dev/config/alias)

### Fronteiras

- `app` compõe os módulos e conecta os endpoints. Não deve concentrar componentes de negócio.
- Cada módulo de primeiro nível é um projeto: `aoa`, `pokemon` e futuros projetos independentes. Um projeto não importa outro.
- Subáreas do mesmo projeto podem colaborar: checkout e marketing pertencem à AOA.
- Módulos podem usar `shared`. A área compartilhada não importa módulos nem rotas.
- `models` contém contratos e regras independentes de interface, estado e acesso externo. Não importa `components`, `hooks`, `state`, `services`, `api` ou `server`.
- Componentes e hooks não importam implementações de `server`, nem mesmo seus tipos: contratos comuns ficam em `models`.
- `api` nomeia o acesso HTTP; `server` nomeia implementações que executam no servidor. A integração Pokémon mantém `import "server-only"`. Não há um barrel global que misture exports de cliente e servidor.
- Atomic Design continua dentro da UI compartilhada e da UI de cada projeto. Camadas inferiores não importam superiores. MUI/Emotion continuam encapsulados em atoms ou no design system.
- Não criar pastas vazias para todas as camadas: adicionar a camada quando houver código real com essa responsabilidade.

As fronteiras de projetos, shared, models, UI/servidor e Atomic Design são verificadas pelo ESLint. Testes exercitam importações permitidas e proibidas e procuram ciclos nos componentes dos módulos e da área compartilhada.

## Migração

| Antes                                                         | Agora                                                                      |
| ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `lib/api/pokemon/*`                                           | `modules/pokemon/api/*`, com tipos em `modules/pokemon/models/pokemon.ts`  |
| `lib/util/dataFormaters.ts`                                   | `modules/pokemon/presentation/formatters.ts`                               |
| Componentes de cadastro e pagamento em `components/organisms` | `modules/aoa/checkout/components/organisms`                                |
| Hooks em `components/organisms/payment`                       | `modules/aoa/checkout/hooks`                                               |
| `lib/payment.ts`, schemas, planos e resumo                    | `modules/aoa/checkout/models`                                              |
| `lib/payment-store.ts`, detector de cartões                   | `modules/aoa/checkout/server`                                              |
| `lib/stores/checkout-store.ts`                                | `modules/aoa/checkout/state/checkout-store.ts`                             |
| `lib/api/payments.ts`, `lib/api/card-brand.ts`                | `modules/aoa/checkout/api`                                                 |
| `lib/api/plans.ts`                                            | Contratos/regras em `models/plans.ts`; carregamento em `services/plans.ts` |
| Home, cabeçalho, rodapé e template do site                    | `modules/aoa/marketing/components`                                         |
| Atoms e moléculas genéricas                                   | `shared/components`                                                        |
| `design-system`                                               | `shared/design-system`                                                     |

Os imports foram atualizados diretamente, sem reexports de compatibilidade nas pastas antigas. Os testes existentes acompanham os novos caminhos. Os limites de cobertura continuam em 100%, incluindo `modules` e `shared`; a migração não exclui Pokémon da cobertura.

O Vitest possui um alias restrito aos testes para o marcador `server-only`, apontando para `tests/support/server-only.ts`. Isso permite transformar e contabilizar a integração Pokémon na cobertura; o Next continua aplicando a proteção original em produção. Não foram criados testes unitários Pokémon. Por decisão do aluno, sua escrita fica adiada durante a exploração.

## Validação da reorganização — 27/10/2026

- TypeScript e ESLint passaram; build de produção passou.
- Os 42 testes existentes passaram, incluindo os novos cenários de fronteiras dentro do teste de arquitetura.
- O comando com cobertura termina com código 1: statements 88,19%, branches 91,26%, functions 92,92% e lines 87,33%. Os arquivos sem cobertura são da implementação Pokémon, cujos testes estão adiados. Nenhum limite foi reduzido ou arquivo da feature excluído.
- O ajuste do alias removeu a falha de transformação do módulo `server-only` na coleta de cobertura.
- Smoke HTTP em servidor de produção temporário: home e cadastro retornaram 200; criação Pix, acesso à página e confirmação de pagamento funcionaram. O processo temporário foi encerrado. Não houve revisão visual em navegador nesta etapa.
- A formatação dos arquivos migrados/alterados passou. A checagem global ainda encontra 33 arquivos não alterados com diferenças de formatação; não foi aplicada formatação indiscriminada ao histórico e configurações do projeto.
- O teste do layout ainda emite o aviso preexistente de renderização de `html` dentro do contêiner do Testing Library. Os testes passam; o aviso não é evidência de falha de hidratação observada no navegador.

## Próxima etapa manual Pokémon

A interpretação de `page` da URL ficará em **`modules/pokemon/routing/query.ts`**. Esse arquivo ainda não foi criado: continua sendo o próximo exercício do aluno. Será consumido pela futura `app/pokemon/page.tsx`, antes da chamada à integração. A página e os componentes Pokémon ainda não foram implementados.

Não retomar a sugestão anterior de criar `lib/pokemon-query.ts`. Nesta etapa de reorganização, a autorização para editar código se limita à arquitetura e aos ajustes necessários para preservar o comportamento existente.

## Fundamentação

Context7 consultado por MCP com `resolve-library-id` e `query-docs`: organização do App Router, código fora de `app` e proteção `server-only`. Projeto instalado: Next 16.2.10; documentação disponível consultada: 16.2.9. A escolha dos nomes e dos contextos de portfólio é uma decisão deste projeto, não uma estrutura obrigatória do Next.

- [Organização do projeto Next.js](https://github.com/vercel/next.js/blob/v16.2.9/docs/01-app/01-getting-started/02-project-structure.mdx)
- [Server e Client Components](https://github.com/vercel/next.js/blob/v16.2.9/docs/01-app/01-getting-started/05-server-and-client-components.mdx)
