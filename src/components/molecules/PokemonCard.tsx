"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ProcessedPokemon } from "@/lib/types";
import { typeColors } from "@/lib/constants";

interface PokemonCardProps {
  pokemon: ProcessedPokemon;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const type1 = pokemon.types[0];
  const type2 = pokemon.types[pokemon.types.length - 1];
  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <Card
        className="hover:shadow-lg transition-shadow cursor-pointer h-full rounded-md p-2 bg-gradient-to-br from-gray-50 via-gray-200 to-gray-100"
        data-name={pokemon.name}
      >
        <div
          className={`py-1 bg-gradient-to-r ${typeColors["from_" + type1]} ${
            typeColors["to_" + type2]
          }
          }`}
        >
          <CardContent className="py-6 px-4 bg-white">
            <div className="text-center">
              <Image
                src={pokemon.imageUrl}
                width={240}
                height={240}
                alt=""
              ></Image>

              <div className="pokemon-id mt-2">
                {pokemon.id.toString().padStart(3, "0")}
              </div>

              <div className="font-semibold text-primary-950">
                {pokemon.japaneseName}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
