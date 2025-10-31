"use client";

import Link from "next/link";
import { Grid3x2 } from "lucide-react";

export function ToList() {
  return (
    <Link
      href="/pokemon"
      className="fixed w-16 h-16 flex flex-col z-999 justify-center items-center gap-1 rounded-full bg-gray-800 text-white text-sm bottom-4 right-4 shadow-lg hover:text-secondary-400"
    >
      <Grid3x2 />
      一覧へ
    </Link>
  );
}
