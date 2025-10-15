import { Suspense } from "react";
import { Loading } from "@/components/loading";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PokemonDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Suspense fallback={<Loading />}>
        <PokemonDetailContent id={id} />
      </Suspense>
    </div>
  );
}

async function PokemonDetailContent({ id }: { id: number }) {
  // 💡 課題: getProcessedPokemon()でポケモンの詳細情報を取得
  // 💡 課題: 基本情報（名前、画像、タイプ、高さ、重さ）を表示
  // 💡 課題: 前後のポケモンへのナビゲーションボタン
  // 💡 課題: エラーハンドリング
}
