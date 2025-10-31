"use client";

import { cn } from "@/lib/utils";

import Link from "next/link";
import Image from "next/image";
import { pokemonBasic } from "@/lib/types";

interface EvolutionNodeProps {
  id: number;
  size: number;
  pokemon: pokemonBasic;
  isFocused: boolean;
  isCurrent: boolean;
  depth: number;
}

export function EvolutionNode({
  id,
  size,
  pokemon,
  isFocused,
  isCurrent,
  depth,
}: EvolutionNodeProps) {
  return (
    <Link
      data-part="node"
      href={`/pokemon/${pokemon.id}`}
      className="w-fit block"
    >
      <Node
        id={`evolutionNode-${depth}-${id}`}
        className={`bg-white relative hover:shadow-lg transition-shadow cursor-pointer ${
          isCurrent
            ? "border-primary-400"
            : isFocused
            ? "border-secondary-500"
            : "border-gray-300"
        } hover:scale-105 transition-transform duration-300`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          zIndex: 100 - depth,
        }}
        data-name={pokemon.name}
      >
        <NodeContent className="p-4">
          <div className="flex flex-col items-center">
            <Image src={pokemon.imageUrl} width={80} height={80} alt=""></Image>

            <div className="text-muted-foreground text-sm">
              {pokemon.id.toString().padStart(3, "0")}
            </div>

            <div className="font-bold">{pokemon.japaneseName}</div>
          </div>
        </NodeContent>
      </Node>
    </Link>
  );
}

function Node({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-6 rounded-full border-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function NodeContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-6", className)} {...props} />;
}
