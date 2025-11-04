import { Loading } from "@/components/loading";

import { Suspense } from "react";
import { Metadata } from "next";

import { PaginationComponent } from "@/components/pagination/component";
import { PokemonCard } from "@/components/pokemon-card";
import { getProcessedPokemonList } from "@/lib/pokeapi";
import { LIST_PER_PAGE } from "@/lib/constants";

import { TransitionLink } from "@/components/transition-link";
import { TransitionReset } from "@/components/transition-link";

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
  const currentPage =
    typeof resolvedParams.page === "undefined"
      ? 1
      : isNaN(Number(resolvedParams.page))
      ? 0
      : Number(resolvedParams.page);

  return (
    <div className="wrapper">
      <TransitionReset />
      <h1>
        ポケモン一覧<span className="h1__sub">POKEMONS LIST</span>
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
    return (
      <div>
        {page > 0 && processedList.pokemon.length > 0 && (
          <ul className="pokemons-list">
            {processedList.pokemon.map((item) => (
              <li key={item.id}>
                <PokemonCard pokemon={item}></PokemonCard>
              </li>
            ))}
          </ul>
        )}
        {(page <= 0 || processedList.pokemon.length <= 0) && (
          <div className="text-center text-sm text-gray-400">
            表示するポケモンがありません
          </div>
        )}

        <PaginationComponent
          pagination={processedList.pagination}
          basePath={"/pokemon"}
        ></PaginationComponent>
      </div>
    );
  } catch {
    return <div>ERROR</div>;
  }
}
