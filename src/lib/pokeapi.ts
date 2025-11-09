import {
  BASE_URL,
  LIST_PER_PAGE,
  evolutionDetailTranslations,
  evolutionTerms,
  defaultObject,
} from "@/lib/constants";
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
  EvolutionChain,
  ProcessedEvolutionChain,
  EvolvesTo,
  ProcessedEvolvesTo,
  EvolutionDetail,
  ProcessedEvolutionDetail,
} from "@/lib/types";

import { PaginationInfo } from "@/utils/Paginator";
import { doFetchByDivision } from "@/utils/utils";

/**
 * APIリクエスト
 */
export async function fetchAPIData<T>(
  url: string,
  option: object = {}
): Promise<T> {
  const res = await fetch(url, option);
  const data = await res.json();
  return data;
}

export const POKEMON_ID_UPPER = await (async () => {
  const data = await fetchAPIData<{ count: number }>(
    `${BASE_URL}/pokemon-species/?limit=0`
  );
  return data.count;
})();

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
  }&limit=${Math.min(requestLimit, POKEMON_ID_UPPER)}`;

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
    totalCount: count,
    perPage: limit,
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
    throw "Pokemon species detail Response Error in processPokemon";
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
    genus: getJapaneseGenus(speciesDetail.genera) ?? "分類なし",
    abilities: processedAbilities,
  };

  return processed;
}

/**
 * PokemonAbilityをアプリ用に加工整形
 */
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
 * 任意の対象プロパティーを持つ多言語配列から日本語に対応する対象プロパティーを取得
 * @param items 多言語配列
 * @param targetKey 取り出したいプロパティーのキー
 * @param en_fallback 見つからない時にenの値を返す
 * @returns
 */
export function getJapanese<T extends MultiLangItem>(
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
  try {
    const pokemon = await fetchAPIData<Pokemon>(
      `${BASE_URL}/pokemon/${idOrName}`
    );
    return processPokemon(pokemon);
  } catch {
    return defaultObject<ProcessedPokemon>("ProcessedPokemon");
  }
}

/**
 * 検索用の軽量一覧
 */
export async function getPokemonSearchList(
  n: number
): Promise<PokemonForSearch[]> {
  const listUrl = `${BASE_URL}/pokemon?offset=${0}&limit=${Math.min(
    n,
    POKEMON_ID_UPPER
  )}`;

  const pokemonListRes = await fetchAPIData<PokemonListResponse>(listUrl).catch(
    () => {
      throw "Pokemon list Response Error";
    }
  );

  const searchPokemons = await doFetchByDivision(
    pokemonListRes.results.map((pokemon) =>
      pokemon.url.replace(`${BASE_URL}/pokemon/`, "").replace("/", "")
    ),
    getPokemonForSearch,
    100,
    10
  );

  return searchPokemons.fulfilled;
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

/**
 * idOrNameからSpeciesDetail->evolution_chainの順にリクエストするとEvolutionChainが返ってくるので、chainプロパティをアプリ用に整形する
 * @param idOrName
 * @returns
 */
export async function getProcessedEvolutionChain(
  idOrName: string | number
): Promise<ProcessedEvolutionChain> {
  try {
    const pokemon = await fetchAPIData<PokemonSpeciesDetail>(
      `${BASE_URL}/pokemon-species/${idOrName}`
    );

    const chain = await fetchAPIData<EvolutionChain>(
      pokemon.evolution_chain.url
    );

    const processedEvolution = await processEvolution(chain.chain);

    const processed: ProcessedEvolutionChain = {
      id: chain.id,
      baby_trigger_item: chain.baby_trigger_item,
      chain: processedEvolution,
    };

    return processed;
  } catch (error) {
    return defaultObject<ProcessedEvolutionChain>("ProcessedEvolutionChain");
  }
}

/**
 * EvolvesToをアプリ用に加工整形
 * @param evolution
 * @returns
 */
async function processEvolution(
  evolution: EvolvesTo
): Promise<ProcessedEvolvesTo> {
  const speciesDetail = await fetchAPIData<PokemonSpeciesDetail>(
    evolution.species.url
  ).catch(() => {
    throw "Pokemon species detail Response Error in processEvolution";
  });

  const pokemon = await fetchAPIData<Pokemon>(
    `${BASE_URL}/pokemon/${speciesDetail.id}`
  ).catch(() => {
    throw "Pokemon Response Error in processEvolution";
  });

  const evolvesTo = await Promise.all(
    evolution.evolves_to.map((evo) => processEvolution(evo))
  );
  const conditions = await Promise.all(
    evolution.evolution_details.map((detail) => processEvolutionDetail(detail))
  );

  const processed: ProcessedEvolvesTo = {
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

/**
 * EvolutionDetailをアプリ用に加工整形
 *
 * + EvolutionDetailのキーをタイトルに翻訳または変換
 * + EvolutionDetailの値を条件に変換し配列に並べる
 * @param detail
 * @returns
 */
async function processEvolutionDetail(
  detail: EvolutionDetail
): Promise<ProcessedEvolutionDetail> {
  /**
   * 真のときのみ特定の条件文言を表示するもの
   */
  const useBooleans = ["needs_overworld_rain", "turn_upside_down"];

  /**
   * 数値をそのまま条件として使用するもの
   */
  const useNumbers = [
    "min_affection",
    "min_beauty",
    "min_happiness",
    "min_level",
  ];

  /**
   * 番号に用語を紐付けするもの
   */
  const useIds = ["gender", "relative_physical_stats", "region_id"];

  /**
   * NamedApiResourceのurlにリクエストするもの
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
   * 文字列をそのまま条件として使用するもの
   */
  const useValues = ["time_of_day"];

  /**
   * 対象が1体しかいないようなtrigger
   * (detailsの条件は全てnullや空文字になっている)
   */
  const specialTriggers = Object.keys(evolutionTerms.special);

  const requirements: {
    title: string;
    description: string;
  }[] = [];

  //EvolutionDetailの型に応じて整形
  for (const key of Object.keys(detail) as (keyof EvolutionDetail)[]) {
    if (detail[key] === null || detail[key] === "") continue;

    if (
      typeof detail[key] === "boolean" &&
      useBooleans.includes(key) &&
      detail[key]
    ) {
      requirements.push({
        title: "特殊条件",
        description: evolutionDetailTranslations[key] ?? key,
      });
    } else if (typeof detail[key] === "number" && useNumbers.includes(key)) {
      requirements.push({
        title: evolutionDetailTranslations[key] ?? key,
        description: `${detail[key]}以上`,
      });
    } else if (typeof detail[key] === "number" && useIds.includes(key)) {
      requirements.push({
        title: evolutionDetailTranslations[key] ?? key,
        description: evolutionTerms[key][`${detail[key]}`],
      });
    } else if (typeof detail[key] === "object" && useNames.includes(key)) {
      const translate = await translateEvolutionRequirement(detail[key]).catch(
        () => null
      );
      //APIにある日本語 -> evolutionTermsに定義した日本語 -> 英語そのままの優先順
      requirements.push({
        title: evolutionDetailTranslations[key] ?? key,
        description:
          translate ??
          evolutionTerms[key]?.[detail[key].name] ??
          detail[key].name,
      });
    } else if (typeof detail[key] === "string" && useValues.includes(key)) {
      //APIにある日本語 -> evolutionTermsに定義した日本語 -> 英語そのままの優先順
      requirements.push({
        title: evolutionDetailTranslations[key] ?? key,
        description: evolutionTerms[key]?.[detail[key]] ?? detail[key],
      });
    }
  }

  /**
   * トリガーが特殊でdetail条件が全て空のもの
   */
  if (specialTriggers.includes(detail.trigger.name)) {
    requirements.push({
      title: "条件",
      description: evolutionTerms.special?.[detail.trigger.name] ?? "-",
    });
  }

  const processed: ProcessedEvolutionDetail = {
    trigger: detail.trigger.name,
    requirements: requirements,
  };

  return processed;
}

/**
 * EvolutionDetailがNamedApiResourceで返ってくるものはリクエストして日本語を取得する
 * @param require
 * @returns
 */
async function translateEvolutionRequirement(
  require: NamedApiResource | null
): Promise<string | undefined> {
  if (!require) return undefined;
  const data = await fetchAPIData<{ names: Name[] }>(require.url).catch(() => {
    throw "Pokemon evolution detail Response Error";
  });

  return getJapaneseName(data.names);
}
