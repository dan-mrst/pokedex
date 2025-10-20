export interface NamedApiResource {
  name: string;
  url: string;
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
 * Pokemon型の補助
 */
interface PokemonAbility {
  ability: NamedApiResource | null;
  is_hidden: boolean;
  slot: number;
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

// 💡 課題: 以下の型も定義してください
// - PokemonSpeciesDetail（種別詳細情報）

export interface PokemonSpeciesDetail {
  genera: Genus[];
  id: number;
  name: string;
  names: Name[];
}

export interface Genus {
  genus: string;
  language: NamedApiResource;
}

/**
 * アプリ内で使用する処理済みポケモンデータ
 * */
export interface ProcessedPokemon {
  id: number;
  name: string;
  japaneseName: string;
  imageUrl: string;
  types: string[];
  height: number;
  weight: number;
  genus: string;
  abilities: ProcessedAbility[];
}

interface ProcessedAbility extends PokemonAbility {
  processed?: string;
}

// ページネーション情報
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  totalCount: number;
}
