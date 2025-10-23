import { Suspense } from "react";
import { SearchForm } from "@/components/search-form";
import { Loading } from "@/components/loading";
import {
  POKEMON_ID_UPPER,
  getPokemonSearchList,
  getProcessedPokemon,
} from "@/lib/pokeapi";
import { PokemonCard } from "@/components/pokemon-card";
import { PaginationComponent } from "@/components/pagination";
import { PaginationInfo } from "@/lib/types";
import { SEARCH_PER_PAGE } from "@/lib/constants";
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

async function PokemonSearchResult({
  query,
  page,
}: {
  query: string;
  page: number;
}) {
  const kata = hiraToKata(query);
  try {
    const matchedPokemonList = pokemonSearchList.filter((pokemon) => {
      return pokemon.japaneseName.indexOf(kata) >= 0;
    });

    const pagedPokemonList = matchedPokemonList.filter(
      (pokemon, i) =>
        i > SEARCH_PER_PAGE * (page - 1) - 1 && i < SEARCH_PER_PAGE * page
    );

    const processedList = await Promise.allSettled(
      pagedPokemonList.map((pokemon) => getProcessedPokemon(pokemon.id))
    ).then((result) =>
      result
        .filter((data) => data.status === "fulfilled")
        .map((data) => data.value)
    );

    const totalPages = Math.ceil(matchedPokemonList.length / SEARCH_PER_PAGE);

    const pagination: PaginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      hasNext: page + 1 <= totalPages,
      hasPrev: page > 1,
      totalCount: matchedPokemonList.length,
    };

    return (
      <div>
        <div>
          <p>{`「${query}」の検索結果：${pagination.totalCount}件見つかりました`}</p>
          <p>{`${SEARCH_PER_PAGE * (page - 1) + 1}〜${
            SEARCH_PER_PAGE * page
          }／${pagination.totalCount}`}</p>
        </div>
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
  } catch (e) {
    return <div>エラーが発生しました。</div>;
  }
}
