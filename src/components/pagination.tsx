"use client";

import { PaginationInfo } from "@/lib/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationComponentProps {
  pagination: PaginationInfo;
  basePath: string;
}

export function PaginationComponent({
  pagination,
  basePath,
}: PaginationComponentProps) {
  const queryParmStr =
    basePath.indexOf("?") > 0
      ? basePath.substring(basePath.indexOf("?") + 1)
      : "";

  const baseQuery =
    queryParmStr === "" ? basePath + "?" : basePath + `?${queryParmStr}&`;

  const { currentPage, totalPages, hasNext, hasPrev } = pagination;

  const RANGE = 2;
  const LEFT_BOUNDARY = 3; //1+2
  const RIGHT_BOUNDARY = totalPages - 2;

  return (
    <Pagination>
      <PaginationContent>
        {hasPrev && (
          <PaginationItem>
            <PaginationPrevious href={baseQuery + `page=${currentPage - 1}`}>
              Prev
            </PaginationPrevious>
          </PaginationItem>
        )}

        {currentPage - RANGE > LEFT_BOUNDARY && (
          <>
            <PaginationItem key={1}>
              <PaginationLink href={baseQuery + `page=${1}`}>
                {1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {Array(totalPages)
          .fill(0)
          .map((v, p) => p + 1)
          .filter((p) => {
            /**
             * 1 … 3 4のような省略は無意味なので左範囲をすべて表示
             */
            const shouldShowLeft =
              currentPage - RANGE <= LEFT_BOUNDARY && p < LEFT_BOUNDARY;

            /**
             * 基本の表示範囲
             */
            const isPWithinRange =
              p >= currentPage - RANGE && p <= currentPage + RANGE;

            /**
             * 7 8 … 10のような省略は無意味なので右範囲をすべて表示
             */
            const shouldShowRight =
              currentPage + RANGE >= RIGHT_BOUNDARY && p > RIGHT_BOUNDARY;

            return shouldShowLeft || isPWithinRange || shouldShowRight;
          })
          .map((p) => (
            <PaginationItem key={p}>
              <PaginationLink href={baseQuery + `page=${p}`}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

        {currentPage + RANGE < RIGHT_BOUNDARY && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem key={totalPages}>
              <PaginationLink href={baseQuery + `page=${totalPages}`}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        {hasNext && (
          <PaginationItem>
            <PaginationNext href={baseQuery + `page=${currentPage + 1}`}>
              next
            </PaginationNext>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
