export interface NamedApiResource {
  name: string;
  url: string;
}

// 多言語対応の名前
export interface Name {
  name: string;
  language: NamedApiResource;
}

// ポケモン一覧のレスポンス
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResource[];
}

// 💡 課題: 以下の型も定義してください
// - Pokemon（ポケモンの基本情報）
// - PokemonType（タイプ情報）
// - PokemonSprites（画像情報）
// - PokemonSpeciesDetail（種別詳細情報）

// アプリ内で使用する処理済みポケモンデータ
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

// ページネーション情報
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  totalCount: number;
}
