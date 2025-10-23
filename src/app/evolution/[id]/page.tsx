import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loading } from "@/components/loading";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProcessedEvolutionTo } from "@/lib/types";
import { getProcessedEvolutionChain } from "@/lib/pokeapi";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EvolutionDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Suspense fallback={<Loading />}>
        <EvolutionDetailContent id={id} />
      </Suspense>
    </div>
  );
}

async function EvolutionDetailContent({ id }: { id: number }) {
  const evolutionChain = await getProcessedEvolutionChain(id);

  const chain = evolutionChain.chain;

  return (
    <div>
      <div>{chain.japaneseName}</div>
      <div className="flex">
        {chain.evolves_to.map((evo, i) => {
          return (
            <EvolutionTreeBranch key={i} pokemon={evo}></EvolutionTreeBranch>
          );
        })}
      </div>
    </div>
  );
}

function EvolutionTreeBranch({ pokemon }: { pokemon: ProcessedEvolutionTo }) {
  const detail = pokemon.evolution_details;
  const evo = pokemon.evolves_to;

  return (
    <div>
      <span>{"=>"}</span>
      <div>{pokemon.japaneseName}</div>
      <div className="flex">
        {evo.map((branch, i) => {
          return (
            <EvolutionTreeBranch key={i} pokemon={branch}></EvolutionTreeBranch>
          );
        })}
      </div>
    </div>
  );
}
