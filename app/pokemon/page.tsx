import { Container } from "@components/atoms/Container";
import { Typography } from "@components/atoms/Typography";
import { getPokemonPage } from "@pokemon/api";
import { normalizePokemonPage } from "@pokemon/routing/query";
import { PokemonGrid } from "@pokemon/components/organisms/PokemonGrid";
import { PokemonCatalogHeader } from "@modules/pokemon/components/organisms/PokemonCatalogHeader";
import { PokemonSearchForm } from "@pokemon/components/organisms/PokemonSearchForm";

type PokemonPageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function PokemonPage({ searchParams }: PokemonPageProps) {
  const query = await searchParams;
  const page = normalizePokemonPage(query.page);
  const catalog = await getPokemonPage(page);

  return (
    <main lang="pt-BR" className="min-h-screen bg-neutral-50 py-6 lg:py-12">
      <Container size="wide" className="space-y-6">
        <PokemonCatalogHeader />
        <PokemonSearchForm />
        <Typography>
          Página {catalog.page} · {catalog.total} Pokémon
        </Typography>
        <PokemonGrid pokemon={catalog.items} />
      </Container>
    </main>
  );
}
