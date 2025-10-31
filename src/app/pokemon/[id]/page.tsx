import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Loading } from "@/components/loading";
import { ToList } from "@/components/to-list";
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

import { ChevronLeft, ChevronRight, Network } from "lucide-react";

import {
  POKEMON_ID_UPPER,
  getProcessedPokemon,
  getPokemonForSearch,
} from "@/lib/pokeapi";
import { typeTranslations, typeTextColor } from "@/lib/constants";

import styles from "./pokemon.module.css";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const pokemon = await getPokemonForSearch(resolvedParams.id);

  return {
    title: pokemon.japaneseName,
  };
}

export default async function PokemonDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  return (
    <div className="wrapper">
      <Suspense fallback={<Loading />}>
        <PokemonDetailContent id={id} />
      </Suspense>
      <ToList />
    </div>
  );
}

async function PokemonDetailContent({ id }: { id: number }) {
  const pokemon = await getProcessedPokemon(id);

  const next =
    id + 1 <= POKEMON_ID_UPPER ? await getProcessedPokemon(id + 1) : null;
  const prev = id - 1 > 0 ? await getProcessedPokemon(id - 1) : null;
  return (
    <>
      <nav className="flex justify-between">
        {prev ? (
          <Link className={`${styles.anchor}`} href={`./${prev.id}`}>
            <ChevronLeft size={40} />
            <div className={styles.anchorInner}>
              <Image
                src={prev.imageUrl}
                width={72}
                height={72}
                alt=""
                className={styles.anchorImage}
              />
              <div className={styles.anchorText}>
                <div className="pokemon-id">
                  <span className="hidden md:inline">No.</span>
                  {prev.id.toString().padStart(3, "0")}
                </div>
                <div className={styles.anchorName}>{prev.japaneseName}</div>
              </div>
            </div>
          </Link>
        ) : (
          <Button className="invisible"></Button>
        )}
        {next ? (
          <Link
            className={`${styles.anchor} text-primary-900 hover:text-primary-500`}
            href={`./${next.id}`}
          >
            <div className={styles.anchorInner}>
              <Image
                src={next.imageUrl}
                width={72}
                height={72}
                alt=""
                className={styles.anchorImage}
              />
              <div className={styles.anchorText}>
                <div className="pokemon-id">
                  <span className="hidden md:inline">No.</span>
                  {next.id.toString().padStart(3, "0")}
                </div>
                <div className={styles.anchorName}>{next.japaneseName}</div>
              </div>
            </div>
            <ChevronRight size={40} className="shrink-0" />
          </Link>
        ) : (
          <Button className="invisible"></Button>
        )}
      </nav>
      <Card className="h-full mt-8">
        <CardHeader className="text-center">
          <CardDescription className="pokemon-id text-sm">
            {`No.${pokemon.id.toString().padStart(3, "0")}`}
          </CardDescription>
          <CardTitle className="text-3xl font-bold text-secondary-950">
            {pokemon.japaneseName}
          </CardTitle>
          <div className="text-base text-secondary-900">{pokemon.genus}</div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8 px-8 sm:px-24 md:px-16">
          <div className="flex flex-col items-center justify-center">
            <Image
              src={pokemon.imageUrl}
              width={320}
              height={320}
              alt=""
              className="object-contain"
            />
            <dl className="flex gap-4 items-center">
              <div className={styles.figureItem}>
                <dt>高さ</dt>
                <dd>
                  <span className={styles.figureNumber}>
                    {pokemon.height / 10}
                  </span>
                  m
                </dd>
              </div>
              ／
              <div className={styles.figureItem}>
                <dt>重さ</dt>
                <dd>
                  <span className={styles.figureNumber}>
                    {pokemon.weight / 10}
                  </span>
                  kg
                </dd>
              </div>
            </dl>
          </div>
          <div className={styles.detail}>
            <div className={styles.item}>
              <h2 className={styles.title}>タイプ</h2>
              <div className={styles.content}>
                <ul className={styles.types}>
                  {pokemon.types.map((type: string, i: number) => (
                    <li key={i}>
                      <Badge
                        className={`bg-type-${type} text-${typeTextColor(
                          type
                        )}`}
                      >
                        {typeTranslations[type]}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={styles.item}>
              <h2 className={styles.title}>特性</h2>
              <div className={styles.content}>
                <dl className="flex flex-col gap-4">
                  {pokemon.abilities.map((ability, i) => {
                    return (
                      <div
                        key={i}
                        className="border border-gray-500 rounded-lg relative overflow-hidden"
                      >
                        <dt className="px-2 py-1 bg-gray-700 text-white  flex justify-between items-center">
                          {ability.japaneseName}
                          {ability.is_hidden && (
                            <div className="px-2 py-1 bg-white text-gray-700 text-sm w-fit leading-none rounded-sm font-bold">
                              隠れ特性
                            </div>
                          )}
                        </dt>
                        <dd>
                          <div className="text-sm text-gray-600 px-3 py-2">
                            {ability.flavor_text}
                          </div>
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t-1 pt-4">
          <Link href={`/evolution/${id}`}>
            <Button
              variant="default"
              className="cursor-pointer 
              text-gray-800 bg-secondary-400 hover:bg-secondary-300 active:bg-secondary-500"
            >
              <Network />
              進化系統を見る
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
