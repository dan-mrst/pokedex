"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFormProps {
  initialQuery?: string;
}

export function SearchForm({ initialQuery = "" }: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targets = e.target as typeof e.target & {
      query: { value: string };
    };
    console.log(`search:${targets.query.value}`);
    setQuery(targets.query.value);
    router.push(`/search?q=${targets.query.value}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input type="text" name="query"></Input>
      <Button variant="default" type="submit">
        検索
      </Button>
    </form>
  );
}
