"use client";

import Link from "next/link";
export function ToList() {
  return (
    <Link
      href="/pokemon"
      className="fixed w-16 h-16 flex justify-center items-center rounded-full bg-gray-800 text-white bottom-4 right-4"
    >
      一覧へ
    </Link>
  );
}
