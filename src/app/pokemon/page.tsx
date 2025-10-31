import { Loading } from "@/components/loading";
import { getProcessedPokemonList } from "@/lib/pokeapi";
import { Suspense } from "react";

import { PaginationComponent } from "@/components/pagination/component";
import { PokemonCard } from "@/components/pokemon-card";

import { LIST_PER_PAGE } from "@/lib/constants";

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
  const currentPage = Number(resolvedParams.page) || 1;

  return (
    <div className="wrapper">
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
        <ul className="pokemons-list">
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
