# Continuidade do estudo Pokémon

Este material pertence ao repositório e acompanha o código entre máquinas.
Não depende do histórico de um chat nem de caminhos absolutos do computador.

## Começar uma nova sessão

1. Abra a raiz deste repositório no Codex e no editor.
2. Leia [estado e roteiro](docs/continuidade.md).
3. Leia a [história completa US-08](../scrum/user-stories/us-08-pokedex-explorer.md), incluindo os critérios CA-01 a CA-08.
4. Use o [perfil do tutor](agents/pokemon-tutor.md) e a skill de continuidade.
5. Confira o código atual antes de retomar. A etapa de paginação NÃO está aprovada.

Pedido sugerido para iniciar outra conversa:

> Retome meu estudo Pokémon conforme AGENTS.md e .codex/docs/continuidade.md. Leia o perfil do tutor e a skill de continuidade. Confira primeiro a pendência atual de paginação. Explique uma etapa por vez e deixe que eu escreva o código.

## Organização

- `agents/pokemon-tutor.md`: contrato de atuação do tutor e revisor, em Markdown; não é configuração de um subagente executável.
- `skills/pokemon-study/SKILL.md`: fluxo de retomada e ensino.
- `skills/pokemon-review/SKILL.md`: revisão incremental e final.
- `docs/continuidade.md`: estado verificado, decisões, evidências e roadmap.
- `docs/ambiente.md`: preparação de outra máquina e referências.
- `../.agents/skills/`: entradas pequenas para descoberta das skills pelo Codex; apontam para as instruções canônicas em `.codex`.

Um único assistente pode alternar entre tutor e revisor. Não são necessários processos autônomos nem múltiplos agentes para este estudo.

## Git e atualização

Versione `AGENTS.md`, `.codex/`, `.agents/`, a US em `scrum/` e as alterações de implementação que desejar transportar. Não versione credenciais, `.env`, caches ou `node_modules`.
Criar os arquivos não equivale a commit ou push. Confira `git status --short` e os diffs antes de enviar pelo seu fluxo habitual.
Ao encerrar uma etapa, atualize o estado de continuidade com a data, arquivos envolvidos, verificações realmente executadas e a próxima ação. Não transforme uma orientação fornecida em tarefa concluída sem conferir a implementação.

O link do Figma acompanha o Git; o arquivo remoto do Figma e suas permissões não são copiados para o repositório.
