import { POKEMON_PAGE_SIZE } from "@pokemon/api/constants";

export const normalizePokemonPage = (
  value: string | string[] | undefined,
): number => {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return 1;
  }

  const page = Number(value);
  const offset = (page - 1) * POKEMON_PAGE_SIZE;

  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    !Number.isSafeInteger(offset)
  ) {
    return 1;
  }

  return page;
};
