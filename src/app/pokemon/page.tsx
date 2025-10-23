import { Suspense } from "react";
import { Loading } from "@/components/loading";
import { getProcessedPokemonList } from "@/lib/pokeapi";

import { PokemonCard } from "@/components/pokemon-card";
import { PaginationComponent } from "@/components/pagination";

import { LIST_PER_PAGE } from "@/lib/constants";

interface SearchParams {
  page?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function PokemonListPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">ポケモン一覧</h1>

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
        <ul className="flex gap-8 flex-wrap">
          {processedList.pokemon.map((item) => (
            <li key={item.id}>
              <PokemonCard pokemon={item}></PokemonCard>
            </li>
          ))}
        </ul>
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
