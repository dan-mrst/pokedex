"use client";

import { cn } from "@/lib/utils";

import Link from "next/link";
import Image from "next/image";
import { pokemonBasic } from "@/lib/types";

interface EvolutionNodeProps {
  size: number;
  pokemon: pokemonBasic;
  isCurrent?: boolean;
}

export function EvolutionNode({
  size,
  pokemon,
  isCurrent = false,
}: EvolutionNodeProps) {
  return (
    <Link href={`/pokemon/${pokemon.id}`} className="w-fit block">
      <Node
        className={`bg-white relative z-[10] hover:shadow-lg transition-shadow cursor-pointer ${
          isCurrent ? "border-blue-300" : "border-gray-300"
        }`}
        style={{ width: `${size}px`, height: `${size}px` }}
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
