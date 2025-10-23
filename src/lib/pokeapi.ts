import {
  Name,
  FlavorText,
  Genus,
  MultiLangItem,
  PokemonListResponse,
  Pokemon,
  PokemonSpeciesDetail,
  PokemonAbility,
  ProcessedAbility,
  PokemonAbilityDetail,
  ProcessedPokemon,
  PokemonForSearch,
  PaginationInfo,
  EvolutionChain,
  ProcessedEvolutionChain,
  EvolvesTo,
  ProcessedEvolutionTo,
  EvolutionDetails,
  EvolutionTrigger,
} from "@/lib/types";

import { BASE_URL, LIST_PER_PAGE } from "@/lib/constants";

export const POKEMON_ID_UPPER = await (async () => {
  const res = await fetch(`${BASE_URL}/pokemon-species/?limit=0`);
  const data: PokemonListResponse = await res.json();
  return data.count;
})();

const SAFE_POKEMON_LIMIT = POKEMON_ID_UPPER - 20;

/**
 * ポケモン一覧を取得する
 */
export async function fetchPokemonList(
  limit: number = LIST_PER_PAGE,
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
 * ポケモンの特性詳細情報を取得する
 */
export async function fetchPokemonAbilityDetail(
  url: string
): Promise<PokemonAbilityDetail> {
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

  return imgUrl ?? "/noimage.png";
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
  limit: number = LIST_PER_PAGE
): Promise<{
  pokemon: ProcessedPokemon[];
  pagination: PaginationInfo;
}> {
  const requestLimit =
    page * limit <= POKEMON_ID_UPPER
      ? limit
      : POKEMON_ID_UPPER - (page - 1) * limit;
  const pokemonListRes = await fetchPokemonList(
    requestLimit,
    (page - 1) * limit
  ).catch(() => {
    throw "Pokemon List Response Error";
  });

  const count = POKEMON_ID_UPPER;
  const next = pokemonListRes.next;
  const previous = pokemonListRes.previous;

  const totalPages = Math.ceil(count / limit);

  const pagination = {
    currentPage: page,
    totalPages: totalPages,
    hasNext: next != null && page + 1 <= totalPages,
    hasPrev: previous != null && page > 1,
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

  const processedAbilities = await Promise.allSettled(
    pokemon.abilities.map((ability) => processAbility(ability))
  ).then((result) =>
    result
      .filter((data) => data.status === "fulfilled")
      .map((data) => data.value)
  );

  const processed: ProcessedPokemon = {
    id: pokemon.id,
    name: pokemon.name,
    japaneseName: getJapaneseName(speciesDetail.names) ?? pokemon.name,
    imageUrl: getPokemonImageUrl(pokemon.sprites),
    types: pokemon.types.map((t) => t.type.name),
    height: pokemon.height,
    weight: pokemon.weight,
    genus: getJapaneseGenus(speciesDetail.genera) ?? "",
    abilities: processedAbilities,
  };

  return processed;
}

async function processAbility(
  ability: PokemonAbility
): Promise<ProcessedAbility> {
  if (!ability.ability) return Promise.reject();

  const abilityDetail = await fetchPokemonAbilityDetail(
    ability.ability.url
  ).catch(() => {
    throw "Pokemon ability detail Response Error";
  });

  const processedAbility: ProcessedAbility = {
    flavor_text:
      getJapaneseFlavor(abilityDetail.flavor_text_entries) ?? "説明なし",
    id: abilityDetail.id,
    name: abilityDetail.name,
    japaneseName: getJapaneseName(abilityDetail.names) ?? abilityDetail.name,
    is_hidden: ability.is_hidden,
  };

  return processedAbility;
}

function getJapanese<T extends MultiLangItem>(
  items: T[],
  targetKey: keyof T,
  en_fallback: boolean = false
): string | undefined {
  const hrkt = items.find((item) => item.language.name === "ja-Hrkt")?.[
    targetKey
  ];
  const ja = items.find((item) => item.language.name === "ja")?.[targetKey];

  const en = en_fallback
    ? items.find((item) => item.language.name === "en")?.[targetKey]
    : undefined;

  return (hrkt ?? ja ?? en) as string | undefined;
}

function getJapaneseName(names: Name[]) {
  return getJapanese(names, "name");
}
function getJapaneseFlavor(flavors: FlavorText[]) {
  return getJapanese(flavors, "flavor_text");
}
function getJapaneseGenus(genera: Genus[]) {
  return getJapanese(genera, "genus", true);
}

/**
 * ID/Nameから直接ProcessedPokemonを取得
 * （fetchPokemon + processPokemon）
 */
export async function getProcessedPokemon(
  idOrName: string | number
): Promise<ProcessedPokemon> {
  const pokemon = await fetchPokemon(idOrName);

  return processPokemon(pokemon);
}

export async function getPokemonSearchList(
  n: number
): Promise<PokemonForSearch[]> {
  const pokemonListRes = await fetchPokemonList(n, 0);

  const pokemonSpeciesURLs = pokemonListRes.results.map((pokemon) =>
    pokemon.url.replace(`/pokemon/`, "/pokemon-species/")
  );

  const pokemons = await Promise.allSettled(
    pokemonSpeciesURLs.map((url) => fetchPokemonSpeciesDetail(url))
  ).then((result) =>
    result
      .filter((data) => data.status === "fulfilled")
      .map((data) => data.value)
  );

  const searchPokemons = await Promise.all(
    pokemons.map((pokemon) => {
      return {
        id: pokemon.id,
        name: pokemon.name,
        japaneseName: getJapaneseName(pokemon.names) ?? pokemon.name,
      };
    })
  );

  return searchPokemons;
}

/*-- 進化 --*/

async function fetchEvolutionChain(url: string): Promise<EvolutionChain> {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

export async function getProcessedEvolutionChain(
  idOrName: string | number
): Promise<ProcessedEvolutionChain> {
  const pokemon = await fetchPokemonSpeciesDetail(
    `${BASE_URL}/pokemon-species/${idOrName}`
  );

  const chain = await fetchEvolutionChain(pokemon.evolution_chain.url);

  const processedEvolution = await processEvolution(chain.chain);

  const processed: ProcessedEvolutionChain = {
    id: chain.id,
    baby_trigger_item: chain.baby_trigger_item,
    chain: processedEvolution,
  };

  return processed;
}

async function processEvolution(
  evolution: EvolvesTo
): Promise<ProcessedEvolutionTo> {
  const speciesDetail = await fetchPokemonSpeciesDetail(evolution.species.url);

  const pokemon = await fetchPokemon(speciesDetail.id);

  const evolvesTo = await Promise.all(
    evolution.evolves_to.map((evo) => processEvolution(evo))
  );

  const processed: ProcessedEvolutionTo = {
    evolution_details: evolution.evolution_details,
    is_baby: evolution.is_baby,
    species: evolution.species,
    evolves_to: evolvesTo,
    id: speciesDetail.id,
    name: speciesDetail.name,
    japaneseName: getJapaneseName(speciesDetail.names) ?? speciesDetail.name,
    imageUrl: getPokemonImageUrl(pokemon.sprites),
  };

  return processed;
}
