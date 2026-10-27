type PokemonAbility = {
  name: string;
  isHidden: boolean;
};

type PokemonStat = {
  name: string;
  value: number;
};

export type Pokemon = {
  id: number;
  name: string;
  displayName: string;
  numberLabel: string;
  heightMeters: number;
  weightKilograms: number;
  types: string[];
  imageUrl: string | null;
  fallbackImageUrl: string | null;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
};

export type PokemonPage = {
  items: Pokemon[];
  total: number;
  page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
