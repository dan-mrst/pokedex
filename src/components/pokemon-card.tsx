"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { typeTranslations } from "@/lib/pokeapi";
import { ProcessedPokemon } from "@/lib/types";

interface PokemonCardProps {
  pokemon: ProcessedPokemon;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <Card
        className="hover:shadow-lg transition-shadow cursor-pointer h-full"
        data-name={pokemon.name}
      >
        <CardContent className="p-4">
          <div className="text-center">
            <Image
              src={pokemon.imageUrl}
              width={240}
              height={240}
              alt=""
            ></Image>

            <div>{pokemon.id.toString().padStart(3, "0")}</div>

            <div>{pokemon.japaneseName}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
