export interface NamedApiResource {
  name: string;
  url: string;
}

export interface MultiLangItem {
  language: NamedApiResource;
}

/**
 * 多言語対応の名前
 */
export interface Name {
  name: string;
  language: NamedApiResource;
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

export interface PokemonSpeciesDetail {
  genera: Genus[];
  id: number;
  name: string;
  names: Name[];
  evolution_chain: { url: string };
}

export interface Genus {
  genus: string;
  language: NamedApiResource;
}

export interface pokemonBasic {
  id: number;
  imageUrl: string;
  name: string;
  japaneseName: string;
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
 * Pokemon型内の特性
 */
export interface PokemonAbility {
  ability: NamedApiResource | null;
  is_hidden: boolean;
  slot: number;
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

/**
 * 検索機能に用いる全リスト用のPokemon省略版
 */
export interface PokemonForSearch {
  id: number;
  name: string;
  japaneseName: string;
}

/*-- 進化 --*/

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
  evolution_details: EvolutionDetails[];
  evolves_to: EvolvesTo[];
  is_baby: boolean;
  species: NamedApiResource;
}

/**
 * 進化の詳細
 */
export interface EvolutionDetails {
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
 * アプリ内で使用する処理済み進化データ
 */
export interface ProcessedEvolutionChain extends EvolutionChain {
  chain: ProcessedEvolutionTo;
}
export interface ProcessedEvolutionTo extends EvolvesTo, pokemonBasic {
  evolves_to: ProcessedEvolutionTo[];
  conditions: ProcessedEvolutionDetails[];
}

export interface ProcessedEvolutionDetails {
  trigger: string;
  requirements: {
    title: string;
    description: string;
  }[];
}

// ページネーション情報
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  totalCount: number;
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
