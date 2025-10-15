import { Suspense } from "react";
import { Loading } from "@/components/loading";
import { fetchPokemonList, getProcessedPokemonListStr } from "@/lib/pokeapi";

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
  // 💡 課題: getProcessedPokemonList()を使ってポケモンデータを取得
  try {
    const list = await getProcessedPokemonListStr(1, 20);
    console.log("list:", list);
    return <div>{JSON.stringify(list)}</div>;
  } catch {
    return <div>ERROR</div>;
  }
  // 💡 課題: PokemonCardコンポーネントでグリッド表示
  // 💡 課題: PaginationComponentでページング
}
