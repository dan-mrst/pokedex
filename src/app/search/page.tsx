import { Suspense } from "react";
import { SearchForm } from "@/components/search-form";
import { Loading } from "@/components/loading";
import { getPokemonSearchList, getProcessedPokemon } from "@/lib/pokeapi";
import { PokemonCard } from "@/components/pokemon-card";
import { PaginationComponent } from "@/components/pagination";
import { POKEMON_ID_UPPER } from "@/lib/constants";
import { PaginationInfo } from "@/lib/types";
import { hiraToKata } from "@/lib/functions";

interface SearchParams {
  q?: string;
  page?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

const pokemonSearchList = await getPokemonSearchList(POKEMON_ID_UPPER);

export default async function SearchPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const page = Number(resolvedParams.page) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">ポケモン検索</h1>

      <SearchForm initialQuery={query}></SearchForm>
      {query && (
        <Suspense key={JSON.stringify(resolvedParams)} fallback={<Loading />}>
          <PokemonSearchResult query={query} page={page}></PokemonSearchResult>
        </Suspense>
      )}
    </div>
  );
}
async function PokemonSearchResult_({
  query,
  page,
}: {
  query: string;
  page: number;
}) {
  return <div>{query}</div>;
}

async function PokemonSearchResult({
  query,
  page,
}: {
  query: string;
  page: number;
}) {
  const kataOrEn = hiraToKata(query);
  try {
    const matchedPokemonList = pokemonSearchList.filter((item) => {
      return (
        item.japaneseName.indexOf(kataOrEn) >= 0 ||
        item.name.indexOf(kataOrEn) >= 0
      );
    });

    const processedList = await Promise.allSettled(
      matchedPokemonList.map((pokemon) => getProcessedPokemon(pokemon.id))
    ).then((result) =>
      result
        .filter((data) => data.status === "fulfilled")
        .map((data) => data.value)
    );

    const totalPages = Math.ceil(matchedPokemonList.length / 10);

    const pagination: PaginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      hasNext: page + 1 <= totalPages,
      hasPrev: page > 1,
      totalCount: matchedPokemonList.length,
    };

    return (
      <div>
        <ul className="flex gap-8 flex-wrap">
          {processedList.map((item) => (
            <li key={item.id}>
              <PokemonCard pokemon={item}></PokemonCard>
            </li>
          ))}
        </ul>
        <PaginationComponent
          pagination={pagination}
          basePath={`/search?q=${query}`}
        ></PaginationComponent>
      </div>
    );
  } catch {
    return <div>ERROR</div>;
  }
}
