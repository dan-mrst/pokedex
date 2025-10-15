import { Suspense } from "react";

interface SearchParams {
  q?: string;
  page?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function SearchPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">ポケモン検索</h1>

      {/* 💡 課題: SearchFormコンポーネントを配置 */}

      {query && (
        <Suspense fallback={<Loading />}>
          {/* 💡 課題: 検索結果を表示するコンポーネント */}
        </Suspense>
      )}
    </div>
  );
}
