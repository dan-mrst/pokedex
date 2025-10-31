"use client";
import { useState, useEffect, useRef } from "react";

import { ProcessedEvolutionTo, pokemonBasic } from "@/lib/types";
import { toDegrees } from "@/lib/functions";
import { useGetElementProperty } from "@/lib/element";

import { EvolutionNode } from "@/components/evolution-node/component";
import { EvolutionBranch } from "@/components/evolution-branch/component";

import { Vector } from "@/lib/Vector";

/**
 * フシギダネ：1
 * ツチニン：290
 * ストライク：123
 * イーブイ：133
 * キルリア:280
 * ケムッソ：265
 */

interface EvolutionTreeProps {
  parent?: pokemonBasic;
  pokemon: ProcessedEvolutionTo;
  depth: number;
  nodeId: number;
  current: number;
  siblings: number;
}

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return width;
};

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
  const GENERATION_GAP = isHorizontal ? 200 : 120;
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
   */
  const extension = isHorizontal
    ? 0
    : nodeId * (nodeDistance.y + (evolvesTo.length > 0 ? nodeDistance.x : 0));

  /**
   * 縦配置の時
   * Xは左右に散らす、Yは90度回転したものを延長する
   */
  const vX = shouldScatter ? ((nodeId % 2) - 0.5) * SCATTER_UNIT : 0;
  const vY = nodeDistance.x + extension;

  /**
   * 横配置の時
   * 世代内の番号を中心水平線からのoffsetに変換
   */
  const offsetY = nodeId - (siblings - 1) / 2;

  /**
   * 親Node（進化元）の中心から見たNodeの位置ベクトル
   */
  const nodeCenter = isHorizontal
    ? new Vector(nodeDistance.x, nodeDistance.y * offsetY)
    : new Vector(vX, vY);

  const [isFocused, setIsFocused] = useState<boolean>(false);

  const focusBranch = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsFocused(true);
  };

  const blurBranch = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsFocused(false);
  };

  return (
    <div
      data-part="tree"
      ref={treeRef}
      className="flex items-center justify-center relative flex-col min-[960px]:flex-row"
      onMouseEnter={focusBranch}
      onMouseLeave={blurBranch}
      style={{ left: `${vX}px` }}
    >
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
          details={conditions.map((condition) => {
            return {
              trigger: condition.trigger,
              requirements: condition.requirements,
            };
          })}
          isFocused={isFocused}
          isHorizontal={isHorizontal}
        ></EvolutionBranch>
      )}
      <EvolutionNode
        id={nodeId}
        size={NODE_SIZE}
        pokemon={pokemon}
        isFocused={isFocused}
        isCurrent={current === pokemon.id}
        depth={depth}
      ></EvolutionNode>
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
