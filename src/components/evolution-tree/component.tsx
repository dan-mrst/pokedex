"use client";
import { useState } from "react";

import { ProcessedEvolutionTo } from "@/lib/types";

import { EvolutionNode } from "@/components/evolution-node/component";
import { EvolutionBranch } from "@/components/evolution-branch/component";

interface EvolutionTreeProps {
  pokemon: ProcessedEvolutionTo;
  depth: number;
  pos: number;
  current: number;
  siblings: number;
}

export function EvolutionTree({
  pokemon,
  depth,
  pos,
  current,
  siblings,
}: EvolutionTreeProps) {
  const NODE_SIZE = 160;
  const GENERATION_GAP = 200;

  const conditions = pokemon.conditions;
  const evo = pokemon.evolves_to;

  const offset = pos - (siblings - 1) / 2;

  const x = (NODE_SIZE / 2) * offset;
  const y = 0.84 * NODE_SIZE;

  const rot = Math.round((180 * Math.atan2(x, y)) / Math.PI);
  const stretch =
    GENERATION_GAP / NODE_SIZE / Math.cos(Math.abs(Math.atan2(x, y)));

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const focusDetail = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsFocused(true);
  };

  const blurDetail = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsFocused(false);
  };

  return (
    <div
      className="flex items-center flex-none relative"
      onMouseEnter={focusDetail}
      onMouseLeave={blurDetail}
    >
      {depth > 0 && (
        <EvolutionBranch
          branch={{
            length: (NODE_SIZE / 2 + GENERATION_GAP) * stretch,
            rot: rot,
            nodeSize: NODE_SIZE,
            gap: GENERATION_GAP,
          }}
          details={conditions.map((condition) => {
            return {
              trigger: condition.trigger,
              requirements: condition.requirements,
            };
          })}
          isFocused={isFocused}
        ></EvolutionBranch>
      )}
      <EvolutionNode
        size={NODE_SIZE}
        pokemon={pokemon}
        isCurrent={current === pokemon.id}
      ></EvolutionNode>
      {evo.length > 0 && (
        <div
          className="flex flex-col items-center gap-12"
          style={{ marginLeft: GENERATION_GAP }}
        >
          {evo.map((branch, i) => {
            return (
              <EvolutionTree
                key={i}
                pos={i}
                siblings={evo.length}
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
