import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";

import { Loading } from "@/components/Loading";
import { ToList } from "@/components/ToList";
import { ToggleByIsTouch } from "@/components/ToggleByIsTouch";

import { Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { EvolutionTree } from "@/components/EvolutionTree";

import {
  getProcessedPokemon,
  getProcessedEvolutionChain,
  getPokemonForSearch,
} from "@/lib/pokeapi";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const pokemon = await getPokemonForSearch(resolvedParams.id);

  return {
    title:
      pokemon.id > 0
        ? `${pokemon.japaneseName}の進化系統図`
        : "表示する進化系統図がありません",
  };
}

export default async function EvolutionDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Suspense fallback={<Loading />}>
        <EvolutionDetailContent id={id} />
      </Suspense>
      <ToList />
    </div>
  );
}

async function EvolutionDetailContent({ id }: { id: number }) {
  const pokemon = await getProcessedPokemon(id);
  const evolutionChain = await getProcessedEvolutionChain(id);
  const chain = evolutionChain.chain;

  return (
    <div className="flex flex-col justify-center z-0">
      <h1>
        {pokemon.id > 0
          ? `${pokemon.japaneseName}の進化系統図`
          : "表示する進化系統図がありません"}
      </h1>
      <Button variant="link">
        <Link href={`/pokemon/${id}`} className="font-semibold text-gray-400">
          <Undo2 size={20} className="inline mr-1 -mt-1" />
          ポケモンの詳細に戻る
        </Link>
      </Button>
      <div className="mt-4 app-orientation">
        <p>
          ポケモン
          <ToggleByIsTouch
            touch={"をタップする"}
            click={"にカーソルを合わせる"}
          />
          と進化の分岐と条件の詳細がハイライトされます。
        </p>
        <p>
          各ポケモンを
          <ToggleByIsTouch touch={"もう一度タップ"} click={"クリック"} />
          するとポケモンの詳細を見ることができます。
        </p>
      </div>
      <div data-part="tree-wrapper" className="py-8 md:overflow-x-hidden">
        <EvolutionTree
          nodeId={0}
          pokemon={chain}
          depth={0}
          siblings={1}
          current={id}
        ></EvolutionTree>
      </div>
    </div>
  );
}
