"use client";

import {
  PaginationInfo,
  Paginator,
  PaginationOmitter,
} from "@/utils/Paginator";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationButtonsProps {
  pagination: PaginationInfo;
  basePath: string;
}
interface PaginationCounterProps {
  pagination: PaginationInfo;
}

export function PaginationCounter({ pagination }: PaginationCounterProps) {
  const paginator = new Paginator(pagination);

  return (
    paginator.shouldPaginate() && (
      <div className="mt-4 w-fit mx-auto text-gray-400">
        <span className="text-base">
          {paginator.isCorrectPage()
            ? `${paginator.firstItemOfCurrentPage()} - ${paginator.lastItemOfCurrentPage()}`
            : "--"}
        </span>
        <span className="mt-0.5 text-sm">／{`${paginator.totalCount}`}</span>
      </div>
    )
  );
}

export function PaginationButtons({
  pagination,
  basePath,
}: PaginationButtonsProps) {
  const queryParmStr =
    basePath.indexOf("?") > 0
      ? basePath.substring(basePath.indexOf("?") + 1)
      : "";

  const baseQuery =
    queryParmStr === ""
      ? basePath + "?"
      : basePath.substring(0, basePath.indexOf("?")) + `?${queryParmStr}&`;

  const paginator = new Paginator({ ...pagination });
  const { currentPage, totalPages, hasNext, hasPrev } = paginator;

  const omitter = new PaginationOmitter(paginator, 2);

  const {
    shouldShowOmittedLeft,
    shouldShowPageInLeft,
    isPageWithinRange,
    shouldShowPageInRight,
    shouldShowOmittedRight,
  } = omitter;

  return (
    <Pagination className="mt-8 text-primary-900">
      <PaginationContent className="flex-wrap">
        {hasPrev() && (
          <PaginationItem>
            <PaginationPrevious
              href={baseQuery + `page=${currentPage - 1}`}
              isActive={true}
            >
              Prev
            </PaginationPrevious>
          </PaginationItem>
        )}

        {shouldShowOmittedLeft() && (
          <>
            <PaginationItem key={1}>
              <PaginationLink
                href={baseQuery + `page=${1}`}
                isActive={currentPage !== 1}
              >
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
          .map((_, p) => p + 1)
          .filter(
            (p) =>
              shouldShowPageInLeft(p) ||
              isPageWithinRange(p) ||
              shouldShowPageInRight(p)
          )
          .map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href={baseQuery + `page=${p}`}
                isActive={currentPage !== p}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

        {shouldShowOmittedRight() && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem key={totalPages}>
              <PaginationLink
                href={baseQuery + `page=${totalPages}`}
                isActive={currentPage !== totalPages}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        {hasNext() && (
          <PaginationItem>
            <PaginationNext
              href={baseQuery + `page=${currentPage + 1}`}
              isActive={true}
            >
              next
            </PaginationNext>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
