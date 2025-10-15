"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchFormProps {
  initialQuery?: string;
}

export function SearchForm({ initialQuery = "" }: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 💡 課題: 検索クエリで /search ページに遷移
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      {/* 💡 課題: 検索用のInputとButtonを配置 */}
    </form>
  );
}
