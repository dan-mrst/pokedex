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
import {
  POKEMON_ID_UPPER,
  typeTranslations,
  getProcessedPokemon,
} from "@/lib/pokeapi";

import styles from "./pokemon.module.css";

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
      <nav className="flex justify-between">
        {prev ? (
          <Button variant="secondary">
            <Link className="flex gap2" href={`./${prev.id}`}>
              <Image src={prev.imageUrl} width={48} height={48} alt=""></Image>
              <div>
                <div>{prev.id.toString().padStart(3, "0")}</div>
                <div>{prev.japaneseName}</div>
              </div>
            </Link>
          </Button>
        ) : (
          <Button className="invisible"></Button>
        )}
        {next ? (
          <Button variant="secondary">
            <Link className="flex gap2" href={`./${next.id}`}>
              <Image src={next.imageUrl} width={48} height={48} alt=""></Image>
              <div>
                <div>{next.id.toString().padStart(3, "0")}</div>
                <div>{next.japaneseName}</div>
              </div>
            </Link>
          </Button>
        ) : (
          <Button className="invisible"></Button>
        )}
      </nav>
      <Card className="h-full">
        <CardHeader className="text-center">
          <CardDescription>
            {`No.${pokemon.id.toString().padStart(3, "0")}`}
          </CardDescription>
          <CardTitle className="text-3xl font-bold">
            {pokemon.japaneseName}
          </CardTitle>
          <div className="text-sm">{pokemon.genus}</div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <Image
              src={pokemon.imageUrl}
              width={320}
              height={320}
              alt=""
              className="object-contain"
            ></Image>
          </div>
          <div className={styles["detail"]}>
            <div className={styles["detail__item"]}>
              <h2 className={styles["detail__title"]}>基本情報</h2>
              <dl className={styles["detail__content"]}>
                <div className="flex justify-between">
                  <dt>高さ</dt>
                  <dd>{`${pokemon.height / 10}m`}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>重さ</dt>
                  <dd>{`${pokemon.weight / 10}kg`}</dd>
                </div>
              </dl>
            </div>
            <div className={styles["detail__item"]}>
              <h2 className={styles["detail__title"]}>タイプ</h2>
              <div className={styles["detail__content"]}>
                {pokemon.types.map((type: string, i: number) => (
                  <Badge key={i}>{typeTranslations[type]}</Badge>
                ))}
              </div>
            </div>
            <div className={styles["detail__item"]}>
              <h2 className={styles["detail__title"]}>特性</h2>
              <dl>
                {pokemon.abilities.map((ability, i) => {
                  return (
                    <div key={i} className="border rounded-lg p-3">
                      <dt className="font-medium">{ability.japaneseName}</dt>
                      <dd>
                        {ability.is_hidden && <Badge>隠れ特性</Badge>}
                        <div className="text-sm text-gray-600">
                          {ability.flavor_text}
                        </div>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t-1 pt-4">
          <Button variant="default">
            <Link href={`/evolution/${id}`}>進化系統を見る</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
