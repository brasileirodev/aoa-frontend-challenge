import "server-only";
import {
  POKEMON_BASE_URL,
  POKEMON_PAGE_SIZE,
  REVALIDATE_SECONDS,
} from "@pokemon/api/constants";
import { PokemonApiError } from "@pokemon/api/errors";
import {
  type PokemonListResponse,
  pokemonResponseSchema,
  pokemonIdentifierSchema,
  pokemonListResponseSchema,
} from "@pokemon/api/schema";
import type { Pokemon, PokemonPage } from "@pokemon/models/pokemon";
import { mapPokemon } from "@pokemon/api/mappers";

export const getPokemon = async (idOrName: string): Promise<Pokemon> => {
  const identifierResult = pokemonIdentifierSchema.safeParse(idOrName);

  if (!identifierResult.success) {
    throw new PokemonApiError(
      "INVALID_INPUT",
      identifierResult.error.errors[0]?.message ??
        "Informe um nome ou número válido",
    );
  }

  const identifier = identifierResult.data;

  let response: Response;
  try {
    response = await fetch(
      `${POKEMON_BASE_URL}/${encodeURIComponent(identifier)}`,
      {
        next: {
          revalidate: REVALIDATE_SECONDS,
        },
      },
    );
  } catch {
    throw new PokemonApiError(
      "NETWORK_ERROR",
      "Não foi possível conectar à PokéAPI",
    );
  }

  if (response.status === 404) {
    throw new PokemonApiError(
      "NOT_FOUND",
      "Pokémon não encontrado.",
      response.status,
    );
  }

  if (!response.ok) {
    throw new PokemonApiError(
      "HTTP_ERROR",
      "Não foi possível buscar o Pokémon.",
      response.status,
    );
  }
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new PokemonApiError(
      "INVALID_RESPONSE",
      "Não foi possível ler a resposta da PokéAPI como JSON.",
      response.status,
    );
  }

  const result = pokemonResponseSchema.safeParse(data);

  if (!result.success) {
    throw new PokemonApiError(
      "INVALID_RESPONSE",
      "A resposta da PokéAPI possui um formato inesperado.",
      response.status,
    );
  }

  return mapPokemon(result.data);
};

export const getPokemonList = async (
  page: number = 1,
): Promise<PokemonListResponse> => {
  const offset = (page - 1) * POKEMON_PAGE_SIZE;
  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    !Number.isSafeInteger(offset)
  ) {
    throw new PokemonApiError("INVALID_INPUT", "Informe uma página válida");
  }

  const url = new URL(POKEMON_BASE_URL);
  url.searchParams.set("limit", String(POKEMON_PAGE_SIZE));
  url.searchParams.set("offset", String(offset));

  let response: Response;

  try {
    response = await fetch(url, {
      next: {
        revalidate: REVALIDATE_SECONDS,
      },
    });
  } catch {
    throw new PokemonApiError(
      "NETWORK_ERROR",
      "Não foi possível conectar à PokéAPI.",
    );
  }

  if (!response.ok) {
    throw new PokemonApiError(
      "HTTP_ERROR",
      "Não foi possível buscar a lista de Pokémon.",
      response.status,
    );
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new PokemonApiError(
      "INVALID_RESPONSE",
      "Não foi possível ler a listagem como JSON",
      response.status,
    );
  }

  const result = pokemonListResponseSchema.safeParse(data);

  if (!result.success) {
    throw new PokemonApiError(
      "INVALID_RESPONSE",
      "A listagem possui um formato inesperado.",
      response.status,
    );
  }

  return result.data;
};

export const getPokemonPage = async (
  page: number = 1,
): Promise<PokemonPage> => {
  let currentPage = page;
  let list = await getPokemonList(currentPage);

  const totalPages = Math.max(1, Math.ceil(list.count / POKEMON_PAGE_SIZE));

  if (currentPage > totalPages) {
    currentPage = 1;
    list = await getPokemonList(currentPage);
  }

  const items = await Promise.all(
    list.results.map((item) => getPokemon(item.name)),
  );

  return {
    items,
    total: list.count,
    page: currentPage,
    hasNextPage: list.next !== null,
    hasPreviousPage: list.previous !== null,
  };
};
