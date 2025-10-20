import {
  Name,
  Genus,
  PokemonListResponse,
  Pokemon,
  PokemonSpeciesDetail,
  ProcessedPokemon,
  PaginationInfo,
} from "@/lib/types";

const BASE_URL = "https://pokeapi.co/api/v2";
const SAFE_POKEMON_LIMIT = 1302;

/**
 * ポケモン一覧を取得する
 */
export async function fetchPokemonList(
  limit: number = 20,
  offset: number = 0
): Promise<PokemonListResponse> {
  const res = await fetch(
    `${BASE_URL}/pokemon?offset=${offset}&limit=${Math.min(
      limit,
      SAFE_POKEMON_LIMIT
    )}`
  );
  const data = await res.json().catch(() => {
    throw "fetch Pokemon List error";
  });
  return data;
}

/**
 * 個別のポケモン詳細情報を取得する
 */
export async function fetchPokemon(
  idOrName: string | number
): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  const data = await res.json();
  return data;
}
/**
 * ポケモンの種別詳細情報を取得する
 */
export async function fetchPokemonSpeciesDetail(
  url: string
): Promise<PokemonSpeciesDetail> {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

/**
 * ポケモンの画像URLを取得する
 */
export function getPokemonImageUrl(sprites: Pokemon["sprites"]): string {
  // 💡 課題: official-artwork → home → front_default の優先順位で画像URLを取得
  const imgUrl =
    "official-artwork" in sprites.other
      ? sprites.other["official-artwork"]["front_default"]
      : "home" in sprites.other
      ? sprites.other["home"]["front_default"]
      : sprites["front_default"];

  return imgUrl ?? "";
}

// タイプ名の日本語変換テーブル
export const typeTranslations: Record<string, string> = {
  normal: "ノーマル",
  fire: "ほのお",
  water: "みず",
  grass: "くさ",
  electric: "でんき",
  ice: "こおり",
  fighting: "かくとう",
  poison: "どく",
  ground: "じめん",
  flying: "ひこう",
  psychic: "エスパー",
  bug: "むし",
  rock: "いわ",
  ghost: "ゴースト",
  dragon: "ドラゴン",
  dark: "あく",
  steel: "はがね",
  fairy: "フェアリー",
};

/**
 * ポケモン一覧を処理済みデータとして取得する
 */
export async function getProcessedPokemonList(
  page: number = 1,
  limit: number = 20
): Promise<{
  pokemon: ProcessedPokemon[];
  pagination: PaginationInfo;
}> {
  const pokemonListRes = await fetchPokemonList(
    limit,
    (page - 1) * limit
  ).catch(() => {
    throw "Pokemon List Response Error";
  });

  const count = pokemonListRes.count;
  const next = pokemonListRes.next;
  const previous = pokemonListRes.previous;

  const totalPages = Math.ceil(count / limit);

  const pagination = {
    currentPage: page,
    totalPages: totalPages,
    hasNext: next != null,
    hasPrev: previous != null,
    totalCount: count,
  };

  const pokemonIDs = pokemonListRes.results.map((pokemon) =>
    parseInt(pokemon.url.replace(`${BASE_URL}/pokemon/`, ""))
  );

  const pokemons = await Promise.allSettled(
    pokemonIDs.map((ID) => fetchPokemon(ID))
  ).then((result) =>
    result
      .filter((data) => data.status === "fulfilled")
      .map((data) => data.value)
  );

  const processedPokemons = await Promise.all(
    pokemons.map((pokemon) => processPokemon(pokemon))
  );

  return { pokemon: processedPokemons, pagination: pagination };
}

/**
 * Pokemonをアプリ用に加工整形
 */
async function processPokemon(pokemon: Pokemon): Promise<ProcessedPokemon> {
  const speciesDetail = await fetchPokemonSpeciesDetail(
    pokemon.species.url
  ).catch(() => {
    throw "Pokemon species detail Response Error";
  });

  const processed: ProcessedPokemon = {
    id: pokemon.id,
    name: pokemon.name,
    japaneseName: getJapaneseName(speciesDetail.names) ?? pokemon.name,
    imageUrl: getPokemonImageUrl(pokemon.sprites),
    types: pokemon.types.map((t) => t.type.name),
    height: pokemon.height,
    weight: pokemon.weight,
    genus: getJapaneseGenus(speciesDetail.genera) ?? "",
    abilities: pokemon.abilities,
  };

  return processed;
}

/**
 * 多言語名前配列から日本語名を取得する
 */
export function getJapaneseName(names: Name[]): string | undefined {
  const hrkt = names.find((item) => item.language.name === "ja-Hrkt")?.name;
  const ja = names.find((item) => item.language.name === "ja")?.name;

  return hrkt ?? ja;
}

/**
 * 多言語分類配列から日本語名を取得する
 */
export function getJapaneseGenus(genera: Genus[]): string | undefined {
  const hrkt = genera.find((item) => item.language.name === "ja-Hrkt")?.genus;
  const ja = genera.find((item) => item.language.name === "ja")?.genus;

  const en = genera.find((item) => item.language.name === "en")?.genus;

  return hrkt ?? ja ?? en;
}
