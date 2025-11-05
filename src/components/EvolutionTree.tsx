"use client";
import { useState, useRef } from "react";

import { ProcessedEvolvesTo, pokemonBasic } from "@/lib/types";
import useGetElementProperty from "@/hooks/useGetElementProperty";
import useWindowWidth from "@/hooks/useWindowWidth";

import { EvolutionNode } from "@/components/EvolutionNode";
import { EvolutionBranch } from "@/components/EvolutionBranch";

import { Vector } from "@/utils/Vector";

/**
 * 表示確認用
 * フシギダネ：1 -> 分岐なし3段進化
 * ツチニン：290 -> 進化Triggerが特殊
 * ストライク：123 -> 分岐あり2段進化
 * イーブイ：133 -> 最多分岐2段進化
 * ケムッソ：265 -> 3段進化1段目で分岐
 * キルリア:280 -> 3段進化2段目で分岐
 * デスバーン:867 -> 進化Triggerが特殊
 * ダクマ:891 -> 進化Triggerが特殊
 */

interface EvolutionTreeProps {
  parent?: pokemonBasic;
  pokemon: ProcessedEvolvesTo;
  depth: number;
  nodeId: number;
  current: number;
  siblings: number;
}

/**
 * 進化系統図のツリー構造の再帰的繰り返し単位
 */
export function EvolutionTree({
  parent,
  pokemon,
  depth,
  nodeId,
  current,
  siblings,
}: EvolutionTreeProps) {
  const treeRef = useRef<HTMLDivElement>(null);
  const { getElementProperty } = useGetElementProperty<HTMLDivElement | null>(
    treeRef
  );
  const nodeRect = getElementProperty();

  const windowWidth = useWindowWidth();
  const isHorizontal = windowWidth > 960;

  const NODE_SIZE = 160;
  const GENERATION_GAP = isHorizontal ? 200 : 160;
  const SIBLINGS_GAP = 40;
  const SCATTER_UNIT = windowWidth / 2;

  const conditions = pokemon.conditions;
  const evolvesTo = pokemon.evolves_to;

  /**
   * Nodeの大きさを考慮した中心間距離
   *  世代間隔、兄弟間隔の両端にNodeの半径を足す
   */
  const nodeDistance = new Vector(
    NODE_SIZE + GENERATION_GAP,
    NODE_SIZE + SIBLINGS_GAP
  );

  /**
   * 縦配置で兄弟Nodeがあれば左右に散らす
   */
  const shouldScatter = !isHorizontal && siblings > 1;
  /**
   * 縦配置の時はIdが大きいNodeほど兄弟間隔（SIBLINGS_GAP）分下げる
   * 子（進化先）があるときは世代間隔（GENERATION_GAP）も考慮する
   *
   * NOTE:厳密には兄（nodeIdが自分より小さい兄弟要素）全てに進化先があるかを考慮してその合計分下げる必要があるが、分岐ごとに進化段数が異なるポケモンは（今のところ）存在しないので、自分自身の進化先の有無で判定すれば足りる
   */
  const extension = isHorizontal
    ? 0
    : nodeId * (nodeDistance.y + (evolvesTo.length > 0 ? nodeDistance.x : 0));

  /**
   * 縦配置の時の座標
   * Xは左右に散らす、Yは90度回転したものを延長する
   */
  const vX = shouldScatter ? ((nodeId % 2) - 0.5) * SCATTER_UNIT : 0;
  const vY = nodeDistance.x + extension;

  /**
   * 横配置の時
   * 世代内の番号を中心水平線からの線対称なoffsetに変換
   * + 例 [0,1,2] -> [-1,0,1]
   */
  const offsetY = nodeId - (siblings - 1) / 2;

  /**
   * 親Node（進化元）の中心から見たNodeの位置ベクトル
   */
  const nodeCenter = isHorizontal
    ? new Vector(nodeDistance.x, nodeDistance.y * offsetY)
    : new Vector(vX, vY);

  const [isFocused, setIsFocused] = useState<boolean>(false);

  const focusBranch = (e: React.MouseEvent<HTMLElement>) => {
    setIsFocused(true);
  };

  const blurBranch = (e: React.MouseEvent<HTMLElement>) => {
    setIsFocused(false);
  };

  const touchBranch = (e: React.TouchEvent<HTMLElement>) => {
    e.preventDefault();

    if (!isFocused) {
      setIsFocused(true);
    }
  };

  return (
    <div
      data-part="tree"
      ref={treeRef}
      className="flex items-center justify-center relative flex-col min-[960px]:flex-row"
      onMouseEnter={focusBranch}
      onMouseLeave={blurBranch}
      onTouchStart={touchBranch}
      style={{ left: `${vX}px` }}
    >
      {/* 1段目（depth = 0）は枝を描かない */}
      {depth > 0 && (
        <EvolutionBranch
          parent={parent}
          node={{
            id: nodeId,
            size: NODE_SIZE,
            depth: depth,
            y: nodeRect.y,
          }}
          branch={nodeCenter}
          details={conditions}
          isFocused={isFocused}
          isHorizontal={isHorizontal}
        ></EvolutionBranch>
      )}
      <EvolutionNode
        nodeId={nodeId}
        size={NODE_SIZE}
        pokemon={pokemon}
        isFocused={isFocused}
        isCurrent={current === pokemon.id}
        depth={depth}
      ></EvolutionNode>
      {/* 進化先があれば再帰的にツリーを呼び出し */}
      {evolvesTo.length > 0 && (
        <div
          className="flex items-center flex-col"
          style={{
            marginLeft: isHorizontal ? GENERATION_GAP : 0,
            marginTop: isHorizontal ? 0 : GENERATION_GAP,
            rowGap: `${SIBLINGS_GAP}px`,
          }}
        >
          {evolvesTo.map((branch, i) => {
            return (
              <EvolutionTree
                parent={pokemon}
                key={i}
                nodeId={i}
                siblings={evolvesTo.length}
                pokemon={branch}
                depth={depth + 1}
                current={current}
              ></EvolutionTree>
            );
          })}
        </div>
      )}
    </div>
  );
}
