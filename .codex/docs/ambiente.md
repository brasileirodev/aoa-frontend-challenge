# Retomar em outra máquina

1. Faça commit e push, pelo seu fluxo habitual, do código desejado e deste material na máquina de origem. Depois clone ou atualize a mesma branch na máquina de destino.
2. Abra a raiz do projeto, não apenas a pasta de documentação, no editor e no Codex.
3. Instale uma versão Node compatível com o Next indicado pelo lockfile e execute `npm ci`. Não copie node_modules entre máquinas.
4. Instale as extensões recomendadas em `.vscode/extensions.json`. A configuração de salvar acompanha o repositório; a instalação local das extensões não.
5. Habilite Context7 na instalação de destino. Configurações pessoais, logins e permissões de MCP não são transportados por estes documentos. Se indisponível, o tutor deve informar e consultar fontes oficiais.
6. Abra o Figma pelo link no documento de continuidade e confirme acesso. Não copiar credenciais para o Git.
7. Comece lendo o estado de continuidade. Execute checagens conforme a etapa, não suponha que verificações antigas continuam válidas.

## Comandos do projeto

```sh
npm run dev
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```

`npm run format` altera arquivos; use somente quando a formatação em massa for desejada. Para checar sem gerar cache incremental do TypeScript: `npx tsc --noEmit --incremental false`, com dependências já instaladas.

## Descoberta e portabilidade

As skills canônicas ficam em `.codex/skills`, conforme solicitado. As entradas em `.agents/skills` permitem descoberta no local de skills de repositório documentado pelo Codex. O AGENTS.md da raiz também aponta para elas. Se a interface não listar as skills, peça explicitamente a leitura do caminho canônico; não dependa de instalações globais desta máquina.

O perfil em `.codex/agents/pokemon-tutor.md` é uma instrução legível, não configuração TOML de subagente. Não instala modelos, plugins ou processos. O tutor e o revisor são papéis do mesmo fluxo de estudo, suficientes para a metodologia atual.

Referências oficiais consultadas em 26/10/2026:

- [Skills e descoberta](https://learn.chatgpt.com/docs/build-skills)
- [Instruções e personalização do Codex](https://learn.chatgpt.com/docs/customization/overview)
- [PokéAPI](https://pokeapi.co/docs/v2)
- [Next: fetch](https://nextjs.org/docs/app/api-reference/functions/fetch)
- [Zod 3](https://v3.zod.dev/)

A versão exata Next 16.2.10 não estava disponível na consulta Context7 histórica; foi usada documentação 16.2.9 com a limitação informada. Reavaliar disponibilidade ao retomar e consultar somente os tópicos necessários.
