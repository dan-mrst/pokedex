import { ChevronLeft, ChevronRight, Network } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, Suspense } from "react";

import { Loading } from "@/components/atoms/Loading";
import { ToList } from "@/components/atoms/ToList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { typeTranslations, typeTextColor } from "@/lib/constants";
import {
  POKEMON_ID_UPPER,
  getProcessedPokemon,
  getPokemonForSearch,
} from "@/lib/pokeapi";
import { ProcessedPokemon } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  try {
    const pokemon = await getPokemonForSearch(resolvedParams.id);

    return isNaN(Number(resolvedParams.id))
      ? { title: "表示するポケモンがありません" }
      : {
          title: pokemon.japaneseName,
        };
  } catch (error) {
    return {
      title: "表示するポケモンがありません",
    };
  }
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
  const prev =
    id - 1 > 0 && id - 1 <= POKEMON_ID_UPPER
      ? await getProcessedPokemon(id - 1)
      : null;
  return (
    <>
      <nav className="flex justify-between">
        <NavAnchor pokemon={prev} variant={"left"} />
        <NavAnchor pokemon={next} variant={"right"} />
      </nav>
      <Card className="h-full mt-8" data-name={pokemon.name}>
        <CardHeader className="text-center">
          <CardDescription className="pokemon-id text-sm">
            {`No.${
              pokemon.id > 0 ? pokemon.id.toString().padStart(3, "0") : "---"
            }`}
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
            <dl className="flex gap-4 items-center mt-2">
              <FigureItem>
                <dt>高さ</dt>
                <dd>
                  <FigureNumber>
                    {(pokemon.height / 10).toFixed(1)}
                  </FigureNumber>
                  m
                </dd>
              </FigureItem>
              ／
              <FigureItem>
                <dt>重さ</dt>
                <dd>
                  <FigureNumber>
                    {(pokemon.weight / 10).toFixed(1)}
                  </FigureNumber>
                  m
                </dd>
              </FigureItem>
            </dl>
          </div>
          <div className="flex flex-col gap-4">
            <PokemonDetailItem title={"タイプ"}>
              <ul className="flex gap-2">
                {pokemon.types.length > 0 &&
                  pokemon.types.map((type: string, i: number) => (
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
                {pokemon.types.length <= 0 && (
                  <Badge variant={"default"}>--</Badge>
                )}
              </ul>
            </PokemonDetailItem>
            <PokemonDetailItem title={"特性"}>
              <dl className="flex flex-col gap-4">
                {pokemon.abilities.length > 0 &&
                  pokemon.abilities.map((ability, i) => {
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
                {pokemon.abilities.length <= 0 && (
                  <div className="text-gray-400">--</div>
                )}
              </dl>
            </PokemonDetailItem>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t-1 pt-4">
          {pokemon.id > 0 && (
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
          )}
          {pokemon.id <= 0 && (
            <Button
              variant="default"
              className=" 
              text-gray-400 bg-gray-600 hover:bg-gray-600"
            >
              <Network />
              進化系統を見る
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}

function NavAnchor({
  pokemon,
  variant,
}: {
  pokemon: ProcessedPokemon | null;
  variant: "left" | "right";
}) {
  return pokemon && pokemon.id > 0 ? (
    <Link
      className="px-2 py-1 rounded-md border border-gray-200 flex gap-1 items-center bg-white text-primary-900 hover:text-primary-500"
      href={`./${pokemon.id}`}
    >
      {variant === "left" && <ChevronLeft size={40} />}
      <div className="flex flex-col gap-6 md:contents md:gap-10">
        <Image
          src={pokemon.imageUrl}
          width={72}
          height={72}
          alt=""
          className="-my-10 scale-70 md:scale-100"
        />
        <div className="flex items-center gap-1 md:flex-col md:gap-0">
          <div className="pokemon-id">
            <span className="hidden md:inline">No.</span>
            {pokemon.id.toString().padStart(3, "0")}
          </div>
          <div className="font-semibold mt-0 md:mt-0.5 text-sm md:text-base">
            {pokemon.japaneseName}
          </div>
        </div>
      </div>
      {variant === "right" && <ChevronRight size={40} />}
    </Link>
  ) : (
    <Button className="invisible"></Button>
  );
}

function PokemonDetailItem({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold mt-2">{title}</h2>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function FigureItem({
  children: [title, definition],
}: {
  children: ReactNode[];
}) {
  return (
    <div className="flex gap-4 items-baseline text-sm">
      {title}
      {definition}
    </div>
  );
}

function FigureNumber({ children }: { children: string }) {
  return (
    <span className="text-xl font-bold text-primary-900 mr-1">{children}</span>
  );
}
