import { Metadata } from "next";
import { Suspense } from "react";

import { ToList } from "@/components/atoms/ToList";
import { TransitionReset } from "@/components/atoms/TransitionLink";
import { PokemonCard } from "@/components/molecules/PokemonCard";
import { SearchForm } from "@/components/molecules/SearchForm";
import { Loading } from "@/components/organisms/Loading";
import {
  PaginationCounter,
  PaginationButtons,
} from "@/components/organisms/Pagination";

import { SEARCH_PER_PAGE } from "@/lib/constants";
import {
  POKEMON_ID_UPPER,
  getPokemonSearchList,
  getProcessedPokemon,
} from "@/lib/pokeapi";
import { ProcessedPokemon } from "@/lib/types";

import { PaginationInfo, Paginator } from "@/utils/Paginator";
import { hiraToKata } from "@/utils/utils";

interface SearchParams {
  q?: string;
  page?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

const pokemonSearchList = await getPokemonSearchList(POKEMON_ID_UPPER);

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: "検索",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const page = Paginator.getPageByParam(resolvedParams.page);

  const kata = hiraToKata(query);
  const matchedPokemonList = pokemonSearchList.filter((pokemon) => {
    return pokemon.japaneseName.indexOf(kata) >= 0;
  });

  const pagination: PaginationInfo = {
    currentPage: page,
    totalCount: matchedPokemonList.length,
    perPage: SEARCH_PER_PAGE,
  };

  const paginator = new Paginator(pagination);

  const pagedPokemonList = matchedPokemonList.filter((_, i) =>
    paginator.isItemInCurrentPage(i)
  );
  const processedList = await Promise.allSettled(
    pagedPokemonList.map((pokemon) => getProcessedPokemon(pokemon.id))
  ).then((result) =>
    result
      .filter((data) => data.status === "fulfilled")
      .map((data) => data.value)
  );

  return (
    <div className="wrapper">
      <TransitionReset />
      <h1>
        ポケモン検索<span className="h1-sub">SEARCH</span>
      </h1>
      <div className="app-orientation">
        <p>ポケモンの名前を入力してください。</p>
        <p>ひらがなまたはカタカナに対応しています。</p>
      </div>

      <SearchForm initialQuery={query}></SearchForm>
      {query && (
        <Suspense
          key={JSON.stringify(resolvedParams)}
          fallback={<Loading message={"検索中..."} />}
        >
          <PokemonSearchResult
            query={query}
            processedList={processedList}
            pagination={pagination}
          ></PokemonSearchResult>
        </Suspense>
      )}
      <ToList />
    </div>
  );
}

function PokemonSearchResult({
  query,
  processedList,
  pagination,
}: {
  query: string;
  processedList: ProcessedPokemon[];
  pagination: PaginationInfo;
}) {
  const paginator = new Paginator(pagination);
  return (
    <div className="mt-12">
      <div className="text-sm text-gray-500">
        <p>{`「${query}」の検索結果：${paginator.totalCount}件${
          paginator.totalCount > 0 ? "見つかりました" : ""
        }`}</p>
      </div>
      <PaginationCounter pagination={pagination} />
      {paginator.isCorrectPage() ? (
        <ul className="pokemons-list">
          {processedList.map((item) => (
            <li key={item.id}>
              <PokemonCard pokemon={item} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="error-message">ページ指定が誤っています</div>
      )}

      <PaginationButtons
        pagination={pagination}
        basePath={`/search?q=${query}`}
      ></PaginationButtons>
    </div>
  );
}
