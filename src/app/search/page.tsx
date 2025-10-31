import { Suspense } from "react";
import { Metadata } from "next";

import { PokemonCard } from "@/components/pokemon-card";
import { PaginationComponent } from "@/components/pagination/component";
import { SearchForm } from "@/components/search-form";
import { Loading } from "@/components/loading";
import { ToList } from "@/components/to-list";

import {
  POKEMON_ID_UPPER,
  getPokemonSearchList,
  getProcessedPokemon,
} from "@/lib/pokeapi";
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

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: "検索",
  };
}

const pokemonSearchList = await getPokemonSearchList(POKEMON_ID_UPPER);

export default async function SearchPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const page = Number(resolvedParams.page) || 1;

  return (
    <div className="wrapper">
      <h1>
        ポケモン検索<span className="h1__sub">SEARCH</span>
      </h1>
      <div className="text-center text-gray-500 text-sm">
        <p>ポケモンの名前を入力してください。</p>
        <p>ひらがなまたはカタカナに対応しています。</p>
      </div>

      <SearchForm initialQuery={query}></SearchForm>
      {query && (
        <Suspense
          key={JSON.stringify(resolvedParams)}
          fallback={<Loading message={"検索中..."} />}
        >
          <PokemonSearchResult query={query} page={page}></PokemonSearchResult>
        </Suspense>
      )}
      <ToList />
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
      <div className="mt-12">
        <div className="text-sm text-gray-500">
          <p>{`「${query}」の検索結果：${pagination.totalCount}件${
            pagination.totalCount > 0 ? "見つかりました" : ""
          }`}</p>
        </div>
        {pagination.totalCount > 0 && (
          <div className="mt-4 w-fit mx-auto text-gray-400">
            <span className="text-base">
              {`${SEARCH_PER_PAGE * (page - 1) + 1} - ${Math.min(
                pagination.totalCount,
                SEARCH_PER_PAGE * page
              )}`}
            </span>
            <span className="mt-0.5 text-sm">
              ／{`${pagination.totalCount}`}
            </span>
          </div>
        )}
        <ul className="pokemons-list">
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
    return <div className="text-red-600 text-xs">エラーが発生しました。</div>;
  }
}
