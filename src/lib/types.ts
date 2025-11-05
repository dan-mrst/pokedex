export interface NamedApiResource {
  name: string;
  url: string;
}

/**
 * 多言語情報を含むオブジェクトの雛形
 */
export interface MultiLangItem {
  language: NamedApiResource;
}

/**
 * 多言語対応の名前
 */
export interface Name extends MultiLangItem {
  name: string;
}

/**
 * ポケモン一覧のレスポンス
 */
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResource[];
}
/**
 * 個別のポケモンのレスポンス
 */
export interface Pokemon {
  abilities: PokemonAbility[];
  height: number;
  id: number;
  name: string;
  species: NamedApiResource;
  sprites: PokemonSprites;
  types: PokemonType[];
  weight: number;
}

/**
 * Pokemon型内の特性
 */
export interface PokemonAbility {
  ability: NamedApiResource | null;
  is_hidden: boolean;
  slot: number;
}

/**
 * Pokemon型の補助
 */
interface PokemonType {
  slot: number;
  type: NamedApiResource;
}

/**
 * PokemonSprites型の原型
 */
interface PokemonSprite {
  front_default: string | null;
  front_female?: string | null;
  front_shiny?: string | null;
  front_shiny_female?: string | null;
  back_default?: string | null;
  back_female?: string | null;
  back_shiny?: string | null;
  back_shiny_female?: string | null;
}
/**
 * Pokemon型の補助
 */
interface PokemonSprites extends PokemonSprite {
  other: {
    [key: string]: PokemonSprite;
  };
  versions: {
    [generation: string]: {
      [version: string]: PokemonSprite;
    };
  };
}

/**
 * 種族詳細のレスポンス
 */
export interface PokemonSpeciesDetail {
  genera: Genus[];
  id: number;
  name: string;
  names: Name[];
  evolution_chain: { url: string };
}

/**
 * 属性
 */
export interface Genus {
  genus: string;
  language: NamedApiResource;
}

/**
 * アプリ内で使用する処理済みポケモンデータ
 */
export interface ProcessedPokemon extends pokemonBasic {
  types: string[];
  height: number;
  weight: number;
  genus: string;
  abilities: ProcessedAbility[];
}

/**
 * 検索機能に用いる全リスト用のProcessedPokemon省略版
 */
export interface PokemonForSearch {
  id: number;
  name: string;
  japaneseName: string;
}
/**
 * idと名前、画像のみのProcessedPokemon省略版
 */
export interface pokemonBasic {
  id: number;
  imageUrl: string;
  name: string;
  japaneseName: string;
}

/**
 * Abilityのレスポンス
 */
export interface PokemonAbilityDetail {
  flavor_text_entries: FlavorText[];
  id: number;
  name: string;
  names: Name[];
}

/**
 * PokemonAbilityDetailの補助：特性の説明
 */
export interface FlavorText {
  flavor_text: string;
  language: NamedApiResource;
  version_group: NamedApiResource;
}

/**
 * アプリ内で使用する処理済み特性データ
 */
export interface ProcessedAbility {
  flavor_text: string;
  id: number;
  japaneseName: string;
  name: string;
  is_hidden: boolean;
}

/*-- 進化 --*/

/*
 * EvolutionChain: /evolution-chain/~ のレスポンス
 * chain: 進化先と条件を再帰的構造で示したもの
 * evolves_to: chainの再帰構造の繰り返し単位
 * evolution_details: 進化条件の詳細
 *  trigger（例：レベルアップ）と条件（例：レベルxx以上）群からなる
 */

/**
 * evolution-chainのレスポンス
 */
export interface EvolutionChain {
  id: number;
  chain: EvolvesTo;
  baby_trigger_item: NamedApiResource | null;
}

/**
 * evolves_toの再帰的型
 */
export interface EvolvesTo {
  evolution_details: EvolutionDetail[];
  evolves_to: EvolvesTo[];
  is_baby: boolean;
  species: NamedApiResource;
}

/**
 * 進化の詳細
 */
export interface EvolutionDetail {
  gender: number | null;
  held_item: NamedApiResource | null;
  item: NamedApiResource | null;
  known_move: NamedApiResource | null;
  known_move_type: NamedApiResource | null;
  location: NamedApiResource | null;
  min_affection: number | null;
  min_beauty: number | null;
  min_happiness: number | null;
  min_level: number | null;
  needs_overworld_rain: boolean;
  party_species: NamedApiResource;
  party_type: NamedApiResource;
  region_id: number | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: NamedApiResource | null;
  trigger: NamedApiResource;
  turn_upside_down: boolean;
}

/**
 * アプリ内で使用する処理済み進化チェーンデータ
 */
export interface ProcessedEvolutionChain extends EvolutionChain {
  chain: ProcessedEvolvesTo;
}

/**
 * アプリ内で使用する処理済み進化先データ
 */
export interface ProcessedEvolvesTo extends EvolvesTo, pokemonBasic {
  evolves_to: ProcessedEvolvesTo[];
  conditions: ProcessedEvolutionDetail[];
}

/**
 * アプリ内で使用する処理済み進化条件詳細データ
 */
export interface ProcessedEvolutionDetail {
  trigger: string;
  requirements: {
    title: string;
    description: string;
  }[];
}

/**
 * evolution-triggerのレスポンス
 */
export interface EvolutionTrigger {
  id: number;
  name: string;
  names: Name[];
  pokemon_species: NamedApiResource[];
}
