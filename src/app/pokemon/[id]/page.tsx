import { POKEMON_ID_UPPER } from "@/lib/constants";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loading } from "@/components/loading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { typeTranslations, getProcessedPokemon } from "@/lib/pokeapi";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PokemonDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Suspense fallback={<Loading />}>
        <PokemonDetailContent id={id} />
      </Suspense>
    </div>
  );
}

async function PokemonDetailContent({ id }: { id: number }) {
  const pokemon = await getProcessedPokemon(id);

  const next =
    id + 1 <= POKEMON_ID_UPPER ? await getProcessedPokemon(id + 1) : null;
  const prev = id - 1 > 0 ? await getProcessedPokemon(id - 1) : null;
  // 💡 課題: 基本情報（名前、画像、タイプ、高さ、重さ）を表示
  return (
    <>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
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
            {pokemon.types.map((type: string, i: number) => (
              <Badge key={i}>{typeTranslations[type]}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <nav>
        {prev && (
          <Button variant="secondary">
            <Link href={`./${prev.id}`}>
              <Image src={prev.imageUrl} width={48} height={48} alt=""></Image>
              <div>{prev.id.toString().padStart(3, "0")}</div>
              <div>{prev.japaneseName}</div>
            </Link>
          </Button>
        )}
        {next && (
          <Button variant="secondary">
            <Link href={`./${next.id}`}>
              <Image src={next.imageUrl} width={48} height={48} alt=""></Image>
              <div>{next.id.toString().padStart(3, "0")}</div>
              <div>{next.japaneseName}</div>
            </Link>
          </Button>
        )}
      </nav>
    </>
  );
  // 💡 課題: 前後のポケモンへのナビゲーションボタン
  // 💡 課題: エラーハンドリング
}
