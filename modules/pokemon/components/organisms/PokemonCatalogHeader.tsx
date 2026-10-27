import { Typography } from "@components/atoms/Typography";

export function PokemonCatalogHeader() {
  return (
    <header className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <Typography className="text-2xl leading-[1.4] font-bold text-neutral-900">
          Pokédex Explorer
        </Typography>

        <Typography className="hidden text-sm leading-[1.4] font-semibold text-neutral-600 lg:block">
          Explore. Descubra. Conheça.
        </Typography>
      </div>

      <div className="flex flex-col gap-2">
        <Typography
          as="h1"
          className="text-2xl leading-[1.4] font-bold text-neutral-900 lg:text-[40px]"
        >
          Seu próximo Pokémon
          <br />
          começa aqui.
        </Typography>
        <Typography className="text-base leading-[1.4] text-neutral-600">
          Explore o catálogo e descubra os detalhes de cada Pokémon.
        </Typography>
      </div>
    </header>
  );
}
