import { Metadata } from "next";
import { Suspense } from "react";

import { Loading } from "@/components/atoms/Loading";
import { TransitionReset } from "@/components/atoms/TransitionLink";
import { PokemonCard } from "@/components/molecules/PokemonCard";
import {
  PaginationCounter,
  PaginationButtons,
} from "@/components/organisms/Pagination";

import { LIST_PER_PAGE } from "@/lib/constants";
import { getProcessedPokemonList } from "@/lib/pokeapi";

import { Paginator } from "@/utils/Paginator";

interface SearchParams {
  page?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: "一覧",
  };
}

export default async function PokemonListPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const currentPage = Paginator.getPageByParam(resolvedParams.page);

  return (
    <div className="wrapper">
      <TransitionReset />
      <h1>
        ポケモン一覧<span className="h1-sub">POKEMONS LIST</span>
      </h1>
      <Suspense fallback={<Loading />}>
        <PokemonListContent page={currentPage} />
      </Suspense>
    </div>
  );
}

async function PokemonListContent({ page }: { page: number }) {
  try {
    const processedList = await getProcessedPokemonList(page, LIST_PER_PAGE);

    const pokemon = processedList.pokemon;

    const pagination = processedList.pagination;
    const paginator = new Paginator(processedList.pagination);

    return (
      <>
        <PaginationCounter pagination={pagination} />
        {paginator.isCorrectPage() ? (
          <ul className="pokemons-list">
            {pokemon.map((item) => (
              <li key={item.id}>
                <PokemonCard pokemon={item}></PokemonCard>
              </li>
            ))}
          </ul>
        ) : (
          <div className="error-message">表示するポケモンがありません</div>
        )}

        <PaginationButtons
          pagination={pagination}
          basePath={"/pokemon"}
        ></PaginationButtons>
      </>
    );
  } catch {
    return <div>ERROR</div>;
  }
}
