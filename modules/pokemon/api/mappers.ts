import {
  formatDisplayValue,
  formatNumberLabel,
  sortBySlot,
} from "@pokemon/presentation/formatters";
import type { PokemonResponse } from "@pokemon/api/schema";
import type { Pokemon } from "@pokemon/models/pokemon";

export const mapPokemon = (response: PokemonResponse): Pokemon => {
  return {
    id: response.id,
    name: response.name,
    displayName: formatDisplayValue(response.name),
    numberLabel: formatNumberLabel(response.id),
    heightMeters: response.height / 10,
    types: sortBySlot(response.types).map((item) => item.type.name),
    weightKilograms: response.weight / 10,
    imageUrl:
      response.sprites.other["official-artwork"].front_default ??
      response.sprites.front_default,
    fallbackImageUrl: response.sprites.front_default,
    abilities: sortBySlot(response.abilities).map((item) => ({
      name: item.ability.name,
      isHidden: item.is_hidden,
    })),
    stats: response.stats.map((item) => ({
      name: item.stat.name,
      value: item.base_stat,
    })),
  };
};
