import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Loading } from "@/components/loading";
import { ToList } from "@/components/to-list";

import { Button } from "@/components/ui/button";

import { EvolutionTree } from "@/components/evolution-tree/component";

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
    title: `${pokemon.japaneseName}の進化系統図`,
  };
}

export default async function EvolutionDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Suspense fallback={<Loading />}>
        <EvolutionDetailContent id={id} />
      </Suspense>
      <ToList></ToList>
    </div>
  );
}

async function EvolutionDetailContent({ id }: { id: number }) {
  const pokemon = await getProcessedPokemon(id);
  const evolutionChain = await getProcessedEvolutionChain(id);
  const chain = evolutionChain.chain;

  return (
    <div className="flex flex-col items-center justify-center z-0">
      <h1>{`${pokemon.japaneseName}の進化系統図`}</h1>
      <Button variant="link">
        <Link href={`/pokemon/${id}`}>ポケモンの詳細に戻る</Link>
      </Button>
      <EvolutionTree
        pos={0}
        pokemon={chain}
        depth={0}
        siblings={1}
        current={id}
      ></EvolutionTree>
    </div>
  );
}
