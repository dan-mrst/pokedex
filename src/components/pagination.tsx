"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationComponentProps {
  pagination: PaginationInfo;
  basePath: string;
}

export function PaginationComponent({
  pagination,
  basePath,
}: PaginationComponentProps) {
  const { currentPage, totalPages, hasNext, hasPrev } = pagination;

  return (
    <Pagination>
      <PaginationContent>
        {/* 💡 課題: 前のページボタンを実装してください */}
        {/* - hasPrev が true の時のみ表示 */}

        {/* 💡 課題: ページ番号のリンクを実装してください */}
        {/* - 現在のページをハイライト */}

        {/* 💡 課題: 次のページボタンを実装してください */}
        {/* - hasNext が true の時のみ表示 */}
      </PaginationContent>
    </Pagination>
  );
}
