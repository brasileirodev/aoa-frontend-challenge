import { z } from "zod";

const isDigitsOnly = (value: string) => /^\d+$/.test(value);

export const pokemonListResponseSchema = z.object({
  count: z.number().int().nonnegative(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: z.array(
    z.object({
      name: z.string().min(1),
      url: z.string().url(),
    }),
  ),
});

export type PokemonListResponse = z.infer<typeof pokemonListResponseSchema>;

export const pokemonResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  height: z.number().int().nonnegative(),
  weight: z.number().int().nonnegative(),
  types: z
    .array(
      z.object({
        slot: z.number().int().positive(),
        type: z.object({
          name: z.string().min(1),
        }),
      }),
    )
    .min(1),
  sprites: z.object({
    front_default: z.string().url().nullable(),
    other: z.object({
      "official-artwork": z.object({
        front_default: z.string().url().nullable(),
      }),
    }),
  }),
  abilities: z.array(
    z.object({
      is_hidden: z.boolean(),
      slot: z.number().int().positive(),
      ability: z.object({
        name: z.string().min(1),
      }),
    }),
  ),
  stats: z.array(
    z.object({
      base_stat: z.number().int().nonnegative(),
      stat: z.object({
        name: z.string().min(1),
      }),
    }),
  ),
});

export type PokemonResponse = z.infer<typeof pokemonResponseSchema>;

export const pokemonIdentifierSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Informe um nome ou número.")
  .refine(
    (value) => {
      if (!isDigitsOnly(value)) {
        return true;
      }

      const id = Number(value);

      return Number.isSafeInteger(id) && id > 0;
    },
    {
      message: "Informe um número de Pokémon válido.",
    },
  )
  .transform((value) => {
    if (isDigitsOnly(value)) {
      return String(Number(value));
    }

    return value;
  });
