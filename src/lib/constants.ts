export const BASE_URL = "https://pokeapi.co/api/v2";

export const LIST_PER_PAGE = 20;
export const SEARCH_PER_PAGE = 10;

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

export const evolutionTriggerTranslations: Record<string, string> = {
  "level-up": "レベルアップ",
  "use-item": "アイテム使用",
  trade: "通信交換",
  shed: "脱皮",
  spin: "プレイヤーが回転",
  "tower-of-darkness": "あくのかけじく",
  "tower-of-waters": "みずのかけじく",
  "three-critical-hits": "急所ヒット3回",
  "take-damage": "被ダメージ",
  other: "その他",
  "agile-style-move": "早業",
  "strong-style-move": "力業",
  "recoil-damage": "反動ダメージ",
};

export const evolutionDetailTranslations: Record<string, string> = {
  gender: "性別",
  held_item: "持ち物",
  item: "アイテム",
  known_move: "わざ",
  known_move_type: "わざタイプ",
  location: "場所",
  min_affection: "なかよしレベル",
  min_beauty: "美しさ",
  min_happiness: "なかよし度",
  min_level: "レベル",
  needs_overworld_rain: "降雨",
  party_species: "手持ちポケモン",
  party_type: "手持ちタイプ",
  region_id: "地域",
  relative_physical_stats: "種族値",
  time_of_day: "時間帯",
  trade_species: "同時交換",
  turn_upside_down: "本体の上下を逆さに",
};

export const indexedTerms: Record<string, Record<string, string>> = {
  gender: { 1: "メス", 2: "オス" },
  relative_physical_stats: {
    "-1": "こうげき < ぼうぎょ",
    0: "こうげき = ぼうぎょ",
    1: "こうげき > ぼうぎょ",
  },
  location: {
    "eterna-forest": "ハクタイのもり",
  },
  time_of_day: { day: "昼", night: "夜", "full-moon": "満月の夜" },
  special: {
    "tower-of-darkness": "悪の塔で見せる",
    "tower-of-waters": "水の塔で見せる",
    shed: "手持ちに空きがある状態で進化",
  },
};
