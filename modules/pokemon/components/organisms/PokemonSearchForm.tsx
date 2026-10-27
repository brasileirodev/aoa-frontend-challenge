import Form from "next/form";
import { Button } from "@components/atoms/Button";
import { TextField } from "@components/atoms/TextField";
import { Typography } from "@components/atoms/Typography";

export function PokemonSearchForm() {
  return (
    <Form
      action="/pokemon"
      role="search"
      aria-label="Buscar Pokémon"
      className="flex flex-col gap-2"
    >
      <div className="flex flex-col items-start gap-3 sm:flex-row">
        <TextField
          id="pokemon-search"
          name="q"
          type="search"
          label="Nome completo ou número"
          placeholder="Ex.: bulbasaur ou 1"
          aria-describedby="pokemon-search-help"
          autoComplete="off"
          required
          className="min-w-0 flex-1 bg-white"
        />

        <Button type="submit" className="h-12 w-full shrink-0 sm:w-35">
          Buscar
        </Button>
      </div>

      <Typography
        id="pokemon-search-help"
        className="text-xs leading-[1.4] text-neutral-600"
      >
        Ex.: bulbasaur ou 1. Pressione Enter para buscar.
      </Typography>
    </Form>
  );
}
