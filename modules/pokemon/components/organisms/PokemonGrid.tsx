import { PokemonCard } from "@pokemon/components/molecules/PokemonCard";
import type { Pokemon } from "@pokemon/models/pokemon";

type PokemonGridProps = {
  pokemon: Pokemon[];
};

export function PokemonGrid({ pokemon }: PokemonGridProps) {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {pokemon.map((item) => (
        <li key={item.id} className="min-w-0">
          <PokemonCard pokemon={item} />
        </li>
      ))}
    </ul>
  );
}
