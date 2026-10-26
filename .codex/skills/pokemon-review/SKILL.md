---
name: pokemon-review
description: Validar incrementos e a entrega final da US-08 Pokémon, com evidências de comportamento e feedback didático sem corrigir automaticamente o código do aluno.
---

# Revisão do exercício

Siga o [perfil canônico](../../agents/pokemon-tutor.md). Leia o [estado](../../docs/continuidade.md) e os critérios pertinentes da [US-08](../../../scrum/user-stories/us-08-pokedex-explorer.md).

- Leia os arquivos envolvidos e os consumidores; diferencie problemas funcionais de nomenclatura e formatação.
- Para mudanças tipadas, use a checagem de TypeScript. Para comportamento, valide os cenários afetados, incluindo falhas e bordas; não rode toda a suíte repetidamente sem motivo.
- Em integração, diferencie entrada inválida, rede, HTTP, JSON e contrato inválido. Verifique preservação de ordem, dados vazios, ausência de imagem e propagação de falha parcial.
- Na paginação, confira tanto a consulta efetiva quanto o número devolvido à UI. Teste primeira/última página, catálogo vazio, página fora do total e parâmetros inválidos.
- Respostas controladas são preferidas para testes determinísticos. Consulta real é apenas smoke test. Testes avulsos de sessões passadas não são testes versionados.
- Não modificar código nem testes para fazê-los passar. Mostre ao aluno o menor ajuste necessário.
- Relate o que passou e o que não foi verificado; atualize o registro de continuidade com evidências reais.

Na entrega final, executar os comandos previstos na US e revisar CA-01 a CA-08, navegação, acessibilidade, responsividade e Figma. Verificar cache dentro do Next em produção local; não alegar cache validado só pela opção no fetch. Não reduzir os limites de cobertura para aprovar. Separar problemas preexistentes de regressões.
