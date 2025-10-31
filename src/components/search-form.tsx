"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Search } from "lucide-react";

interface SearchFormProps {
  initialQuery?: string;
}

interface FormValues {
  query: string;
}

export function SearchForm({ initialQuery = "" }: SearchFormProps) {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: { query: "" },
    mode: "onChange",
  });

  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const onSubmit = (v: FormValues) => {
    setQuery(v.query);
    router.push(`/search?q=${v.query}`);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value == "") {
      clearErrors(e.target.name as keyof FormValues);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="relative mt-8 w-auto mx-auto sm:w-fit">
        <div className="flex gap-2 justify-center">
          <Input
            type="text"
            placeholder="例：ふしぎ"
            className="bg-white max-w-120 w-full sm:min-w-80 placeholder:text-gray-400"
            {...register("query", {
              required: "ワードを入力してください",
              pattern: {
                value: /[ぁ-ゔァ-ヴｦ-ﾟー]+/,
                message: "ひらがなまたはカタカナで入力してください",
              },
            })}
            aria-invalid={!!errors.query || undefined}
            onBlur={handleBlur}
          ></Input>
          <Button
            variant="default"
            type="submit"
            disabled={isSubmitting}
            className="bg-secondary-500 text-gray-600 font-bold cursor-pointer hover:bg-secondary-400"
          >
            <Search />
            検索
          </Button>
        </div>
        {errors.query && (
          <div className="absolute -bottom-6 left-2 text-red-600 text-xs">
            {errors.query.message}
          </div>
        )}
      </div>
    </form>
  );
}
