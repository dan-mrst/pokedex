import {
  Name,
  NamedApiResource,
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
  ProcessedEvolutionDetails,
} from "@/lib/types";

import {
  BASE_URL,
  LIST_PER_PAGE,
  evolutionDetailTranslations,
  indexedTerms,
} from "@/lib/constants";

export const POKEMON_ID_UPPER = await (async () => {
  const res = await fetch(`${BASE_URL}/pokemon-species/?limit=0`);
  const data: PokemonListResponse = await res.json();
  return data.count;
})();

const SAFE_POKEMON_LIMIT = POKEMON_ID_UPPER - 20;

/**
 * ポケモン一覧を取得する
 */
async function fetchAPIData<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

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

  const requestUrl = `${BASE_URL}/pokemon?offset=${
    (page - 1) * limit
  }&limit=${Math.min(requestLimit, SAFE_POKEMON_LIMIT)}`;

  const pokemonListRes = await fetchAPIData<PokemonListResponse>(
    requestUrl
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

  const processedPokemons = await Promise.allSettled(
    pokemonIDs.map((ID) => getProcessedPokemon(ID))
  ).then((result) =>
    result
      .filter((data) => data.status === "fulfilled")
      .map((data) => data.value)
  );

  return { pokemon: processedPokemons, pagination: pagination };
}

/**
 * Pokemonをアプリ用に加工整形
 */
async function processPokemon(pokemon: Pokemon): Promise<ProcessedPokemon> {
  const speciesDetail = await fetchAPIData<PokemonSpeciesDetail>(
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

  const abilityDetail = await fetchAPIData<PokemonAbilityDetail>(
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

/**
 * ポケモンの画像URLを取得する
 */
function getPokemonImageUrl(sprites: Pokemon["sprites"]): string {
  const imgUrl =
    "official-artwork" in sprites.other
      ? sprites.other["official-artwork"]["front_default"]
      : "home" in sprites.other
      ? sprites.other["home"]["front_default"]
      : sprites["front_default"];

  return imgUrl ?? "/noimage.png";
}

/**
 *
 * 任意のキーの多言語配列から日本語を取得
 * @param items
 * @param targetKey
 * @param en_fallback
 * @returns
 */
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
  const pokemon = await fetchAPIData<Pokemon>(
    `${BASE_URL}/pokemon/${idOrName}`
  );

  return processPokemon(pokemon);
}

/**
 * 検索用の軽量一覧
 */
export async function getPokemonSearchList(
  n: number
): Promise<PokemonForSearch[]> {
  const listUrl = `${BASE_URL}/pokemon?offset=${0}&limit=${Math.min(
    n,
    SAFE_POKEMON_LIMIT
  )}`;

  const pokemonListRes = await fetchAPIData<PokemonListResponse>(listUrl);

  const searchPokemons = await Promise.allSettled(
    pokemonListRes.results.map((pokemon) => getPokemonForSearch(pokemon.name))
  ).then((result) =>
    result
      .filter((data) => data.status === "fulfilled")
      .map((data) => data.value)
  );

  return searchPokemons;
}

/**
 * ID/Nameから直接PokemonForSearchを取得
 */
export async function getPokemonForSearch(
  idOrName: number | string
): Promise<PokemonForSearch> {
  const detail = await fetchAPIData<PokemonSpeciesDetail>(
    `${BASE_URL}/pokemon-species/${idOrName}`
  );

  return {
    id: detail.id,
    name: detail.name,
    japaneseName: getJapaneseName(detail.names) ?? detail.name,
  };
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
  const pokemon = await fetchAPIData<PokemonSpeciesDetail>(
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
  const speciesDetail = await fetchAPIData<PokemonSpeciesDetail>(
    evolution.species.url
  );

  const pokemon = await fetchAPIData<Pokemon>(
    `${BASE_URL}/pokemon/${speciesDetail.id}`
  );

  const evolvesTo = await Promise.all(
    evolution.evolves_to.map((evo) => processEvolution(evo))
  );
  const conditions = await Promise.all(
    evolution.evolution_details.map((detail) => processEvolutionDetail(detail))
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
    conditions: conditions,
  };

  return processed;
}

async function processEvolutionDetail(
  details: EvolutionDetails
): Promise<ProcessedEvolutionDetails> {
  const useBooleans = ["needs_overworld_rain", "turn_upside_down"];

  /**
   * 数値をそのまま使用
   */
  const useNumbers = [
    "min_affection",
    "min_beauty",
    "min_happiness",
    "min_level",
  ];

  /**
   * 番号に用語を紐付け
   */
  const useIds = ["gender", "relative_physical_stats", "region_id"];

  /**
   * urlにリクエスト
   */
  const useNames = [
    "held_item",
    "item",
    "known_move",
    "known_move_type",
    "location",
    "party_species",
    "party_type",
    "trade_species",
  ];

  /**
   * 文字列をそのまま使用
   */
  const useValues = ["time_of_day"];

  /**
   * 特殊条件を表示
   */
  const specialTriggers = ["shed", "tower-of-darkness", "tower-of-waters"];

  const requirements: {
    title: string;
    description: string;
  }[] = [];

  for (const key of Object.keys(details) as (keyof EvolutionDetails)[]) {
    if (details[key] === null || details[key] === "") continue;

    if (
      typeof details[key] === "boolean" &&
      useBooleans.includes(key) &&
      details[key]
    ) {
      requirements.push({
        title: "特殊条件",
        description: evolutionDetailTranslations[key] ?? key,
      });
    } else if (typeof details[key] === "number" && useNumbers.includes(key)) {
      requirements.push({
        title: evolutionDetailTranslations[key] ?? key,
        description: `${details[key]}以上`,
      });
    } else if (typeof details[key] === "number" && useIds.includes(key)) {
      requirements.push({
        title: evolutionDetailTranslations[key] ?? key,
        description: indexedTerms[key][`${details[key]}`],
      });
    } else if (typeof details[key] === "object" && useNames.includes(key)) {
      const translate = await translateEvolutionRequirement(details[key]).catch(
        () => null
      );
      requirements.push({
        title: evolutionDetailTranslations[key] ?? key,
        description:
          translate ??
          indexedTerms[key]?.[details[key]?.name ?? ""] ??
          details[key]?.name,
      });
    } else if (typeof details[key] === "string" && useValues.includes(key)) {
      requirements.push({
        title: evolutionDetailTranslations[key] ?? key,
        description: indexedTerms[key]?.[details[key]] ?? details[key],
      });
    }
  }
  if (specialTriggers.includes(details.trigger.name)) {
    requirements.push({
      title: "条件",
      description: indexedTerms.special?.[details.trigger.name] ?? "-",
    });
  }

  const processed: ProcessedEvolutionDetails = {
    trigger: details.trigger.name,
    requirements: requirements,
  };

  return processed;
}

async function translateEvolutionRequirement(
  require: NamedApiResource | null
): Promise<string | undefined> {
  if (!require) return undefined;
  const data = await fetchAPIData<{ names: Name[] }>(require.url);

  return getJapanese(data.names, "name");
}
