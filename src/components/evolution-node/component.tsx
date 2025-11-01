"use client";

import { useState, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import Link from "next/link";
import Image from "next/image";
import { pokemonBasic } from "@/lib/types";
import { isTouchDevice } from "@/lib/functions";

import { ChevronRight } from "lucide-react";

interface EvolutionNodeProps {
  nodeId: number;
  size: number;
  pokemon: pokemonBasic;
  isFocused: boolean;
  isCurrent: boolean;
  depth: number;
}

export function EvolutionNode({
  nodeId,
  size,
  pokemon,
  isFocused,
  isCurrent,
  depth,
}: EvolutionNodeProps) {
  const nodeRef = useRef<HTMLAnchorElement>(null);

  const [isLinkActive, setIsLinkActive] = useState<boolean>(
    !isTouchDevice() || false
  );

  useEffect(() => {
    if (!nodeRef.current) return;
    const hundleClickOutside = (e: MouseEvent) => {
      if (!nodeRef.current?.contains(e.target as Node)) {
        setIsLinkActive(false);
      }
    };

    document.addEventListener("click", hundleClickOutside);

    return () => {
      document.removeEventListener("click", hundleClickOutside);
    };
  }, [nodeRef]);

  const handleLink = (e: React.MouseEvent<HTMLElement>) => {
    if (!isTouchDevice()) return;
    if (!isLinkActive) {
      e.preventDefault();
      setIsLinkActive(true);
    } else {
      setIsLinkActive(false);
    }
  };

  const isTouched = isTouchDevice() && isFocused && isLinkActive;

  return (
    <Link
      data-part="node"
      href={`/pokemon/${pokemon.id}`}
      className="w-fit block"
      onClick={handleLink}
      ref={nodeRef}
    >
      <Node
        id={`evolutionNode-${depth}-${nodeId}`}
        className={`bg-white relative hover:shadow-lg transition-shadow cursor-pointer ${
          isCurrent
            ? "border-primary-400"
            : isFocused
            ? "border-secondary-500"
            : "border-gray-300"
        }
        ${
          !isTouchDevice()
            ? "hover:scale-105"
            : isTouched
            ? "scale-105 sm:scale-110"
            : ""
        }
        transition-transform duration-300`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          zIndex: 100 - depth,
        }}
        data-name={pokemon.name}
      >
        <NodeContent className="p-4">
          <div className="flex flex-col items-center">
            <Image src={pokemon.imageUrl} width={72} height={72} alt=""></Image>

            <div className="pokemon-id">
              {pokemon.id.toString().padStart(3, "0")}
            </div>

            <div className="font-bold">{pokemon.japaneseName}</div>
            {isTouched && (
              <div
                className={`${
                  isCurrent ? "text-primary-400" : "text-secondary-600"
                } text-xs  font-bold flex items-center`}
              >
                <ChevronRight size={16} className="-mt-0.5" />
                詳細
              </div>
            )}
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
