import Image from "next/image";
import { Card } from "@components/atoms/Card";
import { Chip } from "@components/atoms/Chip";
import { Link } from "@components/atoms/Link";
import { Typography } from "@components/atoms/Typography";
import type { Pokemon } from "@pokemon/models/pokemon";

type PokemonCardProps = {
  pokemon: Pokemon;
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Card
      padding="compact"
      className="flex min-w-0 flex-col gap-2 border-neutral-200 bg-white"
    >
      <div className="flex h-38 w-full items-center justify-center">
        {pokemon.imageUrl ? (
          <Image
            src={pokemon.imageUrl}
            alt={pokemon.displayName}
            width={152}
            height={152}
            className="h-full w-full object-contain"
          />
        ) : (
          <Typography as="span" className="text-sm text-neutral-500">
            Imagem indisponível
          </Typography>
        )}
      </div>

      <Typography className="text-xs leading-[1.4] font-semibold text-neutral-500">
        {pokemon.numberLabel}
      </Typography>

      <Typography
        as="h2"
        className="text-2xl leading-[1.4] font-bold wrap-break-word text-neutral-900"
      >
        {pokemon.displayName}
      </Typography>

      <div className="flex flex-wrap gap-2">
        {pokemon.types.map((type) => (
          <Chip
            key={type}
            label={type}
            tone="brand"
            className="h-7.5 rounded-md px-1 text-xs"
          />
        ))}
      </div>
      <Link
        href={`/pokemon/${pokemon.id}`}
        aria-label={`Ver detalhes de ${pokemon.displayName}`}
        className="self-start text-sm font-semibold text-brand-700"
      >
        Ver detalhes →
      </Link>
    </Card>
  );
}
