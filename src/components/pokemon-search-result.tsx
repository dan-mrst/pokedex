"use client";

import { PokemonCard } from "@/components/pokemon-card";
import { PaginationComponent } from "@/components/pagination/component";

import {
  PaginationInfo,
  PokemonForSearch,
  ProcessedPokemon,
} from "@/lib/types";
import { getProcessedPokemon } from "@/lib/pokeapi";
import { SEARCH_PER_PAGE } from "@/lib/constants";
import { hiraToKata } from "@/lib/functions";

interface Props {
  query: string;
  fullList: PokemonForSearch[];
  processedList: ProcessedPokemon[];
  pagination: PaginationInfo;
}

export async function PokemonSearchResult({
  query,
  fullList,
  processedList,
  pagination,
}: Props) {
  return (
    <div className="mt-12">
      <div className="text-sm text-gray-500">
        <p>{`「${query}」の検索結果：${pagination.totalCount}件${
          pagination.totalCount > 0 ? "見つかりました" : ""
        }`}</p>
      </div>
      {pagination.totalCount > 0 &&
        pagination.currentPage <= pagination.totalPages && (
          <div className="mt-4 w-fit mx-auto text-gray-400">
            <span className="text-base">
              {`${
                SEARCH_PER_PAGE * (pagination.currentPage - 1) + 1
              } - ${Math.min(
                pagination.totalCount,
                SEARCH_PER_PAGE * pagination.currentPage
              )}`}
            </span>
            <span className="mt-0.5 text-sm">
              ／{`${pagination.totalCount}`}
            </span>
          </div>
        )}
      {pagination.currentPage <= pagination.totalPages && (
        <ul className="pokemons-list">
          {processedList.map((item) => (
            <li key={item.id}>
              <PokemonCard pokemon={item}></PokemonCard>
            </li>
          ))}
        </ul>
      )}
      {pagination.totalCount != 0 &&
        pagination.currentPage > pagination.totalPages && (
          <div className="text-center text-sm text-gray-400 mt-2">
            ページ指定が誤っています
          </div>
        )}

      <PaginationComponent
        pagination={pagination}
        basePath={`/search?q=${query}`}
      ></PaginationComponent>
    </div>
  );
}
